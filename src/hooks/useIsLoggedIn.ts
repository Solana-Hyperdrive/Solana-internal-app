import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';

export default function useIsLoggedIn(redirect?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      onError: async () => {
        try {
          const response = await axios.get(
            `https://ledger.flitchcoin.com/re-auth?refresh_token=${localStorage.getItem(
              'refreshToken'
            )}`
          );

          const { access_token, refresh_token } = response.data;

          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);

          queryClient.invalidateQueries({ queryKey: ['me'] });
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.push('/');
        }
      }
    }
  );

  return { data, isError, isLoading };
}
