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
  TextField,
  Typography,
  styled
} from '@mui/material';
import Label from 'src/components/Label';

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
  const { data, isLoading } = useIsLoggedIn();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const user = {
    name: data?.data?.name,
    avatar: data?.data?.img
  };

  return (
    <RootWrapper>
      <Box display="flex" alignItems="flex-start">
        <Avatar alt={user.name} src={user.avatar} />
        <Box
          sx={{
            ml: 1.5,
            flex: 1
          }}
        >
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" noWrap>
                {user.name}
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
          <ListItemWrapper selected>
            <ListItemAvatar>
              <Avatar src="/static/images/avatars/1.jpg" />
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
              primary="Zain Baptista"
              secondary="Hey there, how are you today? Is it ok if I call you?"
            />
            <Label color="primary">
              <b>2</b>
            </Label>
          </ListItemWrapper>
        </List>
      </Box>
    </RootWrapper>
  );
}

export default SidebarContent;
