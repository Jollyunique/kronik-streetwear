// Simpan sebagai src/app/cart/page.tsx
'use client';

import Link from 'next/link';
import { formatRupiah } from '@/data/products';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, isHydrated } = useCart();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-xl font-black tracking-[0.3em]">
            KRONIK
          </Link>
          <Link href="/" className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-100 hover:underline">
            Lanjut belanja
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Keranjang <span className="text-neutral-600">({totalItems})</span>
        </h1>

        {/* Skeleton singkat selama keranjang dibaca dari localStorage */}
        {!isHydrated ? (
          <div className="mt-10 space-y-4" role="status" aria-label="Memuat keranjang">
            {[0, 1].map((key) => (
              <div key={key} className="h-36 animate-pulse border border-neutral-800 bg-neutral-900/40" />
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty state */
          <div className="mt-10 border border-dashed border-neutral-800 px-6 py-24 text-center">
            <p className="text-xl font-bold">Keranjang masih kosong</p>
            <p className="mt-2 text-sm text-neutral-400">Pilih produk dan ukuran yang kamu mau, lalu tambahkan ke keranjang.</p>
            <Link
              href="/"
              className="mt-8 inline-block bg-neutral-100 px-8 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Mulai belanja
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_24rem]">
            {/* Daftar item */}
            <ul className="divide-y divide-neutral-800 border-y border-neutral-800">
              {cartItems.map((item) => (
                <li key={`${item.product.id}-${item.size}`} className="flex gap-4 py-6 sm:gap-6">
                  <Link href={`/product/${item.product.id}`} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-32 w-24 bg-neutral-900 object-cover sm:h-40 sm:w-32"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="block truncate text-base font-bold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-neutral-500">Ukuran {item.size}</p>
                        <p className="mt-1 text-sm text-neutral-400">{formatRupiah(item.product.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        aria-label={`Hapus ${item.product.name} ukuran ${item.size}`}
                        className="shrink-0 text-sm text-neutral-500 underline-offset-2 hover:text-red-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Kontrol jumlah */}
                      <div className="flex items-center border border-neutral-700">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          aria-label="Kurangi jumlah"
                          className="h-10 w-10 text-neutral-300 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Tambah jumlah"
                          className="h-10 w-10 text-neutral-300 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-base font-bold">{formatRupiah(item.product.price * item.quantity)}</p>
                    </div>

                    {item.quantity >= item.product.stock && (
                      <p className="mt-2 text-xs text-amber-400">Jumlah maksimal sesuai stok tersedia.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Ringkasan */}
            <aside className="h-fit border border-neutral-800 bg-neutral-900/40 p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-bold">Ringkasan</h2>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-neutral-400">Subtotal ({totalItems} barang)</dt>
                  <dd className="font-semibold">{formatRupiah(totalPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-400">Ongkos kirim</dt>
                  <dd className="text-neutral-500">Dihitung saat checkout</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-baseline justify-between border-t border-neutral-800 pt-6">
                <span className="text-sm text-neutral-400">Total sementara</span>
                <span className="text-2xl font-black">{formatRupiah(totalPrice)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full bg-neutral-100 py-4 text-center text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
