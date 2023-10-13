import axios from 'axios';
import { useQuery } from 'react-query';
import useIsLoggedIn from './useIsLoggedIn';

export default function useNotifications() {
  const { data: user } = useIsLoggedIn();

  const userId = user?.data?.uid;

  const { isLoading, isError, data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () =>
      axios.post(`https://ledger.flitchcoin.com/rec/msg?uid=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }),
    enabled: !!userId
  });

  return { data, isError, isLoading };
}
