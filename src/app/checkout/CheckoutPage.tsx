// Simpan sebagai src/app/checkout/page.tsx
'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { FormField, fieldA11y, inputClass } from '@/components/FormField';
import { formatRupiah } from '@/data/products';
import { useCart } from '@/hooks/useCart';

/* ------------------------------------------------------------------ */
/* Tipe & konfigurasi                                                  */
/* ------------------------------------------------------------------ */

type ShippingMethodId = 'regular' | 'express' | 'sameday';
type PaymentMethodId = 'qris' | 'transfer' | 'cod';

interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  eta: string;
  cost: number;
}

interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
}

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
}

type ShippingErrors = Partial<Record<keyof ShippingForm, string>>;

/** Pesanan yang berhasil dibuat, dipakai untuk layar sukses. */
interface PlacedOrder {
  orderNumber: string;
  total: number;
  paymentId: PaymentMethodId;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'regular', label: 'Reguler', eta: 'Tiba dalam 3 - 5 hari kerja', cost: 20000 },
  { id: 'express', label: 'Express', eta: 'Tiba dalam 1 - 2 hari kerja', cost: 35000 },
  { id: 'sameday', label: 'Same Day', eta: 'Tiba hari ini (pesan sebelum pukul 14.00)', cost: 55000 },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'qris', label: 'QRIS', description: 'GoPay, OVO, DANA, ShopeePay, dan m-banking' },
  { id: 'transfer', label: 'Transfer Bank', description: 'Virtual account BCA, Mandiri, BNI, BRI' },
  { id: 'cod', label: 'Bayar di Tempat (COD)', description: 'Bayar tunai ke kurir saat barang tiba' },
];

/** Gratis ongkir untuk pengiriman Reguler jika belanja mencapai batas ini. */
const FREE_SHIPPING_THRESHOLD = 1000000;

const PHONE_PATTERN = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

const INITIAL_FORM: ShippingForm = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  notes: '',
};

/** Menghitung ongkir akhir, termasuk aturan gratis ongkir. */
function getShippingCost(method: ShippingMethod, subtotal: number): number {
  return method.id === 'regular' && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : method.cost;
}

/** Validasi form alamat pengiriman. */
function validate(form: ShippingForm): ShippingErrors {
  const errors: ShippingErrors = {};

  if (form.fullName.trim().length < 3) errors.fullName = 'Nama penerima minimal 3 karakter.';

  const cleanPhone = form.phone.replace(/[\s-]/g, '');
  if (!cleanPhone) {
    errors.phone = 'Nomor telepon wajib diisi.';
  } else if (!PHONE_PATTERN.test(cleanPhone)) {
    errors.phone = 'Gunakan nomor HP Indonesia yang valid, contoh 081234567890.';
  }

  if (form.address.trim().length < 10) errors.address = 'Alamat lengkap minimal 10 karakter.';
  if (!form.city.trim()) errors.city = 'Kota / kabupaten wajib diisi.';
  if (!form.province.trim()) errors.province = 'Provinsi wajib diisi.';
  if (!/^[0-9]{5}$/.test(form.postalCode)) errors.postalCode = 'Kode pos harus 5 digit angka.';

  return errors;
}

