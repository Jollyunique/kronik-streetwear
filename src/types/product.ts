/**
 * Tipe data utama untuk KRONIK STREETWEAR.
 * Semua komponen, hook, dan halaman mengimpor tipe dari file ini.
 */

/** Kategori produk yang tersedia di toko. */
export type Category = 'hoodie' | 't-shirt' | 'pants' | 'accessories';

/** Ukuran pakaian yang tersedia. */
export type Size = 'S' | 'M' | 'L' | 'XL';

/** Representasi satu produk di katalog. */
export interface Product {
  /** ID unik produk, juga dipakai sebagai segmen URL (/product/[id]). */
  id: string;
  name: string;
  category: Category;
  /** Harga jual saat ini dalam Rupiah (angka utuh, tanpa desimal). */
  price: number;
  /** Harga asli sebelum diskon. Jika lebih besar dari `price`, produk dianggap SALE. */
  originalPrice?: number;
  /** URL gambar produk. */
  image: string;
  description: string;
  /** Rating rata-rata skala 0 - 5. */
  rating: number;
  /** Jumlah ulasan yang masuk. */
  reviewCount: number;
  /** Sisa stok. 0 = habis, kurang dari 5 = stok terbatas. */
  stock: number;
  /** Ukuran yang diproduksi untuk produk ini. */
  sizes: Size[];
}

/** Satu baris di keranjang: kombinasi produk + ukuran + jumlah. */
export interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
}
