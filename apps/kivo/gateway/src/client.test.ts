import { describe, expect, it } from "vitest";
import { KivoGatewayClient } from "./client.js";

describe("KivoGatewayClient", () => {
  it("heartbeat sends the exact gateway URL, method, and token", async () => {
    let requestedUrl = "";
    let requestedMethod = "";
    let gatewayToken = "";

    const client = new KivoGatewayClient({
      baseUrl: "https://api.kivo.example/",
      gatewayId: "gateway_123",
      gatewayToken: "kgw_secret",
      fetcher: async (input, init) => {
        requestedUrl = input.toString();
        requestedMethod = init?.method ?? "GET";
        gatewayToken = new Headers(init?.headers).get("x-gateway-token") ?? "";

        return new Response(
          JSON.stringify({
            id: "gateway_123",
            name: "RJ gateway",
            status: "online",
            adapter: "simulator",
            tokenPreview: "kgw...",
            metadata: {},
            createdAt: "2026-05-18T00:00:00.000Z",
            updatedAt: "2026-05-18T00:00:00.000Z",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },
    });

    await client.heartbeat();

    expect(requestedUrl).toBe(
      "https://api.kivo.example/v1/gateways/gateway_123/heartbeat",
    );
    expect(requestedMethod).toBe("POST");
    expect(gatewayToken).toBe("kgw_secret");
  });

  it("sends the gateway token on authorization and events", async () => {
    const seen = new Map<string, string>();
    const client = new KivoGatewayClient({
      baseUrl: "https://api.kivo.example",
      gatewayId: "gateway_123",
      gatewayToken: "kgw_secret",
      fetcher: async (input, init) => {
        seen.set(
          input.toString(),
          new Headers(init?.headers).get("x-gateway-token") ?? "",
        );

        if (input.toString().endsWith("/authorization")) {
          return Response.json({ authorization: null });
        }

        return Response.json(
          {
            id: "event_1",
            gatewayId: "gateway_123",
            eventType: "session.started",
            payload: {},
            createdAt: "2026-05-18T00:00:00.000Z",
          },
          { status: 201 },
        );
      },
    });

    await client.getAuthorization();
    await client.createGatewayEvent({
      eventType: "session.started",
      sessionId: "session_1",
      payload: { adapter: "simulator" },
    });

    expect(
      seen.get("https://api.kivo.example/v1/gateways/gateway_123/authorization"),
    ).toBe("kgw_secret");
    expect(
      seen.get("https://api.kivo.example/v1/gateways/gateway_123/events"),
    ).toBe("kgw_secret");
  });

  it("completes sessions by sending only gateway lifecycle events", async () => {
    let requestedUrl = "";
    let requestedMethod = "";
    let authorization = "";
    let gatewayToken = "";
    const client = new KivoGatewayClient({
      baseUrl: "https://api.kivo.example",
      gatewayId: "gateway_123",
      gatewayToken: "kgw_secret",
      fetcher: async (input, init) => {
        requestedUrl = input.toString();
        requestedMethod = init?.method ?? "GET";
        const headers = new Headers(init?.headers);
        authorization = headers.get("authorization") ?? "";
        gatewayToken = headers.get("x-gateway-token") ?? "";
        return Response.json(
          {
            id: "event_1",
            gatewayId: "gateway_123",
            eventType: "session.completed",
            payload: {},
            createdAt: "2026-05-18T00:00:00.000Z",
          },
          { status: 201 },
        );
      },
    });

    await client.createGatewayEvent({
      eventType: "session.completed",
      sessionId: "session_1",
    });

    expect(requestedUrl).toBe("https://api.kivo.example/v1/gateways/gateway_123/events");
    expect(requestedMethod).toBe("POST");
    expect(gatewayToken).toBe("kgw_secret");
    expect(authorization).toBe("");
  });

  it("uses the current Edge API error message shape", async () => {
    const client = new KivoGatewayClient({
      baseUrl: "https://api.kivo.example",
      gatewayId: "gateway_123",
      gatewayToken: "kgw_secret",
      fetcher: async () =>
        Response.json(
          {
            error: "gateway_unauthorized",
            message: "Gateway token is invalid.",
            status: 401,
          },
          { status: 401 },
        ),
    });

    await expect(client.heartbeat()).rejects.toThrow(
      "Gateway token is invalid.",
    );
  });
});
