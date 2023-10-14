import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { useQueryClient } from 'react-query';

export default function AddAlias() {
  const [open, setOpen] = React.useState(false);
  const [alias, setAlias] = React.useState('');
  const [wallet, setWallet] = React.useState('');

  const queryClient = useQueryClient();

  const { data } = useIsLoggedIn();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleAddAlias() {
    if (!alias || !wallet) return;

    await axios.post(
      'https://ledger.flitchcoin.com/alias',
      {
        email: data?.data?.email,
        uid: data?.data?.uid,
        alias,
        sol_wallet: wallet
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    queryClient.invalidateQueries({ queryKey: ['alias'] });
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Alias
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Alias</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add the wallet address you would like to add as an alias.
          </DialogContentText>
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Wallet Address"
            type="text"
            fullWidth
            variant="standard"
            required
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAlias}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
