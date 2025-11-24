import { UpdatePasswordForm } from "@/components/login/update-password-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10 mt-6">
      <div className="w-full max-w-3xl">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
