import { create } from "zustand";

const useRcStore = create((set) => ({
  connected: false,
  setConnected: (val) => set({ connected: val }),
}));

export default useRcStore;




// const { send } = useMqtt();

// send('forward');
// send('backward');
// send('left');
// send('right');
// send('stop');