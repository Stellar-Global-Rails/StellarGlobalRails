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
  public heartbeats = 0;

  constructor(
    private readonly authorization: GatewayRunAuthorization | null,
    private readonly failEventType?: string,
  ) {}

  async heartbeat() {
    this.heartbeats += 1;
  }

  async getAuthorization() {
    return { authorization: this.authorization };
  }

  async createGatewayEvent(input: GatewayEventInput) {
    if (input.eventType === this.failEventType) {
      throw new Error(`Failed to send ${input.eventType}`);
    }
    this.events.push(input);
  }

  async completeSession(sessionId: string) {
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

  it("disables output if reporting the start event fails", async () => {
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
    expect(adapter.history).toEqual([
      { action: "enable", sessionId: "session_1" },
      { action: "disable", sessionId: "session_1" },
    ]);
    expect(client.completedSessions).toEqual([]);
  });
});
