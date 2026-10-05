// Simpan sebagai src/data/orders.ts
/**
 * Data mock pesanan untuk dashboard.
 * Ganti dengan data dari API / database saat backend sudah siap.
 */

export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';
export type PaymentMethodLabel = 'QRIS' | 'Transfer Bank' | 'COD';

export interface Order {
  /** Nomor pesanan, contoh: KRN-240901 */
  id: string;
  customerName: string;
  /** Tanggal pesanan dalam format ISO 8601. */
  date: string;
  /** Jumlah total barang dalam pesanan. */
  itemCount: number;
  /** Total pembayaran dalam Rupiah. */
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodLabel;
}

/** Urutan status untuk tab filter. */
export const ORDER_STATUSES: OrderStatus[] = ['pending', 'shipped', 'completed', 'cancelled'];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/** Class badge per status (border + latar transparan agar tetap selaras tema gelap). */
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  shipped: 'border-sky-400/40 bg-sky-400/10 text-sky-300',
  completed: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  cancelled: 'border-red-500/40 bg-red-500/10 text-red-400',
};

/** Daftar pesanan, diurutkan dari yang terbaru. */
export const orders: Order[] = [
  { id: 'KRN-240910', customerName: 'Raka Pratama', date: '2026-10-02T09:15:00+07:00', itemCount: 2, total: 778000, status: 'pending', paymentMethod: 'QRIS' },
  { id: 'KRN-240909', customerName: 'Dimas Aditya', date: '2026-10-01T20:40:00+07:00', itemCount: 1, total: 549000, status: 'pending', paymentMethod: 'Transfer Bank' },
  { id: 'KRN-240908', customerName: 'Nadia Putri', date: '2026-10-01T14:05:00+07:00', itemCount: 3, total: 1167000, status: 'shipped', paymentMethod: 'QRIS' },
  { id: 'KRN-240907', customerName: 'Fajar Nugroho', date: '2026-09-30T18:22:00+07:00', itemCount: 1, total: 489000, status: 'shipped', paymentMethod: 'COD' },
  { id: 'KRN-240906', customerName: 'Salsa Maharani', date: '2026-09-30T11:50:00+07:00', itemCount: 2, total: 428000, status: 'completed', paymentMethod: 'QRIS' },
  { id: 'KRN-240905', customerName: 'Bima Santoso', date: '2026-09-29T16:30:00+07:00', itemCount: 1, total: 429000, status: 'cancelled', paymentMethod: 'Transfer Bank' },
  { id: 'KRN-240904', customerName: 'Citra Lestari', date: '2026-09-28T10:10:00+07:00', itemCount: 2, total: 808000, status: 'completed', paymentMethod: 'QRIS' },
  { id: 'KRN-240903', customerName: 'Yoga Firmansyah', date: '2026-09-27T21:45:00+07:00', itemCount: 4, total: 1396000, status: 'completed', paymentMethod: 'Transfer Bank' },
  { id: 'KRN-240902', customerName: 'Intan Permata', date: '2026-09-26T13:00:00+07:00', itemCount: 1, total: 199000, status: 'cancelled', paymentMethod: 'COD' },
  { id: 'KRN-240901', customerName: 'Hendra Wijaya', date: '2026-09-26T08:25:00+07:00', itemCount: 2, total: 718000, status: 'completed', paymentMethod: 'QRIS' },
];

/** Penjualan 7 hari terakhir untuk grafik batang sederhana. */
export const weeklySales: { day: string; total: number }[] = [
  { day: 'Jum', total: 1517000 },
  { day: 'Sab', total: 0 },
  { day: 'Min', total: 1396000 },
  { day: 'Sen', total: 808000 },
  { day: 'Sel', total: 428000 },
  { day: 'Rab', total: 1656000 },
  { day: 'Kam', total: 1327000 },
];

/** Format tanggal Indonesia, contoh: "2 Okt 2026". Zona waktu dikunci agar server & browser sama. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}
