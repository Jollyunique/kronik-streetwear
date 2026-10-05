// Simpan sebagai src/app/dashboard/orders/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { formatRupiah } from '@/data/products';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  formatDate,
  orders,
  type OrderStatus,
} from '@/data/orders';

/** Nilai filter: semua status atau salah satu status pesanan. */
type StatusFilter = 'all' | OrderStatus;

export default function DashboardOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Jumlah pesanan per status untuk label tab.
  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = {
      all: orders.length,
      pending: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      result[order.status] += 1;
    });
    return result;
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchSearch =
        keyword === '' ||
        order.id.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [statusFilter, searchQuery]);

  const tabs: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Semua' },
    ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-black tracking-tight">Riwayat pesanan</h1>
      <p className="mt-2 text-sm text-neutral-400">Pantau semua pesanan beserta status terkininya.</p>

      {/* Tab status + pencarian */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter status pesanan" className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                aria-pressed={active}
                className={`border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 ${
                  active
                    ? 'border-neutral-100 bg-neutral-100 text-neutral-950'
                    : 'border-neutral-700 text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {tab.label} <span className={active ? 'text-neutral-600' : 'text-neutral-500'}>({counts[tab.value]})</span>
              </button>
            );
          })}
        </div>

        <div className="w-full lg:max-w-xs">
          <label htmlFor="order-search" className="sr-only">
            Cari pesanan
          </label>
          <input
            id="order-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari nomor atau nama pelanggan..."
            className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm placeholder:text-neutral-500 focus:border-neutral-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabel pesanan */}
      <div className="mt-6 overflow-x-auto border border-neutral-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-neutral-800 bg-neutral-900 text-xs text-neutral-400">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">No. pesanan</th>
              <th scope="col" className="px-5 py-3 font-semibold">Tanggal</th>
              <th scope="col" className="px-5 py-3 font-semibold">Pelanggan</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Item</th>
              <th scope="col" className="px-5 py-3 font-semibold">Pembayaran</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Total</th>
              <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-neutral-400">
                  Tidak ada pesanan yang cocok dengan filter ini.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-neutral-900/60">
                  <td className="px-5 py-4 font-bold">{order.id}</td>
                  <td className="px-5 py-4 text-neutral-400">{formatDate(order.date)}</td>
                  <td className="px-5 py-4">{order.customerName}</td>
                  <td className="px-5 py-4 text-right">{order.itemCount}</td>
                  <td className="px-5 py-4 text-neutral-400">{order.paymentMethod}</td>
                  <td className="px-5 py-4 text-right font-semibold">{formatRupiah(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`border px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_STYLES[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-500" aria-live="polite">
        Menampilkan {filteredOrders.length} dari {orders.length} pesanan
      </p>
    </div>
  );
}
