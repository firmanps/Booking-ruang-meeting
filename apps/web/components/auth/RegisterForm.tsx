"use client";

import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { postAuth, type LoginResponse, type RegisterResponse } from "@/lib/services/auth.service";
import { registerSchema } from "@repo/shared/schemas/auth.schema";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredName, setRegisteredName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const validation = registerSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(validation.error.issues.map((issue) => issue.message).join(" "));
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password belum cocok.");
      return;
    }

    setIsLoading(true);
    try {
      await postAuth<RegisterResponse>("register", validation.data);

      try {
        const login = await postAuth<LoginResponse>("login", {
          email: validation.data.email,
          password: validation.data.password,
        });
        const destination = login.user.role.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/dashboard";
        router.replace(destination);
      } catch {
        setRegisteredName(validation.data.name);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  if (registeredName) {
    return (
      <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
        <CardContent className="pt-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold">Akun berhasil dibuat</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Selamat datang, {registeredName}. Silakan masuk menggunakan akun yang baru Anda daftarkan.</p>
          <Button render={<Link href="/login" />} nativeButton={false} size="lg" className="mt-6 w-full">
            Lanjut ke login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="pb-2">
        <div className="mb-7 flex items-center gap-2 text-base font-semibold lg:hidden">
          <span className="grid size-9 place-items-center overflow-hidden rounded-lg bg-[#edf3ff]">
            <Image src="/logo.webp" alt="" width={36} height={36} className="size-full object-contain" />
          </span>
          MeetSpace
        </div>
        <CardTitle className="text-2xl">Buat akun baru</CardTitle>
        <CardDescription>Daftar untuk mulai memesan ruang meeting kantor.</CardDescription>
      </CardHeader>

      <CardContent className="mt-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="Nama Anda" autoComplete="name" minLength={1} maxLength={100} required disabled={isLoading} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="nama@perusahaan.com" autoComplete="email" maxLength={100} required disabled={isLoading} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" autoComplete="new-password" minLength={8} maxLength={255} required disabled={isLoading} className="pr-11" />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Konfirmasi password</FieldLabel>
              <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Ulangi password" autoComplete="new-password" minLength={8} maxLength={255} required disabled={isLoading} />
            </Field>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Buat akun"}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
