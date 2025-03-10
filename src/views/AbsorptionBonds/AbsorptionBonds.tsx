import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";
import { QueryClient, QueryClientProvider } from "react-query";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";

import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import { useWeb3Context } from "src/hooks/web3Context";
import { allBondsMap } from "src/helpers/AllBonds";
import { useAppSelector } from "src/hooks";
import MigrationBanner from "src/components/MigrationMessage";
import ClaimAbsorption from "./ClaimAbsorption";
import { BondDataCard, BondTableData } from "../ChooseBond/BondRow";

import "../ChooseBond/choosebond.scss";

function AbsorptionBonds() {
  const { chainID } = useWeb3Context();
  const { absorptionBonds } = useBonds(chainID);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const wsOhmPrice = useAppSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const isAppLoading: boolean = useAppSelector(state => state.app.loading);

  return (
    <div id="choose-bond-view">
      {/* <Paper className="ohm-card" style={{ padding: 0, marginBottom: "1rem", border: "none" }}>
        <MigrationBanner />
      </Paper> */}
      <Grid item xs={12}>
        <Paper className="ohm-card full-width">
          <Box className="card-header">
            <Typography variant="h5" data-testid="t">
              <Trans>Absorption Information</Trans>
            </Typography>
          </Box>
          <Typography>
            Exodia is absorbing the treasury of Wenwagmi DAO. Wenwagmi DAO users can swap WEN for wsEXOD by purchasing a
            bond below. The value of wsEXOD received in return is proportional to your claim on the Wenwagmi DAO's
            treasury plus 5%.
          </Typography>
          <br />
          <br />
          <Typography>
            The bond received is staked on purchase in the form of wsEXOD and vests linearly over 14 days. Users may
            claim their vested wsEXOD during this time.
          </Typography>

          <br />
          <br />
          <Typography>
            Users have until {moment.unix(absorptionBonds[0]?.validUntil).format("ll")} to bond their WEN for wsEXOD.
          </Typography>
        </Paper>
      </Grid>
      <ClaimAbsorption />
      <BondContainer>
        <Zoom in={true}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="ohm-card full-width">
                <Box className="card-header">
                  <Typography variant="h5" data-testid="t">
                    <Trans>Absorption Bonds</Trans>
                  </Typography>
                </Box>

                <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>wsEXOD Price</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {isAppLoading ? <Skeleton width="100px" /> : formatCurrency(Number(wsOhmPrice), 2)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Absorption End Date</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {isAppLoading ? <Skeleton /> : moment.unix(absorptionBonds[0]?.validUntil).format("ll")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {!isSmallScreen && (
                  <Grid container item>
                    <TableContainer>
                      <Table aria-label="Available bonds">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">
                              <Trans>Bond</Trans>
                            </TableCell>
                            <TableCell align="left">
                              <Trans>Price (1 wsEXOD)</Trans>
                            </TableCell>
                            <TableCell align="right">
                              <Trans>Purchased</Trans>
                            </TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {absorptionBonds.map(bond => (
                            <BondTableData key={bond.name} bond={bond} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Paper>
            </Grid>

            {isSmallScreen && (
              <Box className="ohm-card-container" marginY="8px" width="100%">
                <Grid container item spacing={3}>
                  {absorptionBonds.map(bond => (
                    <Grid item xs={12} key={bond.name}>
                      <BondDataCard key={bond.name} bond={bond} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Zoom>
      </BondContainer>
    </div>
  );
}

const BondContainer = styled.div`
  max-width: 833px;
  width: 100%;
  padding: 24px 0px;
  z-index: 1;
`;

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <AbsorptionBonds />
  </QueryClientProvider>
);
