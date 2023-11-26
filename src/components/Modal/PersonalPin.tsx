import { Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import OtpInput from 'react-otp-input';

const PersonalPin = ({
  personalPin,
  setPersonalPin
}: {
  personalPin: string;
  setPersonalPin: Dispatch<SetStateAction<string>>;
}) => {
  return (
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
  );
};

export default PersonalPin;
