import useGetContacts from '@/hooks/useGetContacts';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
  styled
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `
);

const ListItemWrapper = styled(ListItemButton)(
  ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `
);

function SidebarContent() {
  const router = useRouter();
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();

  const { data: contacts, isLoading: isLoadingContacts } = useGetContacts();

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  return (
    <RootWrapper>
      <Box display="flex" alignItems="flex-start">
        {isMeLoading ? (
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        ) : (
          <Avatar alt={user?.name} src={user?.avatar} />
        )}

        <Box
          sx={{
            ml: 1.5,
            flex: 1
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" noWrap>
                {isMeLoading ? (
                  <Skeleton variant="rectangular" width={150} height={30} />
                ) : (
                  user?.name
                )}
              </Typography>
            </Box>
            <IconButton
              sx={{
                p: 1
              }}
              size="small"
              color="primary"
            >
              <SettingsTwoToneIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <TextField
        sx={{
          mt: 2,
          mb: 1
        }}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          )
        }}
        placeholder="Search..."
      />

      <Typography
        sx={{
          mb: 1,
          mt: 2
        }}
        variant="h3"
      >
        Chats
      </Typography>

      <Box mt={2}>
        <List disablePadding component="div">
          {isMeLoading || isLoadingContacts ? (
            <Skeleton variant="rectangular" width="70vw" height="50vh" />
          ) : null}
          {contacts?.data?.map((contact) => (
            <Link
              href={`/applications/messenger/${contact?.uid}`}
              key={contact?.uuid}
            >
              <ListItemWrapper
                selected={contact?.uid === router.asPath.split('/')[3]}
              >
                <ListItemAvatar>
                  <Avatar src={contact?.img} />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    mr: 1
                  }}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    variant: 'h5',
                    noWrap: true
                  }}
                  secondaryTypographyProps={{
                    color: 'textSecondary',
                    noWrap: true
                  }}
                  primary={contact?.name || contact?.email}
                />
                {/* <Label color="primary">
                  <b>0</b>
                </Label> */}
              </ListItemWrapper>
            </Link>
          ))}
        </List>
      </Box>
    </RootWrapper>
  );
}

export default SidebarContent;
