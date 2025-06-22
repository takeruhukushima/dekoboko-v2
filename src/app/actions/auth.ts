"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/client";
import { sessionOptions, SessionData } from "@/lib/session";

declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}

const client = await createClient();

// エラーメッセージのマッピング
const ERROR_MESSAGES: Record<string, string> = {
  timeout: '認証処理が時間内に完了しませんでした。時間をおいて再度お試しください。',
  invalid_handle: '無効なハンドルです。正しいハンドルを入力してください。',
  network: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
  default: '認証中にエラーが発生しました。しばらくしてからもう一度お試しください。',
};

function validateAndFormatHandle(handle: string): string {
  console.log('Original handle:', JSON.stringify(handle));
  
  if (!handle) {
    throw new Error('ハンドルが指定されていません。');
  }
  
  // Remove any leading @, trim whitespace, and clean up the string
  const cleanHandle = handle
    .replace(/^[@\s]+/, '')  // Remove leading @ and whitespace
    .replace(/[\s@]+$/, '')  // Remove trailing @ and whitespace
    .trim()
    // Remove any non-printable characters and normalize
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFFEF]/g, '');
    
  console.log('Cleaned handle:', JSON.stringify(cleanHandle));
  
  // If empty after cleanup
  if (!cleanHandle) {
    throw new Error('有効なハンドルを入力してください。');
  }
  
  // Check if the handle is already in the correct format with domain
  const domainMatch = cleanHandle.match(/^([a-zA-Z0-9_-]+)(\.([a-zA-Z0-9.-]+))?$/);
  
  if (!domainMatch) {
    throw new Error('無効なハンドル形式です。例: username または username.bsky.social');
  }
  
  const username = domainMatch[1];
  const domain = domainMatch[3]; // The part after the first dot
  
  // Validate username format (only allow ASCII letters, numbers, hyphens, and underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw new Error('ハンドル名には半角英数字、ハイフン、アンダースコアのみ使用できます。');
  }
  
  // If there's a domain part
  if (domain) {
    // Validate domain parts
    const domainParts = domain.split('.').filter(Boolean);
    
    // Check each part of the domain
    for (const part of domainParts) {
      if (!/^[a-zA-Z0-9-]+$/.test(part)) {
        throw new Error('ドメイン名に使用できない文字が含まれています。半角英数字、ハイフンのみ使用できます。');
      }
      
      // Check if part starts or ends with hyphen
      if (part.startsWith('-') || part.endsWith('-')) {
        throw new Error('ドメインの各セクションはハイフンで始まったり終わったりすることはできません。');
      }
      
      // Check part length
      if (part.length > 63) {
        throw new Error('ドメインの各セクションは63文字以下である必要があります。');
      }
    }
    
    // Check total length
    if (domain.length > 253) {
      throw new Error('ドメイン名全体は253文字以下である必要があります。');
    }
    
    return `${username}.${domain}`;
  }
  
  // If no domain, use default bsky.social
  return `${username}.bsky.social`;
}

const AUTH_TIMEOUT_MS = 30000; // 30秒でタイムアウト

export async function authorize(formData: FormData) {
  console.log(`[${new Date().toISOString()}] Authorization started`);
  const startTime = Date.now();
  
  try {
    const handle = formData.get("handle") as string;
    console.log('Handle received:', handle);

    if (!handle) {
      throw new Error("ハンドルが指定されていません。");
    }

    // 1. ハンドルの検証とフォーマット
    console.log('Validating handle...');
    const formattedHandle = validateAndFormatHandle(handle);
    console.log('Formatted handle:', formattedHandle);
    
    // 2. 認証URLの取得
    console.log('Requesting authorization URL...');
    
    try {
      console.log('Creating authorization URL with handle:', formattedHandle);
      
      // AT ProtocolのOAuthクライアントを使用して認証URLを取得
      const url = await client.authorize(formattedHandle, {
        scope: "atproto transition:generic",
      });
      
      if (!url) {
        throw new Error('認証URLの取得に失敗しました');
      }
      
      const elapsed = (Date.now() - startTime) / 1000;
      console.log(`Authorization URL received in ${elapsed.toFixed(1)} seconds`);
      console.log('Redirecting to:', url);
      
      // リダイレクト - これは正常な動作
      redirect(url.toString());
      
    } catch (authError) {
      console.error('Authorization error:', authError);
      
      // NEXT_REDIRECTは正常なリダイレクトなので、再スローする
      if (authError instanceof Error && authError.message === 'NEXT_REDIRECT') {
        throw authError;
      }
      
      let errorMessage = ERROR_MESSAGES.default;
      if (authError instanceof Error) {
        const errorStr = authError.message.toLowerCase();
        
        if (errorStr.includes('400')) {
          errorMessage = 'OAuthクライアントの設定に問題があります。client_idやredirect_uriを確認してください。';
        } else if (errorStr.includes('invalid_client_metadata')) {
          errorMessage = 'OAuthクライアントの設定に問題があります。管理者にお問い合わせください。';
        } else if (errorStr.includes('invalid_handle') || errorStr.includes('invalid handle')) {
          errorMessage = ERROR_MESSAGES.invalid_handle;
        } else if (errorStr.includes('network') || errorStr.includes('econn') || errorStr.includes('fetch')) {
          errorMessage = ERROR_MESSAGES.network;
        } else {
          errorMessage = `認証中にエラーが発生しました: ${authError.message || '不明なエラー'}`;
        }
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    // NEXT_REDIRECTは正常なリダイレクトなので、再スローする
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    const elapsed = (Date.now() - startTime) / 1000;
    console.error(`[${new Date().toISOString()}] Authentication failed after ${elapsed.toFixed(1)} seconds:`, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      timeElapsed: elapsed
    });
    
    // エラーメッセージをユーザーフレンドリーに
    let errorMessage = ERROR_MESSAGES.default;
    
    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();
      
      if (errorStr.includes('network') || errorStr.includes('econn') || errorStr.includes('fetch')) {
        errorMessage = ERROR_MESSAGES.network;
      } else if (errorStr.includes('invalid_handle') || errorStr.includes('invalid handle')) {
        errorMessage = ERROR_MESSAGES.invalid_handle;
      } else {
        errorMessage = `認証中にエラーが発生しました: ${error.message || '不明なエラー'}`;
      }
    }
    
    throw new Error(errorMessage);
  }
}

// Workaround for Next.js 13+ cookies()
const getServerSession = async () => {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore as any, sessionOptions);
};

export async function logout() {
  const session = await getServerSession();
  await session.destroy();
  redirect("/login");
}
