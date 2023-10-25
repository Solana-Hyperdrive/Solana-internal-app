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
import io from 'socket.io-client';

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
  const router = useRouter();
  const theme = useTheme();

  const { data: contacts, isLoading: isLoadingContacts } = useGetContacts();

  const [contactsMenu, setContactsMenu] = useState(false);

  const [recUser, setRecUser] = useState({ uid: '' });

  const handleDrawerToggle = () => {
    setContactsMenu(!contactsMenu);
  };

  useEffect(() => {
    const socket = io('https://socket.flitchcoin.com', {});

    socket.on('connect', () => {
      console.log(socket.id);
    });

    //   // socket.on('message', (data) => {
    //   //   console.log('Transaction UID received with ', data.uid);
    //   //   console.log('Status received with ', data.status);
    //   //   socket.emit('response', { response: 'my response' });
    //   // });

    //   socket.on('disconnect', () => {
    //     console.log('disconnected from server');
    //   });

    return () => {
      // socket.off('connect');
      // socket.off('message');
      // socket.off('disconnect');
    };
  }, []);

  const { data } = useQuery(
    ['recUser', router?.query?.uuid],
    async () => {
      const recUser = contacts?.data?.find(
        (contact) => contact?.uuid === router?.query?.uuid
      );

      setRecUser(recUser);

      return axios.get(
        `https://ledger.flitchcoin.com/prev/msg?rec_uid=${recUser?.uid}&start=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
    },
    { enabled: !!(contacts?.data?.length > 0) && !isLoadingContacts }
  );

  return (
    <RootWrapper>
      <DrawerWrapperMobile
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={contactsMenu}
        onClose={handleDrawerToggle}
      >
        <Scrollbar>
          <SidebarContent />
        </Scrollbar>
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
          <Scrollbar>
            <ChatContent recUser={recUser} chats={data} />
          </Scrollbar>
        </Box>
        <Divider />
        <BottomBarContent recUser={recUser} otherUUID={router?.query?.uuid} />
      </ChatWindow>
    </RootWrapper>
  );
}

ChatBox.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ChatBox;
