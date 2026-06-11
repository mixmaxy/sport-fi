import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HiddenTransactionsState {
  hiddenIds: string[];
  hideTransaction: (id: string) => void;
  isHidden: (id: string) => boolean;
}

export const useHiddenTransactionsStore = create<HiddenTransactionsState>()(
  persist(
    (set, get) => ({
      hiddenIds: [],
      hideTransaction: (id) => {
        const { hiddenIds } = get();
        if (hiddenIds.includes(id)) return;
        set({ hiddenIds: [...hiddenIds, id] });
      },
      isHidden: (id) => get().hiddenIds.includes(id),
    }),
    {
      name: "hidden-transactions",
    },
  ),
);

export function isRemovableTransactionStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized === "cancelled" || normalized === "failed";
}
