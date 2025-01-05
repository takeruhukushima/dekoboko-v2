import AuthForm from "../AuthForm";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <AuthForm mode="signin" />
    </div>
  );
}
