import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    align-self: start;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

const ProfileCover = () => {
  const router = useRouter();

  const { data: me, isLoading } = useIsLoggedIn();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  // const [coverImage, setCoverImage] = useState(null);
  const [coverImageObjectURL, setCoverImageObjectURL] = useState(null);

  // async function handleImageUploadToS3(file) {
  //   try {
  //     if (!file) throw new Error();
  //     console.log({ name: file.name, type: file.type });
  //     // Fetch Upload url
  //     const response = await fetch(`/api/preSignedUrl?fileName=${file.name}`);

  //     if (!response) throw new Error();

  //     const data = await response?.json();
  //     const { url } = data as { url: string };

  //     // PUT file to s3 bucket
  //     const res = await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': file.type ? file.type : 'image/jpeg'
  //       },
  //       body: file
  //     });
  //     if (res?.status === 200) {
  //       const imageUrl = url.split('?')[0];
  //       console.log({ imageUrl });
  //       return imageUrl;
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (isNaN(Number(price)) || !name || !description) return;

    await axios.post(
      'https://ledger.flitchcoin.com/product',
      {
        uid: me?.data?.uid,
        name,
        price: Number(price),
        currency,
        description
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    router.push('/management/product/all');
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack gap={3}>
        <Typography variant="h3">
          {me?.data?.name}, create a new product to sell
        </Typography>

        <TextField
          label="Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <CardCover>
          <CardMedia image={coverImageObjectURL} />
          <CardCoverAction>
            <Input
              accept="image/*"
              id="change-cover"
              type="file"
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  const i = event.target.files[0];

                  // setCoverImage(i);
                  setCoverImageObjectURL(URL.createObjectURL(i));
                }
              }}
            />
            <label htmlFor="change-cover">
              <Button
                startIcon={<UploadTwoToneIcon />}
                variant="contained"
                component="span"
              >
                Change cover
              </Button>
            </label>
          </CardCoverAction>
        </CardCover>
        <AvatarWrapper>
          <Avatar variant="rounded" alt="" src="" />
          <ButtonUploadWrapper>
            <Input
              accept="image/*"
              id="icon-button-file"
              name="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <IconButton component="span" color="primary">
                <UploadTwoToneIcon />
              </IconButton>
            </label>
          </ButtonUploadWrapper>
        </AvatarWrapper>
        <TextField
          label="Price (USD)"
          variant="outlined"
          required
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel id="currency">Currency</InputLabel>
          <Select
            labelId="currency"
            value={currency}
            label="Currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value="USD">USD ($)</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default ProfileCover;
