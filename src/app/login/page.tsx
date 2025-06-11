import { authorize } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}

// Workaround for Next.js 13+ cookies()
const getServerSession = async () => {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore as any, sessionOptions);
};

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const errorMessages: Record<string, string> = {
  access_denied: "ログインがキャンセルされました",
  auth_failed: "認証に失敗しました。もう一度お試しください。",
  server_error: "サーバーエラーが発生しました。後でもう一度お試しください。",
};

export default async function LoginPage({ searchParams: searchParamsProp }: PageProps) {
  // セッションをチェック
  const session = await getServerSession();

  if (session?.isLoggedIn && session.did) {
    redirect("/");
  }

  const searchParams = searchParamsProp ? await searchParamsProp : {};
  const error = searchParams.error as string | undefined;
  const errorMessage = error ? errorMessages[error] || "エラーが発生しました" : null;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">dekobokoにログイン</CardTitle>
          <CardDescription>
            ハンドルを入力して認証を開始してください
          </CardDescription>
        </CardHeader>
        
        {errorMessage && (
          <div className="px-6 pb-4 -mt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        <CardContent>
          {error === "auth_failed" && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              ログインに失敗しました。もう一度お試しください。
            </div>
          )}
          <form action={authorize}>
            <div className="space-y-4">
              <Input
                type="text"
                name="handle"
                placeholder="ハンドルを入力"
                required
              />
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
