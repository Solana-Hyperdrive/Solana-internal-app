import { Avatar, Box, Card, Divider, Typography, styled } from '@mui/material';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import { formatDistance, subMinutes } from 'date-fns';

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
      .MuiDivider-wrapper {
        border-radius: ${theme.general.borderRadiusSm};
        text-transform: none;
        background: ${theme.palette.background.default};
        font-size: ${theme.typography.pxToRem(13)};
        color: ${theme.colors.alpha.black[50]};
      }
`
);

const CardWrapperPrimary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-right-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

const CardWrapperSecondary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[10]};
      color: ${theme.colors.alpha.black[100]};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

function ChatContent({ recUser, chats }) {
  const { data: me, isLoading } = useIsLoggedIn();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  return (
    <Box p={3}>
      {/* <DividerWrapper>
        {format(subDays(new Date(), 3), 'MMMM dd yyyy')}
      </DividerWrapper> */}

      {chats?.data
        ?.sort((chat1, chat2) => chat1.ts - chat2.ts)
        .map((chat) =>
          chat.sender_uid === me?.data?.uid ? (
            // My chats
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-end"
              py={3}
              key={chat?.uuid}
            >
              <Box
                display="flex"
                alignItems="flex-end"
                flexDirection="column"
                justifyContent="flex-end"
                mr={2}
              >
                <CardWrapperPrimary>{chat?.message}</CardWrapperPrimary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(chat?.ts * 1000, new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt={user.name}
                src={user.avatar}
              />
            </Box>
          ) : (
            // Other user's chats
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              py={3}
              key={chat?.uuid}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt={recUser?.name}
                src={recUser?.img}
              />
              <Box
                display="flex"
                alignItems="flex-start"
                flexDirection="column"
                justifyContent="flex-start"
                ml={2}
              >
                <CardWrapperSecondary>Hey there!</CardWrapperSecondary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(subMinutes(new Date(), 6), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
            </Box>
          )
        )}
    </Box>
  );
}

export default ChatContent;
