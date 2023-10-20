import Modal from '@/components/Modal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import {
  Box,
  Stack,
  Typography,
  alpha,
  lighten,
  useTheme
} from '@mui/material';
import axios from 'axios';
import AES from 'crypto-js/aes';
import PropTypes from 'prop-types';
import { FC, ReactNode, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useQuery, useQueryClient } from 'react-query';
import Header from './Header';
import Sidebar from './Sidebar';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: me } = useIsLoggedIn();

  const [personalPin, setPersonalPin] = useState('');
  const [cPin, setCPin] = useState('');

  const theme = useTheme();

  const { data, isLoading } = useQuery(
    ['pins'],
    async () =>
      axios.get('https://ledger.flitchcoin.com/pins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }),
    {
      staleTime: Infinity
    }
  );

  async function handleCreatePins() {
    if (!personalPin || !cPin) return;

    const encryptedPersonalPin = AES.encrypt(
      personalPin,
      process.env.NEXT_PUBLIC_AES_KEY
    ).toString();

    const encryptedCPin = AES.encrypt(
      cPin,
      process.env.NEXT_PUBLIC_AES_KEY
    ).toString();

    await axios.post(
      'https://ledger.flitchcoin.com/pins',
      {
        uid: me?.data?.uid,
        personal_pin: encryptedPersonalPin,
        cpi_pin: encryptedCPin
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    queryClient.invalidateQueries({ queryKey: ['pins'] });
  }

  return (
    <>
      {!data?.data && !isLoading ? (
        <Modal
          defaultOpen={true}
          buttonText={''}
          modalHeader={
            <Typography fontSize={30} fontWeight={800}>
              Create PINS
            </Typography>
          }
          dialogContentHeader={''}
          dialogContent={
            <Stack gap={5} mt={3} alignItems="center">
              <Stack gap={2} alignItems="center">
                <Typography>
                  Please enter a 4 digit C - pin to create payment request
                </Typography>

                <OtpInput
                  value={cPin}
                  onChange={setCPin}
                  numInputs={4}
                  renderSeparator={<span style={{ width: '1rem' }}></span>}
                  inputStyle={{
                    backgroundColor: 'transparent',
                    border: '0.25px solid #ccc',
                    borderRadius: '5px',
                    fontSize: '1.5rem',
                    width: '3rem',
                    height: '3rem'
                  }}
                  renderInput={(props) => <input {...props} />}
                />
              </Stack>

              <Stack gap={2} alignItems="center">
                <Typography>
                  Please enter a 6 digit personal pin to approve transactions
                </Typography>

                <OtpInput
                  value={personalPin}
                  onChange={setPersonalPin}
                  numInputs={6}
                  renderSeparator={<span style={{ width: '1rem' }}></span>}
                  inputStyle={{
                    backgroundColor: 'transparent',
                    border: '0.25px solid #ccc',
                    borderRadius: '5px',
                    fontSize: '1.5rem',
                    width: '3rem',
                    height: '3rem'
                  }}
                  renderInput={(props) => <input {...props} />}
                />
              </Stack>
            </Stack>
          }
          handleAction={handleCreatePins}
        />
      ) : null}

      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                    lighten(theme.colors.primary.main, 0.7),
                    0.15
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                    theme.colors.alpha.black[100],
                    0.1
                  )}, 0px 5px 12px -4px ${alpha(
                    theme.colors.alpha.black[100],
                    0.05
                  )}`
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('lg')]: {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block">{children}</Box>
        </Box>
      </Box>
    </>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node
};

export default SidebarLayout;
