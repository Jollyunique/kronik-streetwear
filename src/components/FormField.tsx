// Simpan sebagai src/components/FormField.tsx
import type { ReactNode } from 'react';

/**
 * Class Tailwind standar untuk input / select / textarea bertema gelap.
 * Border berubah merah saat field memiliki error.
 */
export function inputClass(hasError: boolean = false): string {
  const state = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-neutral-700 focus:border-neutral-100 focus:ring-neutral-100';

  return `w-full border bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${state}`;
}

/** Atribut aksesibilitas untuk input: menandai invalid dan menghubungkan ke pesan error. */
export function fieldA11y(
  id: string,
  error?: string,
): { 'aria-invalid': boolean; 'aria-describedby': string | undefined } {
  return {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };
}

interface FormFieldProps {
  /** ID elemen input di dalam `children` (dipakai untuk htmlFor dan pesan error). */
  id: string;
  label: string;
  error?: string;
  /** Petunjuk singkat di bawah input (disembunyikan saat ada error). */
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Pembungkus field form: label + input + hint/error. */
export function FormField({ id, label, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-neutral-200">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
