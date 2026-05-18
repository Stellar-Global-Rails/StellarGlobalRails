import { assertEquals, assertRejects } from "@std/assert";
import {
  buildPowerTotemResource,
  ensureValidDuration,
  nextSessionStatus,
  sanitizeQrSlug,
} from "./powerTotemDomain.ts";

Deno.test("buildPowerTotemResource produces the protected x402 resource path", () => {
  assertEquals(
    buildPowerTotemResource("totem_rj_01"),
    "/power-totem/totem_rj_01/session",
  );
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

Deno.test("ensureValidDuration rejects unsafe durations", async () => {
  await assertRejects(
    async () => ensureValidDuration(4),
    Error,
    "Session duration must be between 5 and 3600 seconds.",
  );
});

Deno.test("nextSessionStatus allows paid to authorized", () => {
  assertEquals(nextSessionStatus("paid", "authorize"), "authorized");
});

Deno.test("nextSessionStatus rejects running without authorization", async () => {
  await assertRejects(
    async () => nextSessionStatus("paid", "start"),
    Error,
    "Cannot apply action start to session status paid.",
  );
});
