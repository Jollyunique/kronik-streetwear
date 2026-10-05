'use client';

import { useEffect } from 'react';
import type { CartItem, Size } from '@/types/product';
import { formatRupiah } from '@/data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (productId: string, size: Size) => void;
  onUpdateQuantity: (productId: string, size: Size, delta: number) => void;
  /** Opsional: dipanggil saat tombol checkout ditekan. */
  onCheckout?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}: CartDrawerProps) {
  // Tutup drawer dengan tombol Escape dan kunci scroll halaman saat drawer terbuka.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Subtotal dihitung dengan .reduce dari semua baris keranjang.
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay gelap */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-950 text-neutral-100 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight">
            Keranjang <span className="text-neutral-500">({itemCount})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="flex h-9 w-9 items-center justify-center border border-neutral-800 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center border border-dashed border-neutral-700 text-2xl text-neutral-600"
              aria-hidden="true"
            >
              0
            </div>
            <p className="text-lg font-bold">Keranjang masih kosong</p>
            <p className="mt-2 text-sm text-neutral-400">
              Pilih produk dan ukuran yang kamu mau, lalu tambahkan ke sini.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Mulai belanja
            </button>
          </div>
        ) : (
          <>
            {/* Daftar item */}
            <ul className="flex-1 divide-y divide-neutral-800 overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 py-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-28 w-[5.5rem] shrink-0 bg-neutral-900 object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{item.product.name}</p>
                        <p className="mt-1 text-xs text-neutral-500">Ukuran {item.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.product.id, item.size)}
                        aria-label={`Hapus ${item.product.name} ukuran ${item.size}`}
                        className="shrink-0 text-xs text-neutral-500 underline-offset-2 hover:text-red-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      {/* Kontrol jumlah */}
                      <div className="flex items-center border border-neutral-700">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          aria-label="Kurangi jumlah"
                          className="h-8 w-8 text-neutral-300 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Tambah jumlah"
                          className="h-8 w-8 text-neutral-300 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-semibold">
                        {formatRupiah(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer: subtotal + checkout */}
            <footer className="border-t border-neutral-800 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-400">Subtotal</span>
                <span className="text-xl font-bold">{formatRupiah(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">Ongkos kirim dihitung saat checkout.</p>
              <button
                type="button"
                onClick={onCheckout}
                className="mt-5 w-full bg-neutral-100 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                Checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
