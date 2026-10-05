// Simpan sebagai src/app/dashboard/layout.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/orders', label: 'Pesanan' },
  { href: '/dashboard/products', label: 'Produk' },
];

/** Layout dashboard: sidebar di desktop, tab horizontal di mobile. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // /dashboard hanya aktif jika persis sama; menu lain aktif juga untuk sub-rutenya.
  const isActive = (href: string): boolean =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 lg:flex">
      <aside className="border-b border-neutral-800 lg:min-h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-6 lg:py-8">
          <Link href="/" className="text-xl font-black tracking-[0.3em]">
            KRONIK
          </Link>
          <p className="text-xs text-neutral-500 lg:mt-1">Dashboard</p>
        </div>

        <nav aria-label="Navigasi dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 ${
                  active ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-3 pt-8 lg:block">
          <Link href="/" className="block px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-100">
            Buka toko
          </Link>
          <Link href="/login" className="block px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-100">
            Keluar
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
