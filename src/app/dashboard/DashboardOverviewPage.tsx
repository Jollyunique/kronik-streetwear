// Simpan sebagai src/app/dashboard/page.tsx
import Link from 'next/link';
import { formatRupiah, isLimitedStock, isOutOfStock, products } from '@/data/products';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  formatDate,
  orders,
  weeklySales,
} from '@/data/orders';

interface QuickLink {
  href: string;
  title: string;
  description: string;
}

const QUICK_LINKS: QuickLink[] = [
  { href: '/dashboard/products', title: 'Kelola produk', description: 'Tambah, ubah, dan atur stok produk.' },
  { href: '/dashboard/orders', title: 'Semua pesanan', description: 'Pantau status dan riwayat pesanan.' },
  { href: '/', title: 'Buka toko', description: 'Lihat tampilan toko seperti pembeli.' },
  { href: '/cart', title: 'Keranjang', description: 'Cek halaman keranjang pembeli.' },
];

export default function DashboardOverviewPage() {
  // Penjualan dihitung dari pesanan yang tidak dibatalkan.
  const validOrders = orders.filter((order) => order.status !== 'cancelled');
  const totalSales = validOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const lowStockCount = products.filter((p) => isLimitedStock(p) || isOutOfStock(p)).length;

  const stats = [
    { label: 'Total penjualan', value: formatRupiah(totalSales), note: `${validOrders.length} pesanan aktif` },
    { label: 'Total pesanan', value: String(orders.length), note: 'Seluruh status' },
    { label: 'Menunggu diproses', value: String(pendingCount), note: 'Status Pending' },
    { label: 'Stok perlu perhatian', value: String(lowStockCount), note: 'Terbatas atau habis' },
  ];

  const recentOrders = orders.slice(0, 5);
  const maxWeekly = Math.max(...weeklySales.map((entry) => entry.total), 1);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-black tracking-tight">Overview</h1>
      <p className="mt-2 text-sm text-neutral-400">Ringkasan performa toko 7 hari terakhir.</p>

      {/* Statistik */}
      <section aria-label="Statistik" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-neutral-800 bg-neutral-900/40 p-5">
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-black">{stat.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Grafik penjualan mingguan */}
        <section className="border border-neutral-800 bg-neutral-900/40 p-6">
          <h2 className="text-lg font-bold">Penjualan mingguan</h2>
          <div className="mt-8 flex h-48 items-end gap-3" role="img" aria-label="Grafik batang penjualan 7 hari terakhir">
            {weeklySales.map((entry) => {
              const heightPercent = Math.round((entry.total / maxWeekly) * 100);
              return (
                <div key={entry.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className="w-full bg-neutral-100 transition-colors hover:bg-neutral-300"
                    style={{ height: `${heightPercent}%`, minHeight: entry.total > 0 ? '4px' : '0' }}
                    title={formatRupiah(entry.total)}
                  />
                  <span className="text-xs text-neutral-500">{entry.day}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick links */}
        <section className="border border-neutral-800 bg-neutral-900/40 p-6">
          <h2 className="text-lg font-bold">Akses cepat</h2>
          <ul className="mt-4 divide-y divide-neutral-800">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
                >
                  <span className="block text-sm font-bold">{link.title}</span>
                  <span className="block text-xs text-neutral-500">{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Pesanan terbaru */}
      <section className="mt-6 border border-neutral-800 bg-neutral-900/40">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-bold">Pesanan terbaru</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-100 hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        <ul className="divide-y divide-neutral-800 border-t border-neutral-800">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="text-sm font-bold">{order.id}</p>
                <p className="text-xs text-neutral-500">
                  {order.customerName} · {formatDate(order.date)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">{formatRupiah(order.total)}</span>
                <span className={`border px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_STYLES[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
