import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from '@/components/Text';
import Label from '@/components/Label';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Check } from '@mui/icons-material';
import TextField from '@mui/material/TextField';

function EditProfileTab() {
  const { data, isLoading } = useIsLoggedIn();

  const [editMode, setEditMode] = useState({
    personal: false,
    development: false,
    account: false,
    email: false
  });

  const [form, setForm] = useState({ name: '' });

  useEffect(() => {
    setForm({ name: data?.data?.name || '' });
  }, [isLoading]);

  if (isLoading || !data) {
    return 'Loading...';
  }

  async function handleEdit(tab: string) {
    await axios('https://ledger.flitchcoin.com/user', {
      method: 'PUT',
      data: form,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    setEditMode({ ...editMode, [tab]: !editMode[tab] });
  }

  function enableEditMode(tab: string) {
    setEditMode({ ...editMode, [tab]: !editMode[tab] });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Personal Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to your personal details
              </Typography>
            </Box>
            {editMode.personal ? (
              <>
                <Button
                  variant="text"
                  color="success"
                  startIcon={<Check />}
                  onClick={() => handleEdit('personal')}
                >
                  Done
                </Button>
              </>
            ) : (
              <Button
                variant="text"
                startIcon={<EditTwoToneIcon />}
                onClick={() => enableEditMode('personal')}
              >
                Edit
              </Button>
            )}
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {editMode.personal ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={form.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        console.log(e.target.value);
                        setForm((prevState) => ({
                          ...prevState,
                          name: e.target.value
                        }));
                      }}
                    />
                  ) : (
                    <Text color="black">
                      <b>{data.data.name}</b>
                    </Text>
                  )}
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Development Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to your development details
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    WebHook URL:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{data.data.name}</b>
                  </Text>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Account Settings
              </Typography>
              <Typography variant="subtitle2">
                Manage details related to your account
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Language:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>English (US)</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Timezone:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>GMT +2</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Account status:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Label color="success">
                    <DoneTwoToneIcon fontSize="small" />
                    <b>Active</b>
                  </Label>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Email Addresses
              </Typography>
              <Typography variant="subtitle2">
                Manage details related to your associated email addresses
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Email ID:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{data.data.email}</b>
                  </Text>
                  <Box pl={1} component="span">
                    <Label color="success">Primary</Label>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default EditProfileTab;
