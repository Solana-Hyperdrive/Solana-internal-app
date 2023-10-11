import axios from 'axios';
import { useRouter } from 'next/router';

export default function useIsLoggedIn() {
  const router = useRouter();

  const isLoggedIn = async () => {
    try {
      await axios.get(`https://ledger.flitchcoin.com/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      router.push('/dashboards/tasks');
    } catch (e) {
      console.log('unauth user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/');
    }
  };

  return { isLoggedIn };
}
