export type PowerSessionStatus =
  | "requested"
  | "payment_required"
  | "paid"
  | "authorized"
  | "running"
  | "completed"
  | "expired"
  | "failed";

export type PowerSessionAction =
  | "require_payment"
  | "mark_paid"
  | "authorize"
  | "start"
  | "complete"
  | "expire"
  | "fail";

const transitions: Record<
  PowerSessionStatus,
  Partial<Record<PowerSessionAction, PowerSessionStatus>>
> = {
  requested: {
    require_payment: "payment_required",
    fail: "failed",
    expire: "expired",
  },
  payment_required: { mark_paid: "paid", fail: "failed", expire: "expired" },
  paid: { authorize: "authorized", fail: "failed", expire: "expired" },
  authorized: { start: "running", fail: "failed", expire: "expired" },
  running: { complete: "completed", fail: "failed" },
  completed: {},
  expired: {},
  failed: {},
};

export function sanitizeQrSlug(input: string): string {
  const slug = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "power-totem";
}

export function buildPowerTotemResource(totemIdOrSlug: string): string {
  const value = totemIdOrSlug.trim();
  if (!value) {
    throw new Error("Power Totem identifier is required.");
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    throw new Error(
      "Power Totem identifier must contain only letters, numbers, dashes, and underscores.",
    );
  }
  return `/power-totem/${encodeURIComponent(value)}/session`;
}

export function ensureValidDuration(durationSeconds: number): number {
  if (
    !Number.isInteger(durationSeconds) || durationSeconds < 5 ||
    durationSeconds > 3600
  ) {
    throw new Error("Session duration must be between 5 and 3600 seconds.");
  }
  return durationSeconds;
}

export function isGatewaySessionAuthorized(session: {
  status: string;
  authorized_at: string | null;
}): boolean {
  return session.status === "authorized" && Boolean(session.authorized_at);
}

export function nextSessionStatus(
  current: PowerSessionStatus,
  action: PowerSessionAction,
): PowerSessionStatus {
  const next = transitions[current][action];
  if (!next) {
    throw new Error(
      `Cannot apply action ${action} to session status ${current}.`,
    );
  }
  return next;
}
