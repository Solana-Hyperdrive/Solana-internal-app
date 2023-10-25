import { Box } from '@mui/material';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import ChatBubble from './ChatBubble';

// const DividerWrapper = styled(Divider)(
//   ({ theme }) => `
//       .MuiDivider-wrapper {
//         border-radius: ${theme.general.borderRadiusSm};
//         text-transform: none;
//         background: ${theme.palette.background.default};
//         font-size: ${theme.typography.pxToRem(13)};
//         color: ${theme.colors.alpha.black[50]};
//       }
// `
// );

function ChatContent({ recUser, prevChats, newChats }) {
  const { data: me, isLoading } = useIsLoggedIn();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img,
    uid: me?.data?.uid
  };

  return (
    <Box p={3}>
      {/* <DividerWrapper>
        {format(subDays(new Date(), 3), 'MMMM dd yyyy')}
      </DividerWrapper> */}

      {/* Previous chats - Loaded from DB */}
      {prevChats?.data
        ?.sort((chat1, chat2) => chat1.ts - chat2.ts)
        .map((chat) => (
          <ChatBubble
            key={chat?.uuid}
            recUser={recUser}
            chat={chat}
            user={user}
          />
        ))}
      {/* New chats - from web socket */}
      {newChats?.map((chat) => (
        <ChatBubble
          key={chat?.uuid}
          recUser={recUser}
          chat={chat}
          user={user}
        />
      ))}
    </Box>
  );
}

export default ChatContent;
