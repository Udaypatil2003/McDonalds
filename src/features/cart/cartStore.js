import { create } from 'zustand';

/**
 * Zustand single shared store for cart quantities keyed by itemId.
 */
export const useCartStore = create((set, get) => ({
  // Map of itemId -> quantity
  quantities: {},

  // Bottom Sheet modal visibility state
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // Quantity actions
  increment: (itemId) => {
    if (!itemId) return;
    set((state) => {
      const current = state.quantities[itemId] || 0;
      return {
        quantities: {
          ...state.quantities,
          [itemId]: current + 1,
        },
      };
    });
  },

  decrement: (itemId) => {
    if (!itemId) return;
    set((state) => {
      const current = state.quantities[itemId] || 0;
      if (current <= 1) {
        const next = { ...state.quantities };
        delete next[itemId];
        return { quantities: next };
      }
      return {
        quantities: {
          ...state.quantities,
          [itemId]: current - 1,
        },
      };
    });
  },

  setQuantity: (itemId, qty) => {
    if (!itemId) return;
    set((state) => {
      if (qty <= 0) {
        const next = { ...state.quantities };
        delete next[itemId];
        return { quantities: next };
      }
      return {
        quantities: {
          ...state.quantities,
          [itemId]: qty,
        },
      };
    });
  },

  clearCart: () => set({ quantities: {} }),

  // Selectors
  getQuantity: (itemId) => {
    return get().quantities[itemId] || 0;
  },

  getTotalCount: () => {
    const { quantities } = get();
    return Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  },

  getTotalAmount: (itemsMap) => {
    const { quantities } = get();
    let total = 0;
    for (const [itemId, qty] of Object.entries(quantities)) {
      if (qty > 0 && itemsMap && itemsMap.has(itemId)) {
        const item = itemsMap.get(itemId);
        const price = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;
        total += price * qty;
      }
    }
    return total;
  },

  getCartItems: (itemsMap) => {
    const { quantities } = get();
    const result = [];
    for (const [itemId, qty] of Object.entries(quantities)) {
      if (qty > 0 && itemsMap && itemsMap.has(itemId)) {
        result.push({
          item: itemsMap.get(itemId),
          quantity: qty,
        });
      }
    }
    return result;
  },
}));

export default useCartStore;
