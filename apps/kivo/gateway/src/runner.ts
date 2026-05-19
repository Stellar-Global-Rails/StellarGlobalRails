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

  client.assertCanCompleteSessions?.();
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
  try {
    await client.createGatewayEvent({
      eventType: "session.started",
      sessionId: authorization.id,
      payload: {
        adapter: adapter.name,
        durationSeconds: authorization.durationSeconds,
      },
    });
    await adapter.enable(authorization);
    enabled = true;

    if (shouldWaitForDuration) {
      await sleep(Math.max(0, authorization.durationSeconds) * 1000);
    }
  } finally {
    if (enabled) {
      await adapter.disable(authorization);
    }
  }

  await client.completeSession(authorization.id);
  await client.createGatewayEvent({
    eventType: "session.completed",
    sessionId: authorization.id,
    payload: {
      adapter: adapter.name,
      durationSeconds: authorization.durationSeconds,
    },
  });
}
