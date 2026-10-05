// Simpan sebagai src/app/(auth)/login/page.tsx
'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormField, fieldA11y, inputClass } from '@/components/FormField';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

type LoginErrors = Partial<Record<'email' | 'password' | 'form', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validasi sisi klien. Mengembalikan objek kosong jika semua field valid. */
function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Format email tidak valid.';
  }

  if (!values.password) {
    errors.password = 'Password wajib diisi.';
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Hapus pesan error field ini saat pengguna mulai mengetik ulang.
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: ganti dengan pemanggilan API login (mis. signIn dari NextAuth atau fetch ke /api/auth/login).
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push('/dashboard');
    } catch {
      setErrors({ form: 'Gagal masuk. Periksa email dan password kamu, lalu coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-black tracking-tight">Masuk</h1>
      <p className="mt-2 text-sm text-neutral-400">Masuk untuk melihat pesanan dan mengelola akunmu.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {errors.form && (
          <div role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errors.form}
          </div>
        )}

        <FormField id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            className={inputClass(Boolean(errors.email))}
            {...fieldA11y('email', errors.email)}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password}>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className={`${inputClass(Boolean(errors.password))} pr-20`}
              {...fieldA11y('password', errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-xs font-semibold text-neutral-400 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
            >
              {showPassword ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer accent-neutral-100"
            />
            Ingat saya
          </label>
          <Link href="/login" className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-100 hover:underline">
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-neutral-100 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Belum punya akun?{' '}
        <Link href="/register" className="font-bold text-neutral-100 underline-offset-4 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </>
  );
}
