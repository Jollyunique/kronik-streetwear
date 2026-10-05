// Simpan sebagai src/app/dashboard/products/page.tsx
'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { FormField, fieldA11y, inputClass } from '@/components/FormField';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  LIMITED_STOCK_THRESHOLD,
  formatRupiah,
  isLimitedStock,
  isOutOfStock,
  products as initialProducts,
} from '@/data/products';
import type { Category, Product, Size } from '@/types/product';

/* ------------------------------------------------------------------ */
/* Tipe & konstanta                                                    */
/* ------------------------------------------------------------------ */

/** Produk untuk admin: produk biasa + status aktif (tampil di toko atau tidak). */
interface AdminProduct extends Product {
  isActive: boolean;
}

/** Nilai form disimpan sebagai string agar mudah dihubungkan ke input. */
interface ProductFormValues {
  name: string;
  category: Category;
  price: string;
  originalPrice: string;
  stock: string;
  image: string;
  description: string;
  sizes: Size[];
  isActive: boolean;
}

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;
type CategoryFilter = 'all' | Category;

const ALL_SIZES: Size[] = ['S', 'M', 'L', 'XL'];
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80';

/** Stok di atas angka ini dianggap penuh untuk indikator batang. */
const STOCK_BAR_MAX = 30;

/** Mengubah produk menjadi nilai awal form (null = mode tambah produk baru). */
function toFormValues(product: AdminProduct | null): ProductFormValues {
  if (!product) {
    return {
      name: '',
      category: 'hoodie',
      price: '',
      originalPrice: '',
      stock: '',
      image: DEFAULT_IMAGE,
      description: '',
      sizes: ['S', 'M', 'L', 'XL'],
      isActive: true,
    };
  }

  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    originalPrice: product.originalPrice !== undefined ? String(product.originalPrice) : '',
    stock: String(product.stock),
    image: product.image,
    description: product.description,
    sizes: product.sizes,
    isActive: product.isActive,
  };
}

/** Validasi form produk. */
function validate(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (values.name.trim().length < 3) errors.name = 'Nama produk minimal 3 karakter.';

  if (!values.price || !Number.isInteger(price) || price <= 0) {
    errors.price = 'Harga harus berupa angka bulat lebih dari 0.';
  }

  if (values.originalPrice) {
    const original = Number(values.originalPrice);
    if (!Number.isInteger(original) || original <= price) {
      errors.originalPrice = 'Harga asli harus lebih besar dari harga jual.';
    }
  }

  if (values.stock === '' || !Number.isInteger(stock) || stock < 0) {
    errors.stock = 'Stok harus berupa angka bulat 0 atau lebih.';
  }

  if (!/^https?:\/\/.+/.test(values.image.trim())) errors.image = 'URL gambar harus diawali http:// atau https://';
  if (values.description.trim().length < 10) errors.description = 'Deskripsi minimal 10 karakter.';
  if (values.sizes.length === 0) errors.sizes = 'Pilih minimal satu ukuran.';

  return errors;
}

/* ------------------------------------------------------------------ */
/* Modal Add / Edit                                                    */
/* ------------------------------------------------------------------ */

interface ProductFormModalProps {
  /** Produk yang diedit. null = mode tambah produk baru. */
  product: AdminProduct | null;
  onClose: () => void;
  /** Menerima nilai form yang sudah tervalidasi. */
  onSave: (values: ProductFormValues) => void;
}

