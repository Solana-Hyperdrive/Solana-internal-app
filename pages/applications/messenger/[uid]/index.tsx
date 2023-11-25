import Scrollbar from '@/components/Scrollbar';
import BottomBarContent from '@/content/Applications/Messenger/BottomBarContent';
import ChatContent from '@/content/Applications/Messenger/ChatContent';
import SidebarContent from '@/content/Applications/Messenger/SidebarContent';
import TopBarContent from '@/content/Applications/Messenger/TopBarContent';
import useGetContacts from '@/hooks/useGetContacts';
import SidebarLayout from '@/layouts/SidebarLayout';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  styled,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import useWsStore from 'store/wsStore';

const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(2)};
        align-items: center;
`
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  background: ${theme.colors.alpha.white[100]};
`
);

function ChatBox() {
  const newChats = useWsStore((state) => state.newChat);
  const clearNewChat = useWsStore((state) => state.clearNewChat);

  const recUser = useWsStore((state) => state.recUser);
  const updateRecUser = useWsStore((state) => state.updateRecUser);
  const clearRecUser = useWsStore((state) => state.clearRecUser);

  const router = useRouter();
  const theme = useTheme();

  const [contactsMenu, setContactsMenu] = useState(false);

  const { data: contacts, isLoading: isLoadingContacts } = useGetContacts();

  const { data } = useQuery(
    ['recUser', router?.query?.uid],
    async () => {
      const recUser = contacts?.data?.find(
        (contact) => contact?.uid === router?.query?.uid
      );

      updateRecUser(recUser);

      return axios.get(
        `https://ledger.flitchcoin.com/prev/msg?rec_uid=${recUser?.uid}&start=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
    },
    {
      enabled: !!(contacts?.data?.length > 0) && !isLoadingContacts,
      refetchInterval: Infinity
    }
  );

  // reset newChats when changing recUser
  useEffect(() => {
    clearNewChat();

    return () => {
      clearNewChat();
      clearRecUser();
    };
  }, [router?.query?.uid]);

  const handleDrawerToggle = () => {
    setContactsMenu(!contactsMenu);
  };

  return (
    <RootWrapper>
      <DrawerWrapperMobile
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={contactsMenu}
        onClose={handleDrawerToggle}
      >
        <SidebarContent />
      </DrawerWrapperMobile>

      <ChatWindow>
        <ChatTopBar
          sx={{
            display: 'flex',
            gap: 2
          }}
        >
          <IconButtonToggle
            sx={{
              mr: 2
            }}
            color="primary"
            onClick={handleDrawerToggle}
            size="small"
          >
            <MenuTwoToneIcon />
          </IconButtonToggle>
          <TopBarContent recUser={recUser} />
        </ChatTopBar>
        <Box flex={1}>
          <Scrollbar className="no-scrollbar">
            <ChatContent
              recUser={recUser}
              prevChats={data}
              newChats={newChats}
            />
          </Scrollbar>
        </Box>
        <Divider />
        <BottomBarContent recUser={recUser} />
      </ChatWindow>
    </RootWrapper>
  );
}

ChatBox.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ChatBox;
