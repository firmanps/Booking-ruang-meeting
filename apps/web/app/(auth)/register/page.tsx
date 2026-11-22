import Image from "next/image";
import { Eye } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Daftar | MeetSpace",
};

export default function Register() {
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
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="Nama Anda" autoComplete="name" />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="nama@perusahaan.com" autoComplete="email" />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input id="password" name="password" type="password" placeholder="Minimal 8 karakter" autoComplete="new-password" className="pr-10" />
                <Eye className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Konfirmasi password</FieldLabel>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Ulangi password" autoComplete="new-password" />
            </Field>

            <Button type="button" size="lg" className="w-full">
              Buat akun
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
