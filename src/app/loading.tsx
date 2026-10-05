import { LoadingState } from '@/components';

/** Ditampilkan otomatis oleh Next.js saat halaman sedang dimuat (Suspense boundary). */
export default function Loading() {
  return <LoadingState />;
}
