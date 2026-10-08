// app/page.tsx (PURE SERVER COMPONENT)
import { products } from '@/data/products';
import { ProductCatalog } from '@/components/ProductCatalog';
import { HeaderCartButton } from '@/components/HeaderCartButton'; // Komponen tombol keranjang di header

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 px-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <a href="/" className="text-xl font-black tracking-[0.3em]">
            KRONIK
          </a>
          <HeaderCartButton />
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

        {/* Katalog Produk (Client Component untuk search & filter) */}
        <ProductCatalog products={products} />
      </main>

      <footer className="border-t border-neutral-800 px-4 py-8 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} KRONIK STREETWEAR. Semua hak dilindungi.
      </footer>
    </div>
  );
}