'use client';

import { useCartContext } from '@/context/cartcontext';

export function HeaderCartButton() {
  const { openCart, totalItems } = useCartContext();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Buka keranjang, ${totalItems} barang`}
      className="flex items-center gap-3 border border-neutral-700 px-4 py-2 text-sm font-bold transition-colors hover:border-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
    >
      Keranjang
      <span className="flex h-5 min-w-5 items-center justify-center bg-neutral-100 px-1 text-xs text-neutral-950">
        {totalItems}
      </span>
    </button>
  );
}