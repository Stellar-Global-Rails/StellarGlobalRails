import { spawn } from "node:child_process";
import type { GatewayRunAuthorization, PowerOutputAdapter } from "../types.js";

export interface RaspberryShellAdapterOptions {
  enableCommand?: string;
  disableCommand?: string;
}

export class RaspberryShellAdapter implements PowerOutputAdapter {
  public readonly name = "raspberry";

  private readonly enableCommand?: string;
  private readonly disableCommand?: string;

  constructor(options: RaspberryShellAdapterOptions = {}) {
    this.enableCommand = options.enableCommand;
    this.disableCommand = options.disableCommand;
  }

  async enable(authorization: GatewayRunAuthorization): Promise<void> {
    await runConfiguredCommand(this.enableCommand, "enable", authorization);
  }

  async disable(authorization: GatewayRunAuthorization): Promise<void> {
    await runConfiguredCommand(this.disableCommand, "disable", authorization);
  }
}

async function runConfiguredCommand(
  commandLine: string | undefined,
  action: "enable" | "disable",
  authorization: GatewayRunAuthorization,
): Promise<void> {
  if (!commandLine?.trim()) {
    throw new Error(
      `Raspberry adapter ${action} command is not configured.`,
    );
  }

  const [command, ...args] = splitCommand(commandLine);
  if (!command) {
    throw new Error(
      `Raspberry adapter ${action} command is not configured.`,
    );
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      env: {
        ...process.env,
        KIVO_SESSION_ID: authorization.id,
        KIVO_DURATION_SECONDS: String(authorization.durationSeconds),
      },
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `Raspberry adapter ${action} command exited with code ${code}.`,
        ),
      );
    });
  });
}

function splitCommand(commandLine: string): string[] {
  const parts = commandLine.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  return parts.map((part) => part.replace(/^"|"$/g, ""));
}
