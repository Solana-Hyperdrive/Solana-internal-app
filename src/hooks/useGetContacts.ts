import axios from 'axios';
import { useQuery } from 'react-query';
import useIsLoggedIn from './useIsLoggedIn';

export default function useGetContacts() {
  const { data: me } = useIsLoggedIn();

  const { data, isLoading } = useQuery(
    ['contacts'],
    async () =>
      axios.get(
        `https://ledger.flitchcoin.com/contact?my_uid=${me?.data?.uid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      ),
    {
      enabled: !!me?.data?.uid,
      staleTime: Infinity
    }
  );

  return { data, isLoading };
}
