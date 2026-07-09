import { Suspense } from "react";
import AdminLoginForm from "./admin-login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
