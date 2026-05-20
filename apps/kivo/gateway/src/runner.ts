import type {
  GatewayRunAuthorization,
  PowerOutputAdapter,
  RunOnceOptions,
  RunOnceResult,
} from "./types.js";

const defaultSleep = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export async function runOnce(options: RunOnceOptions): Promise<RunOnceResult> {
  const {
    client,
    adapter,
    sleep = defaultSleep,
    shouldWaitForDuration = process.env.NODE_ENV !== "test",
    processedSessionIds,
  } = options;

  await client.heartbeat();

  const { authorization } = await client.getAuthorization();
  if (!authorization) {
    return { status: "idle" };
  }
  if (processedSessionIds?.has(authorization.id)) {
    return { status: "skipped", sessionId: authorization.id };
  }
  processedSessionIds?.add(authorization.id);

  await runAuthorizedSession({
    authorization,
    adapter,
    client,
    sleep,
    shouldWaitForDuration,
  });

  return { status: "completed", sessionId: authorization.id };
}

export async function startPolling(options: RunOnceOptions & {
  intervalMilliseconds: number;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
}): Promise<void> {
  const { intervalMilliseconds, signal, onError, ...runOptions } = options;
  const processedSessionIds = runOptions.processedSessionIds ??
    new Set<string>();

  while (!signal?.aborted) {
    try {
      await runOnce({ ...runOptions, processedSessionIds });
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    }

    if (!signal?.aborted) {
      await (runOptions.sleep ?? defaultSleep)(intervalMilliseconds);
    }
  }
}

async function runAuthorizedSession(
  options: Omit<RunOnceOptions, "sleep"> & {
    authorization: GatewayRunAuthorization;
    sleep: (milliseconds: number) => Promise<void>;
  },
): Promise<void> {
  const { authorization, adapter, client, sleep, shouldWaitForDuration } =
    options;

  let enabled = false;
  let currentSessionId: string | null = authorization.id;
  try {
    await client.createGatewayEvent({
      eventType: "authorized",
      sessionId: authorization.id,
      payload: {
        durationSeconds: authorization.durationSeconds,
      },
    });
    await adapter.enable(authorization);
    enabled = true;
    await client.createGatewayEvent({
      eventType: "output_enabled",
      sessionId: authorization.id,
      payload: {
        adapter: adapter.name,
      },
    });

    if (shouldWaitForDuration) {
      await sleep(Math.max(0, authorization.durationSeconds) * 1000);
    }

    if (enabled) {
      await adapter.disable(authorization);
      enabled = false;
      await client.createGatewayEvent({
        eventType: "output_disabled",
        sessionId: authorization.id,
        payload: {
          adapter: adapter.name,
        },
      });
    }

    await client.createGatewayEvent({
      eventType: "completed",
      sessionId: authorization.id,
      payload: {
        completedAt: new Date().toISOString(),
        durationSeconds: authorization.durationSeconds,
      },
    });
  } catch (error) {
    if (enabled) {
      await adapter.disable(authorization);
    }
    await client.createGatewayEvent({
      eventType: "failed",
      sessionId: currentSessionId,
      payload: {
        message: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}
