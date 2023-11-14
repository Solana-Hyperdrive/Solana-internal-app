import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';

type State = {
  socket: Socket;
  recUser: any;
  newChat: any;
  newNotifications: any;
};

type Action = {
  updateNotifications: (state: State['newNotifications']) => void;
  updateNewChat: (state: State['newChat']) => void;
  clearNewChat: () => void;
  updateRecUser: (state: State['recUser']) => void;
  clearRecUser: () => void;
  filterNotifications: (state: State['newNotifications']) => void;
};

const useWsStore = create<State & Action>((set) => ({
  socket: io('https://socket.flitchcoin.com', {
    transports: ['websocket']
  }),
  recUser: null,
  newChat: [],
  newNotifications: [],
  updateNotifications: (state) =>
    set(({ newNotifications }) => ({
      newNotifications: [...newNotifications, state]
    })),
  updateRecUser: (state) => set(() => ({ recUser: state })),
  clearRecUser: () => set(() => ({ recUser: {} })),
  updateNewChat: (state) =>
    set(({ newChat }) => ({ newChat: [...newChat, state] })),
  clearNewChat: () => set(() => ({ newChat: [] })),
  filterNotifications: (id: string) =>
    set(({ newNotifications }) => ({
      newNotifications: newNotifications.filter(
        (notification) => notification.uuid !== id
      )
    }))
}));

export default useWsStore;
