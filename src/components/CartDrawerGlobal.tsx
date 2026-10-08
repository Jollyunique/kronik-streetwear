'use client';

import { CartDrawer } from './CartDrawer';
import { useCartContext } from '@/context/cartcontext';

export function CartDrawerGlobal() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCartContext();

  return (
    <CartDrawer
      isOpen={isCartOpen}
      onClose={closeCart}
      items={cartItems}
      onRemove={removeFromCart}
      onUpdateQuantity={updateQuantity}
    />
  );
}