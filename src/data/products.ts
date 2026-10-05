import type { Category, Product } from '@/types/product';

/** Batas stok yang dianggap "terbatas" (stok di bawah angka ini). */
export const LIMITED_STOCK_THRESHOLD = 5;

/** Label kategori untuk ditampilkan di UI (filter, kartu, dll). */
export const CATEGORY_LABELS: Record<Category, string> = {
  hoodie: 'Hoodie',
  't-shirt': 'T-Shirt',
  pants: 'Celana',
  accessories: 'Aksesoris',
};

/** Daftar kategori berurutan, dipakai untuk membuat tombol filter. */
export const CATEGORIES: Category[] = ['hoodie', 't-shirt', 'pants', 'accessories'];

/**
 * Data mock produk.
 * Variasi stok:
 *  - kr-004          -> stok 0 (habis)
 *  - kr-003, kr-005  -> stok < 5 (terbatas)
 *  - sisanya         -> stok aman
 */
export const products: Product[] = [
  {
    id: 'kr-001',
    name: 'Void Heavyweight Hoodie',
    category: 'hoodie',
    price: 549000,
    originalPrice: 699000,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    description:
      'Hoodie 450 GSM dengan potongan boxy dan bahu jatuh. Kain fleece tebal di sisi dalam, hood dua lapis yang berdiri tegak, dan kantong kanguru yang cukup dalam untuk kedua tangan.',
    rating: 4.8,
    reviewCount: 214,
    stock: 12,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'kr-002',
    name: 'Static Boxy Tee',
    category: 't-shirt',
    price: 229000,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    description:
      'Kaos cotton combed 24s dengan siluet boxy dan leher rib tebal yang tidak mudah melar. Sablon plastisol kecil di dada, tidak retak setelah dicuci berulang kali.',
    rating: 4.6,
    reviewCount: 389,
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'kr-003',
    name: 'Nightshift Cargo Pants',
    category: 'pants',
    price: 489000,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    description:
      'Celana cargo berbahan ripstop dengan enam kantong, pinggang karet-tali, dan ujung kaki yang bisa disesuaikan. Cukup longgar untuk bergerak, cukup rapi untuk dipakai keluar malam.',
    rating: 4.7,
    reviewCount: 96,
    stock: 3,
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'kr-004',
    name: 'Concrete Washed Hoodie',
    category: 'hoodie',
    price: 599000,
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description:
      'Hoodie dengan proses stone wash manual sehingga setiap potong punya gradasi warna yang sedikit berbeda. Warna abu beton, jahitan rantai di bahu, dan label tenun di lengan.',
    rating: 4.9,
    reviewCount: 158,
    stock: 0,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'kr-005',
    name: 'Signal Oversized Tee',
    category: 't-shirt',
    price: 249000,
    originalPrice: 299000,
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    description:
      'Kaos oversized dengan grafis besar di punggung dan cetakan kecil di dada. Cotton 20s yang jatuh dan dingin dipakai, tetap tegak setelah dicuci.',
    rating: 4.5,
    reviewCount: 72,
    stock: 4,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'kr-006',
    name: 'Alley Utility Backpack',
    category: 'accessories',
    price: 429000,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    description:
      'Tas punggung 22 liter dari nilon Cordura tahan air. Kompartemen laptop 15 inci, saku rahasia di punggung, dan tali dada yang bisa dilepas.',
    rating: 4.7,
    reviewCount: 131,
    stock: 18,
    sizes: ['M'],
  },
  {
    id: 'kr-007',
    name: 'Dark Denim Carpenter',
    category: 'pants',
    price: 559000,
    originalPrice: 649000,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    description:
      'Denim 14 oz warna hitam pekat dengan potongan carpenter lurus. Gantungan palu di sisi kanan dan lutut yang sedikit diberi ruang agar nyaman dipakai seharian.',
    rating: 4.4,
    reviewCount: 64,
    stock: 8,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'kr-008',
    name: 'Ghost Logo Tee',
    category: 't-shirt',
    price: 199000,
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    description:
      'Kaos hitam dengan logo KRONIK hasil bordir tonal, hampir tidak terlihat kecuali terkena cahaya. Kain tebal 240 GSM dan potongan reguler.',
    rating: 4.6,
    reviewCount: 305,
    stock: 30,
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

/** Mencari produk berdasarkan ID. Mengembalikan undefined jika tidak ada. */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** Format angka menjadi Rupiah, contoh: 549000 -> "Rp 549.000". */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Produk dihitung SALE jika harga asli lebih tinggi dari harga jual. */
export function isOnSale(product: Product): boolean {
  return product.originalPrice !== undefined && product.originalPrice > product.price;
}

/** Produk habis jika stok 0 (atau kurang). */
export function isOutOfStock(product: Product): boolean {
  return product.stock <= 0;
}

/** Stok terbatas: masih ada, tetapi di bawah ambang batas. */
export function isLimitedStock(product: Product): boolean {
  return product.stock > 0 && product.stock < LIMITED_STOCK_THRESHOLD;
}
