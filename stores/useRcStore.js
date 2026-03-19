import { create } from "zustand";

const useRcStore = create((set) => ({
  connected: false,
  setConnected: (val) => set({ connected: val }),
  send: null,
  setSend: (fn) => set({ send: fn }),
}));

export default useRcStore;