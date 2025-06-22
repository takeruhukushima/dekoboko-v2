import { NodeOAuthClient, type NodeOAuthClientOptions } from "@atproto/oauth-client-node";
import { FirebaseStateStore, FirebaseSessionStore } from "./firebase-storage";

// Firebaseの初期化を確認
import { db } from "@/lib/firebase";

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

export const createClient = async () => {
  console.log('Creating OAuth client...');
  
  // AT Protocolの公式サンプルに基づく設定
  const isProduction = process.env.NODE_ENV === 'production';
  
  let publicUrl: string;
  let clientId: string;
  
  if (isProduction) {
    // 本番環境
    publicUrl = 'https://dekobokov2.vercel.app';
    clientId = `${publicUrl}/client-metadata.json`;
  } else {
    // 開発環境 - 動的に生成
    publicUrl = process.env.PUBLIC_URL || 'http://127.0.0.1:3000';
    const enc = encodeURIComponent;
    clientId = `http://localhost?redirect_uri=${enc(
      `${publicUrl}/api/oauth/callback`
    )}&scope=${enc("atproto transition:generic")}`;
  }
  
  const url = publicUrl;
  
  console.log('Creating OAuth client with config:', {
    publicUrl,
    url,
    clientId,
    isProduction,
    nodeEnv: process.env.NODE_ENV,
  });

  // AT Protocolの公式サンプルに基づくOAuthクライアント設定
  const client = new NodeOAuthClient({
    clientMetadata: {
      client_name: isProduction ? "Dekoboko App" : "Dekoboko App (Dev)",
      client_id: clientId,
      client_uri: url,
      redirect_uris: [`${url}/api/oauth/callback`],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    
    // Firebaseストレージを使用
    stateStore: new FirebaseStateStore(),
    sessionStore: new FirebaseSessionStore(),
  });

  console.log('OAuth client created successfully:', {
    clientId: client.clientMetadata.client_id,
    redirectUris: client.clientMetadata.redirect_uris,
    scope: client.clientMetadata.scope,
  });

  return client;
};
