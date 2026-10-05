'use client';

interface LoadingStateProps {
  /** Jumlah kartu skeleton yang ditampilkan. */
  count?: number;
}

/** Skeleton satu kartu produk, bentuknya meniru ProductCard. */
function SkeletonCard() {
  return (
    <div className="animate-pulse border border-neutral-800 bg-neutral-900/40">
      <div className="aspect-[4/5] bg-neutral-800/70" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/4 bg-neutral-800" />
        <div className="h-4 w-3/4 bg-neutral-800" />
        <div className="h-4 w-1/3 bg-neutral-800" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-8 bg-neutral-800" />
          <div className="h-8 w-8 bg-neutral-800" />
          <div className="h-8 w-8 bg-neutral-800" />
          <div className="h-8 w-8 bg-neutral-800" />
        </div>
        <div className="h-10 w-full bg-neutral-800" />
      </div>
    </div>
  );
}

/** Tampilan loading: grid skeleton produk bertema gelap. */
export function LoadingState({ count = 8 }: LoadingStateProps) {
  return (
    <div
      className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100 sm:px-6 lg:px-10"
      role="status"
      aria-live="polite"
      aria-label="Memuat produk"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 h-8 w-48 animate-pulse bg-neutral-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: count }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
      <span className="sr-only">Memuat produk...</span>
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message?: string;
  /** Dipanggil saat tombol "Coba lagi" ditekan. */
  onRetry?: () => void;
}

/** Tampilan error dengan tombol retry. */
export function ErrorMessage({
  title = 'Gagal memuat halaman',
  message = 'Terjadi kesalahan saat mengambil data. Periksa koneksi internet kamu, lalu coba lagi.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100"
      role="alert"
    >
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-900/60 p-8 text-center">
        <div
          className="mx-auto mb-6 flex h-12 w-12 items-center justify-center border border-red-600 text-xl font-bold text-red-500"
          aria-hidden="true"
        >
          !
        </div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-8 w-full bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Coba lagi
          </button>
        )}
      </div>
    </div>
  );
}
