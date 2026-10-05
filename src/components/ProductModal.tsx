'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product, Size } from '@/types/product';
import { CATEGORY_LABELS, formatRupiah, isOnSale, isOutOfStock } from '@/data/products';
import { ProductBadges } from './ProductCard';

/* ------------------------------------------------------------------ */
/* SizeSelector (dipakai juga di halaman detail produk)               */
/* ------------------------------------------------------------------ */

interface SizeSelectorProps {
  sizes: Size[];
  selected: Size | null;
  onSelect: (size: Size) => void;
  disabled?: boolean;
}

/** Pilihan ukuran S / M / L / XL dalam bentuk radio group. */
export function SizeSelector({ sizes, selected, onSelect, disabled = false }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pilih ukuran">
      {sizes.map((size) => {
        const active = selected === size;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onSelect(size)}
            className={`h-11 min-w-12 border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 ${
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
  );
}

/* ------------------------------------------------------------------ */
/* ProductModal                                                        */
/* ------------------------------------------------------------------ */

interface ProductModalProps {
  /** Produk yang sedang dilihat. null = modal tertutup. */
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: Size) => void;
}

/**
 * Wrapper modal. Isi modal diberi `key` berdasarkan ID produk,
 * sehingga pilihan ukuran otomatis ter-reset setiap ganti produk.
 */
export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  return (
    <ModalBody key={product.id} product={product} onClose={onClose} onAddToCart={onAddToCart} />
  );
}

interface ModalBodyProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: Size) => void;
}

function ModalBody({ product, onClose, onAddToCart }: ModalBodyProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const outOfStock = isOutOfStock(product);
  const sale = isOnSale(product);

  // Tutup dengan Escape dan kunci scroll halaman di belakang modal.
  useEffect(() => {
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
  }, [onClose]);

  const handleAdd = () => {
    if (!selectedSize || outOfStock) return;
    onAddToCart(product, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Konten modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view ${product.name}`}
        className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-y-auto border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-2xl sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup quick view"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center border border-neutral-700 bg-neutral-950/80 text-neutral-300 transition-colors hover:border-neutral-400 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
        >
          ✕
        </button>

        {/* Gambar */}
        <div className="relative aspect-[4/5] bg-neutral-900 sm:aspect-auto sm:min-h-[28rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover ${outOfStock ? 'opacity-40 grayscale' : ''}`}
          />
          <div className="absolute left-3 top-3">
            <ProductBadges product={product} />
          </div>
        </div>

        {/* Detail */}
        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-xs text-neutral-500">{CATEGORY_LABELS[product.category]}</p>
          <h2 className="mt-1 pr-10 text-2xl font-bold leading-tight tracking-tight">
            {product.name}
          </h2>

          <div className="mt-3 flex items-baseline gap-3">
            <span className={`text-xl font-semibold ${sale ? 'text-red-500' : ''}`}>
              {formatRupiah(product.price)}
            </span>
            {sale && product.originalPrice !== undefined && (
              <span className="text-sm text-neutral-500 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-neutral-400">
            <span aria-hidden="true">★</span> {product.rating.toFixed(1)}{' '}
            <span className="text-neutral-600">({product.reviewCount} ulasan)</span>
          </p>

          <p className="mt-5 text-sm leading-relaxed text-neutral-300">{product.description}</p>

          {/* Selector ukuran */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">
              Ukuran{selectedSize ? <span className="text-neutral-500"> — {selectedSize}</span> : null}
            </p>
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
              disabled={outOfStock}
            />
          </div>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock || !selectedSize}
              className="w-full bg-neutral-100 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
            >
              {outOfStock
                ? 'Stok habis'
                : selectedSize
                  ? 'Tambah ke keranjang'
                  : 'Pilih ukuran dulu'}
            </button>
            <Link
              href={`/product/${product.id}`}
              className="mt-3 block text-center text-sm text-neutral-400 underline-offset-4 hover:text-neutral-100 hover:underline"
            >
              Lihat halaman produk lengkap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
