import Modal from '@/components/Modal';
import useDoTnx from '@/hooks/useDoTnx';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { AES } from 'crypto-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useQueryClient } from 'react-query';

const NotificationCard = ({ notification }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { sendSol } = useDoTnx();

  const [personalPin, setPersonalPin] = useState('');

  const path = `/applications/messenger/${notification.sender_uid}`;

  async function handleMessageClick(isPayment: boolean = false) {
    await axios.post(
      `https://ledger.flitchcoin.com/commit/seen?uuid=${notification.uuid}`,
      notification,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    if (!isPayment && router.asPath !== path) router.push(path);
  }

  async function handleAcceptPayment() {
    try {
      if (personalPin.length !== 6) return;

      const encryptedPPin = AES.encrypt(
        personalPin,
        process.env.NEXT_PUBLIC_AES_KEY
      ).toString();

      const response = await axios.post(
        'https://ledger.flitchcoin.com/init/payment/request?solpay=false',
        {
          ptm: notification.act,
          ppin: {
            personal_pin: encryptedPPin
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      const { pub_key, token } = response.data;

      const sign = await sendSol(pub_key, notification.act.product.price);

      await axios.post(
        'https://ledger.flitchcoin.com/payment/verification',
        {
          token,
          sign
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      // await handleMessageClick(true);
    } catch (err) {
      console.log(err);
    }
  }

  // payment notification
  if (notification?.act)
    return (
      <div>
        <Button>
          <p>{notification.message}</p>
        </Button>
        <Modal
          defaultOpen={false}
          buttonText={'Accept'}
          modalHeader={
            <Typography fontSize={30} fontWeight={800}>
              Create PINS
            </Typography>
          }
          dialogContentHeader={''}
          dialogContent={
            <Stack gap={2} alignItems="center">
              <Typography>
                Please enter a 6 digit personal pin to approve transactions
              </Typography>

              <OtpInput
                value={personalPin}
                onChange={setPersonalPin}
                numInputs={6}
                inputType="tel"
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
          }
          handleAction={handleAcceptPayment}
        />
      </div>
    );

  // message notification
  return (
    <Button onClick={() => handleMessageClick()} variant="text">
      <p>{notification.message}</p>
    </Button>
  );
};

export default NotificationCard;
