import { describe, expect, it } from "vitest";
import { SimulatorPowerAdapter } from "./adapters/simulator.js";
import { runOnce } from "./runner.js";
import type {
  GatewayClient,
  GatewayEventInput,
  GatewayRunAuthorization,
} from "./types.js";

class FakeGatewayClient implements GatewayClient {
  public readonly events: GatewayEventInput[] = [];
  public readonly completedSessions: string[] = [];
  public readonly calls: string[] = [];
  public heartbeats = 0;

  constructor(
    private readonly authorization: GatewayRunAuthorization | null,
    private readonly failEventType?: string,
    private readonly failComplete = false,
  ) {}

  assertCanCompleteSessions() {
    this.calls.push("assertCanCompleteSessions");
  }

  async heartbeat() {
    this.heartbeats += 1;
    this.calls.push("heartbeat");
  }

  async getAuthorization() {
    this.calls.push("getAuthorization");
    return { authorization: this.authorization };
  }

  async createGatewayEvent(input: GatewayEventInput) {
    if (input.eventType === this.failEventType) {
      throw new Error(`Failed to send ${input.eventType}`);
    }
    this.calls.push(`event:${input.eventType}`);
    this.events.push(input);
  }

  async completeSession(sessionId: string) {
    this.calls.push("completeSession");
    if (this.failComplete) {
      throw new Error("Completion failed");
    }
    this.completedSessions.push(sessionId);
  }
}

describe("runOnce", () => {
  it("enables then disables simulator output and reports lifecycle events", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 30,
    });

    await runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    });

    expect(client.heartbeats).toBe(1);
    expect(adapter.enabled).toBe(false);
    expect(adapter.history).toEqual([
      { action: "enable", sessionId: "session_1" },
      { action: "disable", sessionId: "session_1" },
    ]);
    expect(client.events.map((event) => event.eventType)).toEqual([
      "session.started",
      "session.completed",
    ]);
    expect(client.completedSessions).toEqual(["session_1"]);
    expect(client.calls).toEqual([
      "assertCanCompleteSessions",
      "heartbeat",
      "getAuthorization",
      "event:session.started",
      "completeSession",
      "event:session.completed",
    ]);
  });

  it("does not enable output when there is no authorization", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient(null);

    await runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    });

    expect(adapter.history).toEqual([]);
    expect(client.events).toEqual([]);
    expect(client.completedSessions).toEqual([]);
  });

  it("waits for the authorized duration when configured to wait", async () => {
    const waited: number[] = [];
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 7,
    });

    await runOnce({
      client,
      adapter,
      sleep: async (milliseconds) => {
        waited.push(milliseconds);
      },
      shouldWaitForDuration: true,
    });

    expect(waited).toEqual([7000]);
  });

  it("does not enable output if reporting the start event fails", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 30,
    }, "session.started");

    await expect(runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow("Failed to send session.started");

    expect(adapter.enabled).toBe(false);
    expect(adapter.history).toEqual([]);
    expect(client.completedSessions).toEqual([]);
  });

  it("checks completion readiness before heartbeat or authorization", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 30,
    });
    client.assertCanCompleteSessions = () => {
      client.calls.push("assertCanCompleteSessions");
      throw new Error(
        "KIVO_API_TOKEN is required before completing Power Sessions.",
      );
    };

    await expect(runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow(
      "KIVO_API_TOKEN is required before completing Power Sessions.",
    );

    expect(client.calls).toEqual(["assertCanCompleteSessions"]);
    expect(adapter.history).toEqual([]);
  });

  it("does not emit completed event when completion fails", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 30,
    }, undefined, true);

    await expect(runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow("Completion failed");

    expect(adapter.enabled).toBe(false);
    expect(client.events.map((event) => event.eventType)).toEqual([
      "session.started",
    ]);
    expect(client.completedSessions).toEqual([]);
  });

  it("skips a repeated authorization when sharing processed session ids", async () => {
    const processedSessionIds = new Set<string>();
    const firstAdapter = new SimulatorPowerAdapter();
    const secondAdapter = new SimulatorPowerAdapter();
    const authorization = {
      id: "session_1",
      durationSeconds: 30,
    };

    await expect(runOnce({
      client: new FakeGatewayClient(authorization, undefined, true),
      adapter: firstAdapter,
      processedSessionIds,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow("Completion failed");

    const secondResult = await runOnce({
      client: new FakeGatewayClient(authorization),
      adapter: secondAdapter,
      processedSessionIds,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    });

    expect(secondResult).toEqual({ status: "skipped", sessionId: "session_1" });
    expect(firstAdapter.history).toEqual([
      { action: "enable", sessionId: "session_1" },
      { action: "disable", sessionId: "session_1" },
    ]);
    expect(secondAdapter.history).toEqual([]);
  });
});
