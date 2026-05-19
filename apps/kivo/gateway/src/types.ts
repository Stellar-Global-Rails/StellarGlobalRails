export type GatewayAdapterName = "simulator" | "raspberry";

export type GatewayStatus =
  | "pairing"
  | "online"
  | "offline"
  | "suspended";

export type PowerSessionStatus =
  | "requested"
  | "payment_required"
  | "paid"
  | "authorized"
  | "running"
  | "completed"
  | "expired"
  | "failed";

export interface Gateway {
  id: string;
  totemId?: string | null;
  name: string;
  tokenPreview: string;
  status: GatewayStatus;
  adapter: GatewayAdapterName;
  lastSeenAt?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayRunAuthorization {
  id: string;
  durationSeconds: number;
  resource?: string;
  status?: PowerSessionStatus;
}

export interface PowerSession extends GatewayRunAuthorization {
  totemId: string;
  gatewayId?: string | null;
  paymentId?: string | null;
  amount: string;
  asset: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayEvent {
  id: string;
  gatewayId?: string | null;
  totemId?: string | null;
  sessionId?: string | null;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface GatewayEventInput {
  eventType: "session.started" | "session.completed" | string;
  sessionId?: string | null;
  payload?: Record<string, unknown>;
}

export interface GatewayAuthorizationResponse {
  authorization: GatewayRunAuthorization | null;
}

export interface GatewayClient {
  assertCanCompleteSessions?(): void;
  heartbeat(): Promise<Gateway | void>;
  getAuthorization(): Promise<GatewayAuthorizationResponse>;
  createGatewayEvent(input: GatewayEventInput): Promise<GatewayEvent | void>;
  completeSession(sessionId: string): Promise<PowerSession | void>;
}

export interface PowerOutputAdapter {
  readonly name: GatewayAdapterName;
  enable(authorization: GatewayRunAuthorization): Promise<void>;
  disable(authorization: GatewayRunAuthorization): Promise<void>;
}

export interface RunOnceOptions {
  client: GatewayClient;
  adapter: PowerOutputAdapter;
  sleep?: (milliseconds: number) => Promise<void>;
  shouldWaitForDuration?: boolean;
  processedSessionIds?: Set<string>;
}

export type RunOnceResult =
  | { status: "idle" }
  | { status: "completed"; sessionId: string }
  | { status: "skipped"; sessionId: string };
