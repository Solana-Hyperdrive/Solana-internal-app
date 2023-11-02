import Modal from '@/components/Modal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React from 'react';
import { useQueryClient } from 'react-query';

export default function AddAlias() {
  const [alias, setAlias] = React.useState('');

  const queryClient = useQueryClient();

  const { data } = useIsLoggedIn();

  async function handleAddAlias() {
    if (!alias) return;

    await axios.post(
      'https://ledger.flitchcoin.com/alias',
      {
        email: data?.data?.email,
        uid: data?.data?.uid,
        alias
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    setAlias('');

    queryClient.invalidateQueries({ queryKey: ['alias'] });
  }

  return (
    <>
      <Modal
        modalHeader="Add Alias"
        dialogContentHeader="Please add the wallet address you would like to add as an alias."
        dialogContent={
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Alias"
            type="text"
            fullWidth
            variant="standard"
            value={alias}
            required
            onChange={(e) => setAlias(e.target.value)}
          />
        }
        handleAction={handleAddAlias}
        buttonText="Add Alias"
      />
    </>
  );
}
