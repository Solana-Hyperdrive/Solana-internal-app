import useAlias from '@/hooks/useAlias';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  LinearProgress,
  styled
} from '@mui/material';
import { formatDistance, subDays } from 'date-fns';
import Text from 'src/components/Text';
import AddAlias from '@/content/Dashboards/AddAlias';

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
    border: ${theme.colors.alpha.white[100]} solid 2px;
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        height: 10px;
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }
`
);

function AliasOverview() {
  const theme = useTheme();

  const { data, isLoading } = useAlias();

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        {data.data.map((alias) => (
          <Box key={alias.uuid}>
            <Box display="flex" alignItems="center" pb={3}>
              <Box
                sx={{
                  ml: 1.5
                }}
              >
                <Typography variant="h4" noWrap gutterBottom>
                  {alias.alias}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  {alias.sol_wallet}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <AddAlias />
      </Grid>
    </Grid>
  );
}

export default AliasOverview;
