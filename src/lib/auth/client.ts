import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { FirebaseStateStore, FirebaseSessionStore } from "./firebase-storage";

// グローバルなタイムアウト設定 (ミリ秒)
const DEFAULT_TIMEOUT = 10000; // 10秒に短縮
const MAX_RETRIES = 3; // 最大リトライ回数

// 遅延関数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// リトライ付きリクエスト
const fetchWithRetry = async (input: RequestInfo, init?: RequestInit, retries = MAX_RETRIES) => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      console.log(`Attempt ${i + 1}/${retries} - ${input}`);
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;
      
      if (i < retries - 1) {
        const backoff = Math.pow(2, i) * 1000; // Exponential backoff
        console.warn(`Request failed (attempt ${i + 1}/${retries}), retrying in ${backoff}ms...`, error);
        await delay(backoff);
      }
    }
  }
  
  throw lastError || new Error('Unknown error occurred during fetch');
};

export const createClient = () => {
  const publicUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.PUBLIC_URL || 'http://localhost:3000';
    
  const enc = encodeURIComponent;
  const redirectUri = `${publicUrl}/api/oauth/callback`;
  
  console.log('Creating OAuth client with config:', {
    publicUrl,
    redirectUri,
    nodeEnv: process.env.NODE_ENV,
  });

  return new NodeOAuthClient({
    clientMetadata: {
      client_name: "Dekoboko App",
      client_id: publicUrl.endsWith('localhost:3000')
        ? `http://localhost?redirect_uri=${enc(redirectUri)}&scope=${enc("atproto transition:generic")}`
        : `${publicUrl}/client-metadata.json`,
      client_uri: publicUrl,
      redirect_uris: [redirectUri],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    stateStore: new FirebaseStateStore(),
    sessionStore: new FirebaseSessionStore(),
    fetch: fetchWithRetry as any,
  });
};
