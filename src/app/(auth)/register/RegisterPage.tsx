// Simpan sebagai src/app/(auth)/register/page.tsx
'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormField, fieldA11y, inputClass } from '@/components/FormField';

interface RegisterValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RegisterErrors = Partial<Record<keyof RegisterValues | 'form', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validasi sisi klien. Mengembalikan objek kosong jika semua field valid. */
function validate(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Nama lengkap minimal 3 karakter.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Format email tidak valid.';
  }

  if (values.password.length < 8) {
    errors.password = 'Password minimal 8 karakter.';
  } else if (!/[A-Za-z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    errors.password = 'Password harus berisi huruf dan angka.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password wajib diisi.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Konfirmasi password tidak sama.';
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: ganti dengan pemanggilan API pendaftaran (mis. fetch ke /api/auth/register).
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/login');
    } catch {
      setErrors({ form: 'Pendaftaran gagal. Coba lagi beberapa saat lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordType = showPassword ? 'text' : 'password';

  return (
    <>
      <h1 className="text-2xl font-black tracking-tight">Buat akun</h1>
      <p className="mt-2 text-sm text-neutral-400">Daftar untuk checkout lebih cepat dan memantau pesananmu.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {errors.form && (
          <div role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errors.form}
          </div>
        )}

        <FormField id="fullName" label="Nama lengkap" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={handleChange}
            placeholder="Nama sesuai identitas"
            className={inputClass(Boolean(errors.fullName))}
            {...fieldA11y('fullName', errors.fullName)}
          />
        </FormField>

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

        <FormField
          id="password"
          label="Password"
          error={errors.password}
          hint="Minimal 8 karakter, kombinasi huruf dan angka."
        >
          <div className="relative">
            <input
              id="password"
              name="password"
              type={passwordType}
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              placeholder="Buat password"
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

        <FormField id="confirmPassword" label="Konfirmasi password" error={errors.confirmPassword}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={passwordType}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password"
            className={inputClass(Boolean(errors.confirmPassword))}
            {...fieldA11y('confirmPassword', errors.confirmPassword)}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-neutral-100 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold text-neutral-100 underline-offset-4 hover:underline">
          Masuk
        </Link>
      </p>
    </>
  );
}
