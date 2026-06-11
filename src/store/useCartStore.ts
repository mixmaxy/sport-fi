import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, SportActivity } from '@/shared/types';
import { normalizeSportActivity } from '@/features/activity/lib/activities.mapper';
import { getActivityFinalPrice } from '@/shared/utils/helper';

function normalizeCartItem(item: CartItem): CartItem | null {
    const activity = normalizeSportActivity(item.activity);
    if (!activity) return null;
    return {
        ...item,
        activity,
        quantity: Math.max(1, item.quantity),
    };
}

function normalizeCartItems(items: CartItem[]): CartItem[] {
    return items
        .map(normalizeCartItem)
        .filter((item): item is CartItem => item != null);
}

interface CartState {
    // State
    items: CartItem[];

    // Computed
    totalItems: number;
    totalPrice: number;

    // Actions
    addItem: (activity: SportActivity, quantity?: number) => void;
    removeItem: (activityId: string) => void;
    updateQuantity: (activityId: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (activityId: string) => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            // Initial state
            items: [],
            totalItems: 0,
            totalPrice: 0,

            // Add item to cart or increase quantity if already exists
            addItem: (activity, quantity = 1) => {
                const normalizedActivity = normalizeSportActivity(activity);
                if (!normalizedActivity) return;

                const { items } = get();
                const existingItem = items.find(
                    item => item.activity.id === normalizedActivity.id,
                );

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.activity.id === normalizedActivity.id
                                ? { ...item, activity: normalizedActivity, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { activity: normalizedActivity, quantity }] });
                }

                updateComputedValues(get);
            },

            // Remove item from cart completely
            removeItem: (activityId) => {
                set({
                    items: get().items.filter(item => item.activity.id !== activityId),
                });
                updateComputedValues(get);
            },

            // Update item quantity (or remove if quantity is 0)
            updateQuantity: (activityId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(activityId);
                    return;
                }

                set({
                    items: get().items.map(item =>
                        item.activity.id === activityId
                            ? { ...item, quantity }
                            : item
                    ),
                });
                updateComputedValues(get);
            },

            // Clear all items from cart
            clearCart: () => {
                set({ items: [], totalItems: 0, totalPrice: 0 });
            },

            // Get quantity of specific item in cart
            getItemQuantity: (activityId) => {
                const item = get().items.find(item => item.activity.id === activityId);
                return item?.quantity || 0;
            },
        }),
        {
            name: 'cart-storage-v2', // localStorage key
            partialize: (state) => ({
                items: state.items,
            }),
            merge: (persisted, current) => {
                const items = normalizeCartItems(
                    (persisted as Partial<CartState> | undefined)?.items ??
                    current.items,
                );
                return {
                    ...current,
                    items,
                    ...computeCartTotals(items),
                };
            },
            onRehydrateStorage: () => (_state, error) => {
                if (!error) {
                    updateComputedValues(useCartStore.getState);
                }
            },
        }
    )
);

function computeCartTotals(items: CartItem[]) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const price = getActivityFinalPrice(
            item.activity.price,
            item.activity.priceDiscount,
        );
        return sum + price * item.quantity;
    }, 0);
    return { totalItems, totalPrice };
}

export function selectCartTotalItems(state: CartState): number {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartTotalPrice(state: CartState): number {
    return computeCartTotals(state.items).totalPrice;
}

function updateComputedValues(get: () => CartState) {
    useCartStore.setState(computeCartTotals(get().items));
}