function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const isEdit = product !== null;

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

  /** Mengubah satu field dan menghapus error-nya. */
  const setField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleSize = (size: Size) => {
    const next = values.sizes.includes(size)
      ? values.sizes.filter((item) => item !== size)
      : ALL_SIZES.filter((item) => item === size || values.sizes.includes(item));
    setField('sizes', next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSave(values);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit produk' : 'Tambah produk'}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-neutral-800 bg-neutral-950 p-6 text-neutral-100 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-black tracking-tight">{isEdit ? 'Edit produk' : 'Tambah produk'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="flex h-9 w-9 items-center justify-center border border-neutral-700 text-neutral-300 hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField id="name" label="Nama produk" error={errors.name} className="sm:col-span-2">
            <input
              id="name"
              type="text"
              value={values.name}
              onChange={(event) => setField('name', event.target.value)}
              className={inputClass(Boolean(errors.name))}
              {...fieldA11y('name', errors.name)}
            />
          </FormField>

          <FormField id="category" label="Kategori" error={errors.category}>
            <select
              id="category"
              value={values.category}
              onChange={(event) => setField('category', event.target.value as Category)}
              className={inputClass(false)}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="stock" label="Stok" error={errors.stock}>
            <input
              id="stock"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.stock}
              onChange={(event) => setField('stock', event.target.value)}
              className={inputClass(Boolean(errors.stock))}
              {...fieldA11y('stock', errors.stock)}
            />
          </FormField>

          <FormField id="price" label="Harga jual (Rp)" error={errors.price}>
            <input
              id="price"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.price}
              onChange={(event) => setField('price', event.target.value)}
              className={inputClass(Boolean(errors.price))}
              {...fieldA11y('price', errors.price)}
            />
          </FormField>

          <FormField
            id="originalPrice"
            label="Harga asli (opsional)"
            error={errors.originalPrice}
            hint="Isi jika produk sedang diskon (tampil badge SALE)."
          >
            <input
              id="originalPrice"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.originalPrice}
              onChange={(event) => setField('originalPrice', event.target.value)}
              className={inputClass(Boolean(errors.originalPrice))}
              {...fieldA11y('originalPrice', errors.originalPrice)}
            />
          </FormField>

          <FormField id="image" label="URL gambar" error={errors.image} className="sm:col-span-2">
            <input
              id="image"
              type="url"
              value={values.image}
              onChange={(event) => setField('image', event.target.value)}
              className={inputClass(Boolean(errors.image))}
              {...fieldA11y('image', errors.image)}
            />
          </FormField>

          <FormField id="description" label="Deskripsi" error={errors.description} className="sm:col-span-2">
            <textarea
              id="description"
              rows={4}
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
              className={inputClass(Boolean(errors.description))}
              {...fieldA11y('description', errors.description)}
            />
          </FormField>

          {/* Ukuran */}
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-semibold text-neutral-200">Ukuran tersedia</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const active = values.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={active}
                    className={`h-10 min-w-12 border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 ${
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
            {errors.sizes && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.sizes}
              </p>
            )}
          </fieldset>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => setField('isActive', event.target.checked)}
              className="h-4 w-4 cursor-pointer accent-neutral-100"
            />
            Tampilkan produk di toko (aktif)
          </label>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-neutral-700 px-6 py-3 text-sm font-bold transition-colors hover:border-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-neutral-100 px-8 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              {isEdit ? 'Simpan perubahan' : 'Tambah produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Indikator stok                                                      */
/* ------------------------------------------------------------------ */

function StockIndicator({ product }: { product: Product }) {
  const out = isOutOfStock(product);
  const limited = isLimitedStock(product);

  const label = out ? 'Habis' : limited ? 'Terbatas' : 'Aman';
  const barColor = out ? 'bg-red-500' : limited ? 'bg-amber-400' : 'bg-emerald-400';
  const textColor = out ? 'text-red-400' : limited ? 'text-amber-300' : 'text-emerald-300';
  const widthPercent = Math.min(Math.round((product.stock / STOCK_BAR_MAX) * 100), 100);

  return (
    <div className="w-32">
      <div className="flex items-baseline justify-between text-xs">
        <span className={`font-semibold ${textColor}`}>{label}</span>
        <span className="text-neutral-400">{product.stock} pcs</span>
      </div>
      <div
        className="mt-1.5 h-1.5 w-full bg-neutral-800"
        role="progressbar"
        aria-label={`Stok ${product.name}`}
        aria-valuemin={0}
        aria-valuemax={STOCK_BAR_MAX}
        aria-valuenow={Math.min(product.stock, STOCK_BAR_MAX)}
      >
        <div className={`h-full ${barColor}`} style={{ width: `${widthPercent}%` }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

/** Mode form: tambah baru atau edit produk tertentu. null = form tertutup. */
type FormMode = { type: 'add' } | { type: 'edit'; product: AdminProduct } | null;

export default function DashboardProductsPage() {
  // Data masih lokal. Ganti dengan fetch / server action ke database saat backend siap.
  const [items, setItems] = useState<AdminProduct[]>(() =>
    initialProducts.map((product) => ({ ...product, isActive: product.stock > 0 })),
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [formMode, setFormMode] = useState<FormMode>(null);

  const filteredItems = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchSearch =
        keyword === '' ||
        item.name.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });
  }, [items, searchQuery, categoryFilter]);

  const summary = useMemo(
    () => ({
      total: items.length,
      active: items.filter((item) => item.isActive).length,
      limited: items.filter((item) => isLimitedStock(item)).length,
      out: items.filter((item) => isOutOfStock(item)).length,
    }),
    [items],
  );

  /** Mengaktifkan / menonaktifkan produk dari toggle di tabel. */
  const toggleActive = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item)));
  };

  /** Menyimpan hasil form: menambah produk baru atau memperbarui yang ada. */
  const handleSave = (values: ProductFormValues) => {
    const price = Number(values.price);
    const originalPrice = values.originalPrice ? Number(values.originalPrice) : undefined;

    if (formMode?.type === 'edit') {
      const editedId = formMode.product.id;
      setItems((prev) =>
        prev.map((item) =>
          item.id === editedId
            ? {
                ...item,
                name: values.name.trim(),
                category: values.category,
                price,
                originalPrice,
                stock: Number(values.stock),
                image: values.image.trim(),
                description: values.description.trim(),
                sizes: values.sizes,
                isActive: values.isActive,
              }
            : item,
        ),
      );
    } else {
      // ID baru: lanjutkan nomor terbesar yang ada, contoh kr-008 -> kr-009.
      const lastNumber = items.reduce((max, item) => {
        const parsed = Number(item.id.replace('kr-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 0);

      const newProduct: AdminProduct = {
        id: `kr-${String(lastNumber + 1).padStart(3, '0')}`,
        name: values.name.trim(),
        category: values.category,
        price,
        originalPrice,
        image: values.image.trim(),
        description: values.description.trim(),
        rating: 0,
        reviewCount: 0,
        stock: Number(values.stock),
        sizes: values.sizes,
        isActive: values.isActive,
      };
      setItems((prev) => [newProduct, ...prev]);
    }

    setFormMode(null);
  };

  const closeForm = () => setFormMode(null);

  const summaryCards = [
    { label: 'Total produk', value: summary.total },
    { label: 'Produk aktif', value: summary.active },
    { label: 'Stok terbatas', value: summary.limited },
    { label: 'Stok habis', value: summary.out },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Manajemen produk</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Stok dianggap terbatas jika di bawah {LIMITED_STOCK_THRESHOLD} pcs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormMode({ type: 'add' })}
          className="bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          + Tambah produk
        </button>
      </div>

      {/* Ringkasan */}
      <section aria-label="Ringkasan produk" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="border border-neutral-800 bg-neutral-900/40 p-5">
            <p className="text-sm text-neutral-400">{card.label}</p>
            <p className="mt-2 text-2xl font-black">{card.value}</p>
          </div>
        ))}
      </section>

      {/* Pencarian + filter kategori */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="product-search" className="sr-only">
            Cari produk
          </label>
          <input
            id="product-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari nama atau ID produk..."
            className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm placeholder:text-neutral-500 focus:border-neutral-100 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="category-filter" className="sr-only">
            Filter kategori
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as CategoryFilter)}
            className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm focus:border-neutral-100 focus:outline-none sm:w-52"
          >
            <option value="all">Semua kategori</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel produk */}
      <div className="mt-6 overflow-x-auto border border-neutral-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-neutral-800 bg-neutral-900 text-xs text-neutral-400">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Produk</th>
              <th scope="col" className="px-5 py-3 font-semibold">Kategori</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Harga</th>
              <th scope="col" className="px-5 py-3 font-semibold">Stok</th>
              <th scope="col" className="px-5 py-3 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-neutral-400">
                  Tidak ada produk yang cocok dengan filter ini.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-neutral-900/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`h-14 w-11 shrink-0 bg-neutral-900 object-cover ${item.isActive ? '' : 'opacity-40 grayscale'}`}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-300">{CATEGORY_LABELS[item.category]}</td>
                  <td className="px-5 py-4 text-right">
                    <p className="font-semibold">{formatRupiah(item.price)}</p>
                    {item.originalPrice !== undefined && item.originalPrice > item.price && (
                      <p className="text-xs text-neutral-500 line-through">{formatRupiah(item.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StockIndicator product={item} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.isActive}
                        aria-label={`Status aktif ${item.name}`}
                        onClick={() => toggleActive(item.id)}
                        className={`relative h-6 w-11 shrink-0 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 ${
                          item.isActive ? 'border-neutral-100 bg-neutral-100' : 'border-neutral-600 bg-neutral-800'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 transition-all ${
                            item.isActive ? 'left-[1.4rem] bg-neutral-950' : 'left-0.5 bg-neutral-400'
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-semibold ${item.isActive ? 'text-neutral-100' : 'text-neutral-500'}`}>
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setFormMode({ type: 'edit', product: item })}
                      aria-label={`Edit ${item.name}`}
                      className="border border-neutral-700 px-4 py-2 text-xs font-bold transition-colors hover:border-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-500" aria-live="polite">
        Menampilkan {filteredItems.length} dari {items.length} produk
      </p>

      {/* Modal Add / Edit. `key` memastikan form ter-reset setiap kali dibuka. */}
      {formMode && (
        <ProductFormModal
          key={formMode.type === 'edit' ? formMode.product.id : 'new-product'}
          product={formMode.type === 'edit' ? formMode.product : null}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
