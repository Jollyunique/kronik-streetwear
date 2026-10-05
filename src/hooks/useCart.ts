// Simpan sebagai src/hooks/useCart.ts
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product, Size } from '@/types/product';

/** Kunci localStorage supaya keranjang tetap ada saat pindah halaman / refresh. */
const STORAGE_KEY = 'kronik-cart-v1';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  /** Penanda bahwa data localStorage sudah dibaca, agar tidak menimpa data lama dengan array kosong. */
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Membaca keranjang tersimpan sekali saja saat komponen pertama kali muncul di browser.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCartItems(parsed as CartItem[]);
        }
      }
    } catch {
      // Data rusak atau storage tidak tersedia: mulai dengan keranjang kosong.
    }
    setIsHydrated(true);
  }, []);

  // Menyimpan keranjang setiap kali berubah (setelah proses baca selesai).
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Abaikan jika storage penuh atau diblokir.
    }
  }, [cartItems, isHydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  /**
   * Menambah produk ke keranjang.
   * Jika kombinasi produk + ukuran sudah ada, jumlahnya ditambah 1 (maksimal sebesar stok).
   */
  const addToCart = useCallback((product: Product, size: Size) => {
    if (product.stock <= 0) return;

    setCartItems((prev) => {
      const exists = prev.some((item) => item.product.id === product.id && item.size === size);

      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      }

      return [...prev, { product, size, quantity: 1 }];
    });

    // Buka drawer supaya pembeli langsung melihat hasilnya.
    setIsCartOpen(true);
  }, []);

  /** Menghapus satu baris (produk + ukuran) dari keranjang. */
  const removeFromCart = useCallback((productId: string, size: Size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size)),
    );
  }, []);

  /**
   * Mengubah jumlah item sebesar `delta` (+1 / -1).
   * Jumlah tidak boleh melebihi stok; jika turun sampai 0, item otomatis dihapus.
   */
  const updateQuantity = useCallback((productId: string, size: Size, delta: number) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.product.id !== productId || item.size !== size) return [item];

        const nextQuantity = Math.min(item.quantity + delta, item.product.stock);
        return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }];
      }),
    );
  }, []);

  /** Mengosongkan seluruh keranjang. */
  const clearCart = useCallback(() => setCartItems([]), []);

  /** Total harga seluruh item di keranjang. */
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  /** Total jumlah barang (bukan jumlah baris) di keranjang. */
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    /** true setelah keranjang dari localStorage selesai dibaca. */
    isHydrated,
  };
}
