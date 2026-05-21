import { assertEquals, assertThrows } from "@std/assert";
import {
  buildPowerTotemResource,
  ensureValidDuration,
  isGatewaySessionAuthorized,
  nextSessionStatus,
  type PowerSessionAction,
  type PowerSessionStatus,
  sanitizeQrSlug,
} from "./powerTotemDomain.ts";

Deno.test("buildPowerTotemResource produces the protected x402 resource path", () => {
  assertEquals(
    buildPowerTotemResource("totem_rj_01"),
    "/power-totem/totem_rj_01/session",
  );
});

Deno.test("buildPowerTotemResource rejects unsafe identifiers", () => {
  for (const identifier of ["..", "totem/rj", "totem rj"]) {
    assertThrows(
      () => buildPowerTotemResource(identifier),
      Error,
      "Power Totem identifier must contain only letters, numbers, dashes, and underscores.",
    );
  }
});

Deno.test("sanitizeQrSlug creates a stable slug for a totem name", () => {
  assertEquals(
    sanitizeQrSlug("Kivo Power Totem RJ 01"),
    "kivo-power-totem-rj-01",
  );
  assertEquals(sanitizeQrSlug("  Mesa VIP  "), "mesa-vip");
});

Deno.test("ensureValidDuration accepts the demo-safe range", () => {
  assertEquals(ensureValidDuration(30), 30);
  assertEquals(ensureValidDuration(3600), 3600);
});

Deno.test("ensureValidDuration rejects unsafe durations", () => {
  assertThrows(
    () => ensureValidDuration(4),
    Error,
    "Session duration must be between 5 and 3600 seconds.",
  );
});

Deno.test("Power Totem lifecycle requires payment before gateway authorization", () => {
  const unpaid = {
    id: "session_1",
    status: "payment_required",
    authorized_at: null,
  };

  const paid = {
    id: "session_1",
    status: "authorized",
    authorized_at: new Date().toISOString(),
  };

  assertEquals(isGatewaySessionAuthorized(unpaid), false);
  assertEquals(isGatewaySessionAuthorized(paid), true);
});

Deno.test("nextSessionStatus allows every valid transition", () => {
  const cases: Array<{
    current: PowerSessionStatus;
    action: PowerSessionAction;
    next: PowerSessionStatus;
  }> = [
    {
      current: "requested",
      action: "require_payment",
      next: "payment_required",
    },
    { current: "requested", action: "fail", next: "failed" },
    { current: "requested", action: "expire", next: "expired" },
    { current: "payment_required", action: "mark_paid", next: "paid" },
    { current: "payment_required", action: "fail", next: "failed" },
    { current: "payment_required", action: "expire", next: "expired" },
    { current: "paid", action: "authorize", next: "authorized" },
    { current: "paid", action: "fail", next: "failed" },
    { current: "paid", action: "expire", next: "expired" },
    { current: "authorized", action: "start", next: "running" },
    { current: "authorized", action: "fail", next: "failed" },
    { current: "authorized", action: "expire", next: "expired" },
    { current: "running", action: "complete", next: "completed" },
    { current: "running", action: "fail", next: "failed" },
  ];

  for (const { current, action, next } of cases) {
    assertEquals(nextSessionStatus(current, action), next);
  }
});

Deno.test("nextSessionStatus rejects running without authorization", () => {
  assertThrows(
    () => nextSessionStatus("paid", "start"),
    Error,
    "Cannot apply action start to session status paid.",
  );
});

Deno.test("nextSessionStatus rejects transitions from terminal states", () => {
  const cases: Array<{
    current: PowerSessionStatus;
    action: PowerSessionAction;
  }> = [
    { current: "completed", action: "complete" },
    { current: "expired", action: "expire" },
    { current: "failed", action: "fail" },
  ];

  for (const { current, action } of cases) {
    assertThrows(
      () => nextSessionStatus(current, action),
      Error,
      `Cannot apply action ${action} to session status ${current}.`,
    );
  }
});
