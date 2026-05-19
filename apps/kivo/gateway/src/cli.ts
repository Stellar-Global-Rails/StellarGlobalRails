import { RaspberryShellAdapter } from "./adapters/raspberry.js";
import { SimulatorPowerAdapter } from "./adapters/simulator.js";
import { KivoGatewayClient } from "./client.js";
import { runOnce, startPolling } from "./runner.js";
import type { PowerOutputAdapter } from "./types.js";

const command = process.argv[2] ?? "once";

async function main(): Promise<void> {
  if (command !== "once" && command !== "start") {
    throw new Error("Usage: npm run dev -- once | start");
  }

  const client = new KivoGatewayClient({
    baseUrl: requiredEnv("KIVO_API_URL"),
    gatewayId: requiredEnv("KIVO_GATEWAY_ID"),
    gatewayToken: requiredEnv("KIVO_GATEWAY_TOKEN"),
    apiToken: process.env.KIVO_API_TOKEN,
  });
  const adapter = createAdapter();
  const waitForDuration = readBooleanEnv("KIVO_GATEWAY_WAIT", true);
  const intervalMilliseconds = readNumberEnv(
    "KIVO_GATEWAY_POLL_INTERVAL_MS",
    5000,
  );

  if (command === "once") {
    const result = await runOnce({
      client,
      adapter,
      shouldWaitForDuration: waitForDuration,
    });
    console.log(JSON.stringify(result));
    return;
  }

  const controller = new AbortController();
  process.once("SIGINT", () => controller.abort());
  process.once("SIGTERM", () => controller.abort());

  await startPolling({
    client,
    adapter,
    intervalMilliseconds,
    shouldWaitForDuration: waitForDuration,
    signal: controller.signal,
    onError: (error) => {
      console.error(error instanceof Error ? error.message : error);
    },
  });
}

function createAdapter(): PowerOutputAdapter {
  const adapter = process.env.KIVO_GATEWAY_ADAPTER ?? "simulator";
  if (adapter === "simulator") {
    return new SimulatorPowerAdapter();
  }
  if (adapter === "raspberry") {
    return new RaspberryShellAdapter({
      enableCommand: process.env.KIVO_GATEWAY_ENABLE_COMMAND,
      disableCommand: process.env.KIVO_GATEWAY_DISABLE_COMMAND,
    });
  }
  throw new Error(`Unsupported KIVO_GATEWAY_ADAPTER: ${adapter}`);
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function readNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }
  return parsed;
}

function readBooleanEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
