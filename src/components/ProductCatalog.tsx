'use client';

import { useState, useMemo } from 'react';
import { ProductCard, ProductModal } from '@/components';
import { CATEGORIES, CATEGORY_LABELS } from '@/data/products';
import { useCartContext } from '@/context/cartcontext';
import type { Category, Product } from '@/types/product';

type CategoryFilter = 'all' | Category;

export function ProductCatalog({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { addToCart } = useCartContext();

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
  }, [products, searchQuery, activeCategory]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const filterOptions = [
    { value: 'all', label: 'Semua' },
    ...CATEGORIES.map((category) => ({ value: category, label: CATEGORY_LABELS[category] })),
  ];

  return (
    <>
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const active = activeCategory === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveCategory(option.value as CategoryFilter)}
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
          <input
            id="search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-100 focus:outline-none"
          />
        </div>
      </section>

      <p className="mb-6 text-sm text-neutral-500">
        Menampilkan {filteredProducts.length} dari {products.length} produk
      </p>

      {/* Grid Produk */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800 py-16 text-center">
          <p className="text-lg font-bold">Produk tidak ditemukan</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 border border-neutral-600 px-6 py-3 text-sm font-bold transition-colors hover:border-neutral-100"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-3 md:grid-cols-3 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </>
  );
}