import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { FirebaseStateStore, FirebaseSessionStore } from "./firebase-storage";

// グローバルなタイムアウト設定 (ミリ秒)
const DEFAULT_TIMEOUT = 30000; // 30秒

export const createClient = async () => {
  const publicUrl = process.env.PUBLIC_URL;
  const url = publicUrl || `http://127.0.0.1:3000`;
  const enc = encodeURIComponent;

  // カスタムフェッチ関数でタイムアウトを設定
  const fetchWithTimeout = async (input: RequestInfo, init?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${DEFAULT_TIMEOUT}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return new NodeOAuthClient({
    clientMetadata: {
      client_name: "AT Protocol Express App",
      client_id: publicUrl
        ? `${url}/client-metadata.json`
        : `http://localhost?redirect_uri=${enc(
            `${url}/api/oauth/callback`
          )}&scope=${enc("atproto transition:generic")}`,
      client_uri: url,
      redirect_uris: [`${url}/api/oauth/callback`],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    stateStore: new FirebaseStateStore(),
    sessionStore: new FirebaseSessionStore(),
    // カスタムフェッチ関数を設定
    fetch: fetchWithTimeout as any,
  });
};
