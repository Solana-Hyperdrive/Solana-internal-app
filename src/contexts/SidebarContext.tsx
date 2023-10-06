import { useState, ReactNode, createContext } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

type SidebarContext = {
  sidebarToggle: any;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SidebarContext = createContext<SidebarContext>(
  {} as SidebarContext
);

type Props = {
  children: ReactNode;
};

export function SidebarProvider({ children }: Props) {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  // const wallet = useWallet();
  // console.log({ wallet })

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  // need to add WalletMultiButton on topbar
  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
