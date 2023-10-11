import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function useIsLoggedIn(redirect?: string) {
  const router = useRouter();

  const { isLoading, isError, data } = useQuery(
    ['me'],
    async () =>
      axios.get(`https://ledger.flitchcoin.com/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }),
    {
      onSuccess: () => {
        if (redirect) router.push(redirect);
      },
      onError: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/');
      }
    }
  );

  return { data, isError, isLoading };
}
