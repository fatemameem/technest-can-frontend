// export { default } from '../../userAdmin/login/page'
// app/admin/login/page.tsx
"use client";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-semibold mb-3">Admin Login</h1>
        <p className="mb-6">Only approved emails can access the dashboard.</p>
        <button onClick={() => signIn("google", { callbackUrl: "/admin" })}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}