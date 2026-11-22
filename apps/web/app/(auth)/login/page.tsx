import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Masuk | MeetSpace",
};

export default function Login() {
  return (
    <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="pb-2">
        <div className="mb-7 flex items-center gap-2 text-base font-semibold lg:hidden">
          <span className="grid size-9 place-items-center overflow-hidden rounded-lg bg-[#edf3ff]">
            <Image src="/logo.webp" alt="" width={36} height={36} className="size-full object-contain" />
          </span>
          MeetSpace
        </div>
        <CardTitle className="text-2xl">Selamat datang kembali</CardTitle>
        <CardDescription>
          Masuk untuk mengelola pemesanan ruang meeting Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-4">
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@perusahaan.com"
                autoComplete="email"
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <button
                  type="button"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="pr-10"
                />
                <Eye className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>

            <Field orientation="horizontal">
              <Checkbox id="remember" aria-label="Ingat saya" />
              <FieldLabel htmlFor="remember" className="text-sm font-normal">
                Ingat saya
              </FieldLabel>
            </Field>

            <Button type="button" size="lg" className="w-full">
              Masuk
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Daftar sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
