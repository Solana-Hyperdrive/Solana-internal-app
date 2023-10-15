import axios from 'axios';
import { useQuery } from 'react-query';

export default function useAlias() {
  const { isError, isLoading, data } = useQuery(['alias'], async () =>
    axios.get(`https://ledger.flitchcoin.com/alias`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
  );

  return { data, isError, isLoading };
}
