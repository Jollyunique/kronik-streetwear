// Simpan sebagai src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

/** Layout bersama halaman login & register: logo di atas, form di tengah. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 py-12 text-neutral-100">
      <Link href="/" className="mb-10 text-2xl font-black tracking-[0.35em]">
        KRONIK
      </Link>
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
        {children}
      </div>
      <Link
        href="/"
        className="mt-8 text-sm text-neutral-500 underline-offset-4 hover:text-neutral-100 hover:underline"
      >
        ← Kembali ke toko
      </Link>
    </div>
  );
}