/** Judul bagian form. */
function SectionTitle({ children }: { children: string }) {
  return <h2 className="mb-6 text-lg font-bold">{children}</h2>;
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const { cartItems, totalPrice, totalItems, clearCart, isHydrated } = useCart();

  const [form, setForm] = useState<ShippingForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [shippingId, setShippingId] = useState<ShippingMethodId>('regular');
  const [paymentId, setPaymentId] = useState<PaymentMethodId>('qris');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const selectedShipping =
    SHIPPING_METHODS.find((method) => method.id === shippingId) ?? SHIPPING_METHODS[0];
  const shippingCost = getShippingCost(selectedShipping, totalPrice);
  const grandTotal = totalPrice + shippingCost;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: kirim data pesanan ke API (alamat, item keranjang, metode kirim & bayar).
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setPlacedOrder({
        orderNumber: `KRN-${Date.now().toString().slice(-6)}`,
        total: grandTotal,
        paymentId,
      });
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="text-xl font-black tracking-[0.3em]">
          KRONIK
        </Link>
        <Link href="/cart" className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-100 hover:underline">
          ← Kembali ke keranjang
        </Link>
      </div>
    </header>
  );

  /* ---------- Layar sukses setelah Place Order ---------- */
  if (placedOrder) {
    const paymentLabel =
      PAYMENT_METHODS.find((method) => method.id === placedOrder.paymentId)?.label ?? '';
    const paymentInstruction: Record<PaymentMethodId, string> = {
      qris: 'Kode QRIS akan dikirim ke emailmu. Selesaikan pembayaran dalam 24 jam.',
      transfer: 'Nomor virtual account akan dikirim ke emailmu. Selesaikan pembayaran dalam 24 jam.',
      cod: 'Siapkan uang tunai sesuai total pesanan saat kurir tiba.',
    };

    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        {header}
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <div
            className="mx-auto mb-8 flex h-14 w-14 items-center justify-center border border-emerald-400 text-2xl text-emerald-400"
            aria-hidden="true"
          >
            ✓
          </div>
          <h1 className="text-3xl font-black tracking-tight">Pesanan dibuat</h1>
          <p className="mt-3 text-neutral-400">
            Nomor pesanan <span className="font-bold text-neutral-100">{placedOrder.orderNumber}</span>
          </p>

          <dl className="mt-8 space-y-3 border border-neutral-800 bg-neutral-900/40 p-6 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-400">Metode pembayaran</dt>
              <dd className="font-semibold">{paymentLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">Total</dt>
              <dd className="font-bold">{formatRupiah(placedOrder.total)}</dd>
            </div>
          </dl>

          <p className="mt-6 text-sm text-neutral-400">{paymentInstruction[placedOrder.paymentId]}</p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/orders"
              className="bg-neutral-100 px-8 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white"
            >
              Lihat pesanan
            </Link>
            <Link
              href="/"
              className="border border-neutral-700 px-8 py-3 text-sm font-bold transition-colors hover:border-neutral-100"
            >
              Lanjut belanja
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- Menunggu keranjang dibaca ---------- */
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        {header}
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-10" role="status" aria-label="Memuat checkout">
          <div className="h-10 w-48 bg-neutral-800" />
          <div className="mt-10 h-96 border border-neutral-800 bg-neutral-900/40" />
        </div>
      </div>
    );
  }

  /* ---------- Keranjang kosong ---------- */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        {header}
        <main className="mx-auto max-w-xl px-4 py-32 text-center">
          <h1 className="text-2xl font-black">Tidak ada yang bisa di-checkout</h1>
          <p className="mt-3 text-sm text-neutral-400">Keranjangmu kosong. Tambahkan produk dulu sebelum checkout.</p>
          <Link
            href="/"
            className="mt-8 inline-block bg-neutral-100 px-8 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-white"
          >
            Kembali ke toko
          </Link>
        </main>
      </div>
    );
  }

  /* ---------- Form checkout ---------- */
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {header}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Checkout</h1>

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_26rem]"
        >
          <div className="space-y-12">
            {/* 1. Alamat pengiriman */}
            <section aria-labelledby="shipping-address-title">
              <h2 id="shipping-address-title" className="sr-only">
                Alamat pengiriman
              </h2>
              <SectionTitle>Alamat pengiriman</SectionTitle>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField id="fullName" label="Nama penerima" error={errors.fullName}>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    className={inputClass(Boolean(errors.fullName))}
                    {...fieldA11y('fullName', errors.fullName)}
                  />
                </FormField>

                <FormField id="phone" label="Nomor telepon" error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className={inputClass(Boolean(errors.phone))}
                    {...fieldA11y('phone', errors.phone)}
                  />
                </FormField>

                <FormField id="address" label="Alamat lengkap" error={errors.address} className="sm:col-span-2">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    className={inputClass(Boolean(errors.address))}
                    {...fieldA11y('address', errors.address)}
                  />
                </FormField>

                <FormField id="city" label="Kota / kabupaten" error={errors.city}>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass(Boolean(errors.city))}
                    {...fieldA11y('city', errors.city)}
                  />
                </FormField>

                <FormField id="province" label="Provinsi" error={errors.province}>
                  <input
                    id="province"
                    name="province"
                    type="text"
                    autoComplete="address-level1"
                    value={form.province}
                    onChange={handleChange}
                    className={inputClass(Boolean(errors.province))}
                    {...fieldA11y('province', errors.province)}
                  />
                </FormField>

                <FormField id="postalCode" label="Kode pos" error={errors.postalCode}>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    autoComplete="postal-code"
                    value={form.postalCode}
                    onChange={handleChange}
                    className={inputClass(Boolean(errors.postalCode))}
                    {...fieldA11y('postalCode', errors.postalCode)}
                  />
                </FormField>

                <FormField id="notes" label="Catatan untuk kurir (opsional)" error={errors.notes}>
                  <input
                    id="notes"
                    name="notes"
                    type="text"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Contoh: titip di satpam"
                    className={inputClass(false)}
                  />
                </FormField>
              </div>
            </section>

            {/* 2. Metode pengiriman */}
            <section>
              <SectionTitle>Metode pengiriman</SectionTitle>
              <div role="radiogroup" aria-label="Metode pengiriman" className="space-y-3">
                {SHIPPING_METHODS.map((method) => {
                  const active = shippingId === method.id;
                  const cost = getShippingCost(method, totalPrice);
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                        active ? 'border-neutral-100 bg-neutral-900' : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={active}
                        onChange={() => setShippingId(method.id)}
                        className="h-4 w-4 accent-neutral-100"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-bold">{method.label}</span>
                        <span className="block text-xs text-neutral-400">{method.eta}</span>
                      </span>
                      <span className="text-sm font-semibold">
                        {cost === 0 ? 'Gratis' : formatRupiah(cost)}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Gratis ongkir Reguler untuk belanja di atas {formatRupiah(FREE_SHIPPING_THRESHOLD)}.
              </p>
            </section>

            {/* 3. Pembayaran */}
            <section>
              <SectionTitle>Pembayaran</SectionTitle>
              <div role="radiogroup" aria-label="Metode pembayaran" className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const active = paymentId === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                        active ? 'border-neutral-100 bg-neutral-900' : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={active}
                        onChange={() => setPaymentId(method.id)}
                        className="h-4 w-4 accent-neutral-100"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-bold">{method.label}</span>
                        <span className="block text-xs text-neutral-400">{method.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {paymentId === 'qris' && (
                <div className="mt-4 border border-dashed border-neutral-700 p-5 text-sm text-neutral-300">
                  <p className="font-semibold">Cara bayar dengan QRIS</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-neutral-400">
                    <li>Tekan Place Order untuk membuat pesanan.</li>
                    <li>Kode QRIS dikirim ke emailmu.</li>
                    <li>Pindai dengan aplikasi e-wallet atau m-banking, lalu konfirmasi pembayaran.</li>
                  </ol>
                </div>
              )}
            </section>
          </div>

          {/* Ringkasan pesanan */}
          <aside className="h-fit border border-neutral-800 bg-neutral-900/40 p-6 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold">Ringkasan pesanan</h2>

            <ul className="mt-6 max-h-72 divide-y divide-neutral-800 overflow-y-auto">
              {cartItems.map((item) => (
                <li key={`${item.product.id}-${item.size}`} className="flex gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-14 shrink-0 bg-neutral-900 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.product.name}</p>
                    <p className="text-xs text-neutral-500">
                      Ukuran {item.size} · Jumlah {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatRupiah(item.product.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-neutral-800 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-400">Subtotal ({totalItems} barang)</dt>
                <dd className="font-semibold">{formatRupiah(totalPrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400">Ongkos kirim ({selectedShipping.label})</dt>
                <dd className="font-semibold">{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-neutral-800 pt-6">
              <span className="text-sm text-neutral-400">Total</span>
              <span className="text-2xl font-black">{formatRupiah(grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-neutral-100 py-4 text-sm font-bold text-neutral-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              {isSubmitting ? 'Memproses pesanan...' : 'Place Order'}
            </button>
            {Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-3 text-center text-xs text-red-500">
                Periksa kembali kolom yang ditandai merah.
              </p>
            )}
          </aside>
        </form>
      </main>
    </div>
  );
}
