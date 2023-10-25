import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import { Avatar, Box, Card, Typography, styled } from '@mui/material';

import { formatDistance } from 'date-fns';

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
      margin-left: 1rem;
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

function ChatBubble({ chat, user, recUser }) {
  const isMe = chat.sender_uid === user?.uid;

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-end"
      flexDirection={isMe ? 'row' : 'row-reverse'}
      py={3}
      key={chat?.uuid}
    >
      <Box
        display="flex"
        alignItems={isMe ? 'flex-end' : 'flex-start'}
        justifyContent="flex-end"
        flexDirection="column"
        mr={2}
      >
        {isMe ? (
          <CardWrapperPrimary>{chat?.message}</CardWrapperPrimary>
        ) : (
          <CardWrapperSecondary>{chat?.message}</CardWrapperSecondary>
        )}
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
        alt={isMe ? user.name : recUser.name}
        src={isMe ? user.avatar : recUser.img}
      />
    </Box>
  );
}

export default ChatBubble;
