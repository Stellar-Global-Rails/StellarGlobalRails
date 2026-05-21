import { assert, assertEquals } from "@std/assert";
import {
  buildGatewayBundleFiles,
  buildGatewayBundleZip,
  deriveKivoApiUrl,
} from "./gatewayBundle.ts";

Deno.test("deriveKivoApiUrl keeps the Supabase function base path", () => {
  assertEquals(
    deriveKivoApiUrl(
      "https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api/v1/power-totems/totem_1/gateway-bundle",
    ),
    "https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api",
  );
});

Deno.test("buildGatewayBundleFiles includes docker, local DB, UI, and credentials", () => {
  const files = buildGatewayBundleFiles({
    apiUrl: "https://api.kivo.example/functions/v1/kivo-api",
    gatewayId: "gateway_123",
    gatewayToken: "kgw_secret",
    gatewayName: "RJ gateway",
    adapter: "raspberry",
    totemName: "Power Totem RJ",
    totemResource: "/power-totem/totem_1/session",
    price: "0.2500000",
    asset: "USDC:GTEST",
    durationSeconds: 30,
  });
  const paths = files.map((file) => file.path);

  assert(paths.includes("docker-compose.yml"));
  assert(paths.includes(".env"));
  assert(paths.includes(".env.example"));
  assert(paths.includes("README.md"));
  assert(paths.includes("gateway/src/index.js"));
  assert(paths.includes("totem-ui/index.html"));
  assert(
    files.find((file) => file.path === ".env")?.content.includes(
      "KIVO_GATEWAY_TOKEN=kgw_secret",
    ),
  );
  assert(
    files.find((file) => file.path === "docker-compose.yml")?.content.includes(
      "local-db:",
    ),
  );
});

Deno.test("buildGatewayBundleFiles generates a buyer-facing EV Charge UI", () => {
  const files = buildGatewayBundleFiles({
    apiUrl: "https://api.kivo.example/functions/v1/kivo-api",
    gatewayId: "gateway_123",
    gatewayToken: "kgw_secret",
    gatewayName: "RJ gateway",
    adapter: "raspberry",
    totemName: "Kivo EV Charge RJ",
    totemResource: "/power-totem/totem_1/session",
    price: "0.2500000",
    asset: "USDC:GTEST",
    durationSeconds: 30,
  });
  const html = files.find((file) => file.path === "totem-ui/index.html")?.content ?? "";

  assert(html.includes("Kivo EV Charge"));
  assert(html.includes("Aproxime a camera ou siga o checkout Kivo"));
  assert(html.includes("Escaneie para recarregar"));
  assert(html.includes("/power-totem/totem_1/session"));
  assert(!html.includes("Iniciar runtime"));
  assert(!html.includes("Executar poll agora"));
  assert(!html.includes("Atualizar status"));
  assert(!html.includes("<pre id=\"status\">"));
});

Deno.test("buildGatewayBundleZip produces a zip payload", () => {
  const zip = buildGatewayBundleZip({
    apiUrl: "https://api.kivo.example/functions/v1/kivo-api",
    gatewayId: "gateway_123",
    gatewayToken: "kgw_secret",
    gatewayName: "RJ gateway",
    adapter: "raspberry",
    totemName: "Power Totem RJ",
    totemResource: "/power-totem/totem_1/session",
    price: "0.2500000",
    asset: "USDC:GTEST",
    durationSeconds: 30,
  });

  assert(zip.length > 1024);
  assertEquals(zip[0], 0x50);
  assertEquals(zip[1], 0x4b);
  assertEquals(zip[2], 0x03);
  assertEquals(zip[3], 0x04);
});
