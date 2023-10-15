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
    enabled: !!userId,
    onSuccess: () => {
      if (localStorage.getItem('notifications') && data?.data) {
        const oldData = JSON.parse(localStorage.getItem('notifications'));
        const newData = [...oldData, ...data?.data];
        localStorage.setItem('notifications', JSON.stringify(newData));
      } else {
        localStorage.setItem(
          'notifications',
          JSON.stringify(data?.data ? data?.data : [])
        );
      }
    }
  });

  return { data, isError, isLoading };
}
