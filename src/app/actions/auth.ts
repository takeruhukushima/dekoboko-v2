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
  console.log('Authorization started');
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
    
    // 2. 認証URLの取得（タイムアウト付き）
    console.log('Requesting authorization URL...');
    const authPromise = client.authorize(formattedHandle, {
      scope: "atproto transition:generic",
    });

    // 30秒のタイムアウト
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        reject(new Error(`認証処理がタイムアウトしました（${elapsed.toFixed(1)}秒経過）。もう一度お試しください。`));
      }, AUTH_TIMEOUT_MS)
    );

    const url = await Promise.race([authPromise, timeoutPromise]);
    
    if (!url) {
      throw new Error('認証URLの取得に失敗しました');
    }
    
    console.log(`Authorization URL received in ${(Date.now() - startTime) / 1000} seconds`);
    console.log('Redirecting to:', url);
    
    // リダイレクト
    redirect(url.toString());
  } catch (error) {
    const elapsed = (Date.now() - startTime) / 1000;
    console.error(`Authentication failed after ${elapsed.toFixed(1)} seconds:`, error);
    
    // エラーメッセージをユーザーフレンドリーに
    if (error instanceof Error) {
      if (error.message.includes('timed out') || error.name === 'AbortError') {
        throw new Error(`認証処理が時間内に完了しませんでした（${elapsed.toFixed(1)}秒経過）。時間をおいて再度お試しください。`);
      }
      if (error.message.includes('invalid_handle')) {
        throw new Error('無効なハンドルです。正しいハンドルを入力してください。');
      }
    }
    
    throw new Error(`認証中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
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
