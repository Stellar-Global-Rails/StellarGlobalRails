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
  public readonly calls: string[] = [];
  public heartbeats = 0;

  constructor(
    private readonly authorization: GatewayRunAuthorization | null,
    private readonly failEventType?: string,
  ) {}

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
      "authorized",
      "output_enabled",
      "output_disabled",
      "completed",
    ]);
    expect(client.calls).toEqual([
      "heartbeat",
      "getAuthorization",
      "event:authorized",
      "event:output_enabled",
      "event:output_disabled",
      "event:completed",
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

  it("does not enable output if reporting the authorization event fails", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 30,
    }, "authorized");

    await expect(runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow("Failed to send authorized");

    expect(adapter.enabled).toBe(false);
    expect(adapter.history).toEqual([]);
    expect(client.events.map((event) => event.eventType)).toEqual(["failed"]);
  });

  it("disables output and reports failed if reporting the completed event fails", async () => {
    const adapter = new SimulatorPowerAdapter();
    const client = new FakeGatewayClient({
      id: "session_1",
      durationSeconds: 30,
    }, "completed");

    await expect(runOnce({
      client,
      adapter,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow("Failed to send completed");

    expect(adapter.enabled).toBe(false);
    expect(client.events.map((event) => event.eventType)).toEqual([
      "authorized",
      "output_enabled",
      "output_disabled",
      "failed",
    ]);
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
      client: new FakeGatewayClient(authorization, "completed"),
      adapter: firstAdapter,
      processedSessionIds,
      sleep: async () => undefined,
      shouldWaitForDuration: false,
    })).rejects.toThrow("Failed to send completed");

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
