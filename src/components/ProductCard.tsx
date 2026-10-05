'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product, Size } from '@/types/product';
import { CATEGORY_LABELS } from '@/data/products';
import { useCart } from '@/hooks/useCart'; 

const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

interface ProductBadgesProps {
  product: Product;
}

/**
 * Badge status produk. Dipakai di kartu, modal, dan halaman detail.
 * Setiap badge tampil hanya jika kondisinya terpenuhi (conditional rendering).
 */
export function ProductBadges({ product }: ProductBadgesProps) {
  const outOfStock = product.stock === 0;
  const limited = product.stock > 0 && product.stock <= 5;
  const sale = product.originalPrice !== undefined && product.originalPrice > product.price;

  return (
    <div className="flex flex-wrap gap-1.5">
      {sale && !outOfStock && (
        <span className="bg-red-600 px-2 py-1 text-[11px] font-bold tracking-wider text-white">
          SALE
        </span>
      )}
      {limited && (
        <span className="bg-amber-400 px-2 py-1 text-[11px] font-bold tracking-wider text-neutral-950">
          LIMITED STOK
        </span>
      )}
      {outOfStock && (
        <span className="bg-neutral-100 px-2 py-1 text-[11px] font-bold tracking-wider text-neutral-950">
          OUT OF STOCK
        </span>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: Size) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const {addToCart, openCart} = useCart();
  const outOfStock = product.stock === 0;
  const sale = product.originalPrice !== undefined && product.originalPrice > product.price;
  const avaliableSize: Size[] = (product as unknown as{ sizes?: Size[]}).sizes || ['S','M','L','XL'];
  
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize || outOfStock) return;

    addToCart(product, selectedSize);
    openCart();
    setSelectedSize(null);
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <article className="group flex flex-col border border-neutral-800 bg-neutral-900/40 transition-colors hover:border-neutral-600">
      {/* Gambar + badge + tombol quick view */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
        <Link href={`/product/${product.id}`} aria-label={`Lihat detail ${product.name}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              outOfStock ? 'opacity-40 grayscale' : ''
            }`}
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3">
          <ProductBadges product={product} />
        </div>

        <button
          type="button"
          onClick={handleQuickView}
          className="absolute inset-x-3 bottom-3 bg-neutral-950/90 py-2.5 text-xs font-bold tracking-wider text-neutral-100 backdrop-blur transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          QUICK VIEW
        </button>
      </div>

      {/* Informasi produk */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-neutral-500">{CATEGORY_LABELS[product.category]}</p>

        <Link
          href={`/product/${product.id}`}
          className="mt-1 text-base font-bold leading-snug text-neutral-100 hover:underline"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-base font-semibold ${sale ? 'text-red-500' : 'text-neutral-100'}`}>
            {formatCurrency(product.price)}
          </span>
          {sale && product.originalPrice !== undefined && (
            <span className="text-xs text-neutral-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-neutral-400">
          <span aria-hidden="true">★</span> {product.rating.toFixed(1)}{' '}
          <span className="text-neutral-600">({product.reviewCount} ulasan)</span>
        </p>

        {/* Pilihan ukuran */}
        <div className="mt-4 flex gap-2" role="radiogroup" aria-label={`Ukuran ${product.name}`}>
          {product.sizes.map((size) => {
            const active = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={outOfStock}
                onClick={() => setSelectedSize(size)}
                className={`h-9 min-w-9 border px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 ${
                  active
                    ? 'border-neutral-100 bg-neutral-100 text-neutral-950'
                    : 'border-neutral-700 text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock || !selectedSize}
          className="mt-4 w-full bg-neutral-100 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          {outOfStock ? 'Stok habis' : selectedSize ? 'Tambah ke keranjang' : 'Pilih ukuran dulu'}
        </button>
      </div>
    </article>
  );
}
