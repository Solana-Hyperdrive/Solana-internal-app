import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';

type State = {
  socket: Socket;
  newNotifications: any;
};

type Action = {
  updateNotifications: (state: State['newNotifications']) => void;
  filterNotifications: (state: State['newNotifications']) => void;
};

const useWsStore = create<State & Action>((set) => ({
  socket: io('https://socket.flitchcoin.com', {
    transports: ['websocket']
  }),
  newNotifications: [],
  updateNotifications: (state) =>
    set(({ newNotifications }) => ({
      newNotifications: [...newNotifications, state]
    })),
  filterNotifications: (id: string) =>
    set(({ newNotifications }) => ({
      newNotifications: newNotifications.filter(
        (notification) => notification.uuid !== id
      )
    }))
}));

export default useWsStore;
