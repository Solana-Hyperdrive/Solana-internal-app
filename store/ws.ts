import { io } from 'socket.io-client';
import { create } from 'zustand';

const useWsStore = create(() => ({
  socket: io('https://socket.flitchcoin.com', {
    transports: ['websocket']
  })
}));

export default useWsStore;
