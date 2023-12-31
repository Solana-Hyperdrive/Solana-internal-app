import Label from '@/components/Label';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';

const applyPagination = (allProducts, page: number, limit: number) => {
  return allProducts?.slice(page * limit, page * limit + limit);
};

const AllTransactionsTable = () => {
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();
  const { data: tnxs, isLoading: isTnxsLoading } = useQuery(
    ['tnxs'],
    async () =>
      axios.get('https://ledger.flitchcoin.com/tnx/history?start=0&limit=50', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
  );

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedTnxs = applyPagination(tnxs?.data, page, limit);

  return (
    <Card>
      <CardHeader title="Transactions" />

      <Divider />

      {isTnxsLoading || isMeLoading ? (
        <Skeleton width="100vw" height="50vh" />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Transaction ID</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Amount (USD)</TableCell>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Debit/Credit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTnxs?.map((tnx) => (
                  <TableRow hover key={tnx.uuid}>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tnx.uuid}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tnx.peer ? 'Peer' : null}
                        {tnx.product ? 'Product' : null}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        {tnx.status === 'init' ||
                        tnx.status === 'processing' ? (
                          <Label color="warning">{tnx.status}</Label>
                        ) : null}
                        {tnx.status === 'successful' ? (
                          <Label color="success">{tnx.status}</Label>
                        ) : null}
                        {tnx.status === 'cancelled' ||
                        tnx.status === 'failed' ? (
                          <Label color="error">{tnx.status}</Label>
                        ) : null}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tnx.product ? tnx?.product?.price : null}
                        {tnx.peer ? tnx?.peer?.amt : null}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {formatDistance(tnx.ts * 1000, new Date(), {
                          addSuffix: true
                        })}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tnx.product ? `Spent on ${tnx?.product?.name}` : null}
                        {tnx.peer
                          ? tnx.peer.uid_sender === me.data.uid
                            ? `Sent to ${tnx.peer.rec_uid}`
                            : `Received from ${tnx.peer.uid_sender}`
                          : null}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                      >
                        {tnx.product ? (
                          <Label color="error">Debit</Label>
                        ) : null}
                        {tnx.peer ? (
                          tnx.peer.uid_sender === me.data.uid ? (
                            <Label color="error">Debit</Label>
                          ) : (
                            <Label color="success">Credit</Label>
                          )
                        ) : null}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Filter */}
          <Box p={2}>
            <TablePagination
              component="div"
              count={tnxs?.data?.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25, 30]}
            />
          </Box>
        </>
      )}
    </Card>
  );
};

export default AllTransactionsTable;
