import type { GatewayRunAuthorization, PowerOutputAdapter } from "../types.js";

export interface SimulatorHistoryEntry {
  action: "enable" | "disable";
  sessionId: string;
}

export class SimulatorPowerAdapter implements PowerOutputAdapter {
  public readonly name = "simulator";
  public enabled = false;
  public readonly history: SimulatorHistoryEntry[] = [];

  async enable(authorization: GatewayRunAuthorization): Promise<void> {
    this.enabled = true;
    this.history.push({ action: "enable", sessionId: authorization.id });
  }

  async disable(authorization: GatewayRunAuthorization): Promise<void> {
    this.enabled = false;
    this.history.push({ action: "disable", sessionId: authorization.id });
  }
}
