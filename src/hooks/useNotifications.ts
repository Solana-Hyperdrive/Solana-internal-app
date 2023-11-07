import axios from 'axios';
import { useQuery } from 'react-query';
import useIsLoggedIn from './useIsLoggedIn';

export default function useNotifications() {
  const { data: user } = useIsLoggedIn();

  const userId = user?.data?.uid;

  const { isLoading, isError, data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () =>
      axios.get(
        `https://ledger.flitchcoin.com/prev/notification?start=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      ),
    enabled: !!userId,
    refetchInterval: 30 * 1000
  });

  return { data, isError, isLoading };
}
