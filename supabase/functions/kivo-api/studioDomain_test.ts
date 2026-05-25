import { assertEquals } from "@std/assert";
import {
  createStudioFlowFromIntent,
  getLaunchOptionsForValidation,
  listStudioTemplates,
} from "./studioDomain.ts";

Deno.test("createStudioFlowFromIntent recommends a digital API guard for API monetization", () => {
  const flow = createStudioFlowFromIntent({
    id: "intent_api",
    prompt: "Quero cobrar por uma API de dados",
    surface: "digital",
    interactionModel: "M2M",
    recommendedGatewayMode: "api_guard",
    createdAt: "2026-05-19T12:00:00Z",
  });

  assertEquals(flow.gatewayMode, "api_guard");
  assertEquals(flow.status, "needs_setup");
});

Deno.test("getLaunchOptionsForValidation blocks private mainnet until validation passes", () => {
  const options = getLaunchOptionsForValidation("needs_connection");
  const privateMainnet = options.find((option) =>
    option.id === "private_mainnet"
  );

  assertEquals(privateMainnet?.enabled, false);
  assertEquals(
    privateMainnet?.reason,
    "Validacao testnet precisa passar antes de mainnet privada.",
  );
});

Deno.test("listStudioTemplates exposes only Power Totem as functional", () => {
  const functional = listStudioTemplates().filter((template) =>
    template.status === "functional"
  );

  assertEquals(functional.length, 1);
  assertEquals(functional[0].id, "power-totem");
});
