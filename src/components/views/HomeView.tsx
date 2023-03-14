import React from "react";
import { SwapBox } from "components/organisms";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "lib/constants";
import { useKyc, useVerida } from "lib/hooks";

export const HomeView: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { isConnected } = useVerida();
  const { kycChecked } = useKyc();

  const handleKYCAlertMoreClick = () => {
    navigate(routes.profile);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 2,
      }}
    >
      {isConnected && !kycChecked && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{ alignSelf: "stretch" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleKYCAlertMoreClick}
            >
              More
            </Button>
          }
        >
          Provide a KYC to unlock your swap volume.
        </Alert>
      )}
      <SwapBox />
      <Typography variant="caption">
        This application is not functioning and meant for Verida demo purpose
        only
      </Typography>
    </Box>
  );
};
