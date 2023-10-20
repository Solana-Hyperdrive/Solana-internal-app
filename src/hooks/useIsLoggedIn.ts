import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

export default function useIsLoggedIn(redirect?: string, doRedirect?: boolean) {
  const [enableReAuth, setEnableReAuth] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAccessToken =
    typeof window !== 'undefined'
      ? !!localStorage.getItem('accessToken')
      : false;

  // query is enabled only if there is an accessToken.
  // to enable the query on all other pages (without an access token) we do not pass a redirect param.
  const enabled = !redirect || isAccessToken;

  const { isLoading, isError, data } = useQuery({
    queryKey: ['me'],
    queryFn: async () =>
      axios.get(`https://ledger.flitchcoin.com/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }),
    enabled,
    onSuccess: () => {
      if (redirect && doRedirect) router.push(redirect);
    },
    onError: async () => {
      setEnableReAuth(true);
    }
  });

  useQuery(
    ['re-auth'],
    async () => {
      if (!localStorage.getItem('refreshToken')) throw new Error();

      const response = await axios.get(
        `https://ledger.flitchcoin.com/re-auth?refresh_token=${localStorage.getItem(
          'refreshToken'
        )}`
      );

      const { access_token, refresh_token } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      queryClient.invalidateQueries({ queryKey: ['me'] });
      setEnableReAuth(false);

      return response;
    },
    {
      enabled: enableReAuth,
      onError: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        if (router.asPath !== '/') router.push('/');
      }
    }
  );

  return { data, isError, isLoading };
}
