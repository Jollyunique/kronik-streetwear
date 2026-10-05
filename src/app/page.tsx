'use client';

import { useMemo, useState } from 'react';
import { CartDrawer, ProductCard, ProductModal } from '@/components';
import { CATEGORIES, CATEGORY_LABELS, products } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import type { Category, Product, Size } from '@/types/product';

/** Nilai filter: semua kategori atau salah satu kategori produk. */
type CategoryFilter = 'all' | Category;

/* ------------------------------------------------------------------ */
/* ProductGrid                                                         */
/* ------------------------------------------------------------------ */

interface ProductGridProps {
  items: Product[];
  onAddToCart: (product: Product, size: Size) => void;
  onQuickView: (product: Product) => void;
  onReset: () => void;
}

/** Grid produk responsif, lengkap dengan tampilan saat hasil pencarian kosong. */
function ProductGrid({ items, onAddToCart, onQuickView, onReset }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800 py-16 text-center">
        <p className="text-lg font-bold">Produk tidak ditemukan</p>
        <p className="mt-2 text-sm text-neutral-400">
          Coba kata kunci lain atau tampilkan semua kategori.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 border border-neutral-600 px-6 py-3 text-sm font-bold transition-colors hover:border-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
        >
          Reset filter
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-3 md:grid-cols-3 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman utama                                                       */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
  } = useCart();

  // Menyaring produk berdasarkan kategori dan kata kunci pencarian.
  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchSearch =
        keyword === '' ||
        product.name.toLowerCase().includes(keyword) ||
        CATEGORY_LABELS[product.category].toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const filterOptions: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'Semua' },
    ...CATEGORIES.map((category) => ({ value: category, label: CATEGORY_LABELS[category] })),
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="px-4 sm:px-8 sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <a href="/" className="text-xl font-black tracking-[0.3em]">
            KRONIK
          </a>
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
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Hero */}
        <section className="mb-12 border-b border-neutral-800 pb-12">
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Dibuat untuk jalanan setelah gelap.
          </h1>
          <p className="mt-5 max-w-xl text-neutral-400">
            Koleksi streetwear dengan bahan tebal, potongan longgar, dan produksi terbatas.
          </p>
        </section>

        {/* Pencarian + filter kategori */}
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const active = activeCategory === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveCategory(option.value)}
                  aria-pressed={active}
                  className={`border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 ${
                    active
                      ? 'border-neutral-100 bg-neutral-100 text-neutral-950'
                      : 'border-neutral-700 text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Cari produk
            </label>
            <input
              id="search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari produk..."
              className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-100 focus:outline-none"
            />
          </div>
        </section>

        <p className="mb-6 text-sm text-neutral-500" aria-live="polite">
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </p>

        <ProductGrid
          items={filteredProducts}
          onAddToCart={addToCart}
          onQuickView={setQuickViewProduct}
          onReset={resetFilters}
        />
      </main>

      <footer className="border-t border-neutral-800 px-4 py-8 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} KRONIK STREETWEAR. Semua hak dilindungi.
      </footer>

      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}
