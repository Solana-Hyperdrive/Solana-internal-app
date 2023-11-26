import Modal from '@/components/Modal';
import PersonalPin from '@/components/Modal/PersonalPin';
import useDoTnx from '@/hooks/useDoTnx';
import { Button, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { AES } from 'crypto-js';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import useWsStore from 'store/wsStore';

const NotificationCard = ({
  notification,
  isWs = false,
  handleClose,
  setShouldConnectWallet
}: {
  notification: {
    message: string;
    sender_uid: string;
    uuid: string;
    act: any;
  };
  isWs?: boolean;
  handleClose: () => void;
  setShouldConnectWallet: Dispatch<SetStateAction<boolean>>;
}) => {
  const filterNotifications = useWsStore((state) => state.filterNotifications);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { sendSol } = useDoTnx();

  const [personalPin, setPersonalPin] = useState('');

  const path = `/applications/messenger/${notification.sender_uid}`;

  async function handleMessageClick(isPayment: boolean = false) {
    if (isWs) filterNotifications(notification.uuid);

    await axios.post(
      `https://ledger.flitchcoin.com/commit/seen?uuid=${notification.uuid}`,
      notification,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    if (!isWs) queryClient.invalidateQueries({ queryKey: ['notifications'] });

    if (!isPayment && router.asPath !== path) router.push(path);

    handleClose();
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

      let usd = -1;
      if (notification?.act?.product?.price)
        usd = notification.act.product.price;
      else if (notification?.act?.peer?.amt) usd = notification.act.peer.amt;

      const prices = await axios.get(
        'https://ledger.flitchcoin.com/api/prices'
      );

      const sol = usd / prices.data.SOL.price;

      const sign = await sendSol(pub_key, sol);

      const encryptedSign = AES.encrypt(
        sign,
        process.env.NEXT_PUBLIC_AES_KEY
      ).toString();

      await axios.post(
        'https://ledger.flitchcoin.com/payment/verification',
        {
          sign: encryptedSign,
          token
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      await handleMessageClick(true);

      toast.success('Payment successful');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log({ err });

        if (err?.response?.status === 401) toast.error('Wrong personal pin');
      } else if (err instanceof Error && err.message === 'No Public Key') {
        toast.error('Please connect your wallet first');

        setShouldConnectWallet(false); // to force re-render of connect wallet modal
        setShouldConnectWallet(true);
      } else {
        console.log({ err });

        toast.error('Something went wrong! Transaction failed');
      }
    } finally {
      setPersonalPin('');
      handleClose();
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
          buttonText={<Button variant="contained">Accept</Button>}
          modalHeader={
            <Typography fontSize={30} fontWeight={800}>
              Create PINS
            </Typography>
          }
          dialogContentHeader={''}
          dialogContent={
            <PersonalPin
              personalPin={personalPin}
              setPersonalPin={setPersonalPin}
            />
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
