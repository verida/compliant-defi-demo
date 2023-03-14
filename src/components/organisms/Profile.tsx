import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Link,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { EnvironmentType } from "@verida/types";
import { useKyc, useVerida } from "lib/hooks";
import { ConnectVeridaButton } from "components/atoms";
import { config } from "config";

export const Profile: React.FunctionComponent = () => {
  const { connect, disconnect, profile, isConnected, did } = useVerida();
  const { kycChecked, isWaitingKYCRequest, sendKYCRequest, resetKYC } =
    useKyc();
  const [isConnecting, setIsConnecting] = useState(false);
  const [kycDialogOpen, setKYCDialogOpen] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleProvideKYCClick = async () => {
    setKYCDialogOpen(true);
    await sendKYCRequest();
  };

  const closeKYCDialog = () => {
    setKYCDialogOpen(false);
  };

  const handlePerformKYCClick = () => {
    const url =
      config.kycProviderFormURL && did
        ? `${config.kycProviderFormURL}?veridaDID=${encodeURI(did)}`
        : "https://finclusive.com/";
    window.open(url, "_blank");
    setKYCDialogOpen(false);
  };

  const handleResetKYCClick = () => {
    resetKYC();
  };

  const salutation = (
    <>
      Hi <strong>{profile?.name}</strong>
    </>
  );

  const connectedMessage = (
    <>
      You are connected with your <strong>Verida</strong> identity
    </>
  );

  const privacyMessage = (
    <>
      We respect your privacy and your personal information. To provide you with
      the best experience, we partnered with <strong>Verida</strong>, a protocol
      allowing users to control their identity and their data. Check{" "}
      <Link
        href="https://www.verida.io"
        underline="hover"
        target="_blank"
        rel="noopener"
      >
        verida.io
      </Link>
      .
    </>
  );

  const notConnectedEnvMessage = (
    <>
      You will be using the <strong>{config.veridaEnv}</strong> environment
    </>
  );

  const connectedEnvMessage = (
    <>
      You are using the <strong>{config.veridaEnv}</strong> environment
    </>
  );

  const disconnectButtonLabel = <>Disconnect</>;

  const veridaEnvironmentAlert =
    config.veridaEnv === EnvironmentType.MAINNET ? null : (
      <Alert
        variant="outlined"
        severity="warning"
        sx={{ alignSelf: "stretch" }}
      >
        {isConnected ? connectedEnvMessage : notConnectedEnvMessage}
      </Alert>
    );

  const veridaMissingKYCAlert = (
    <Alert variant="outlined" severity="warning" sx={{ alignSelf: "stretch" }}>
      Provide a KYC to unlock you swap volume.
    </Alert>
  );

  const veridaProvidedKYCAlert = (
    <Alert
      variant="outlined"
      severity="success"
      sx={{ alignSelf: "stretch" }}
      action={
        <Button color="inherit" size="small" onClick={handleResetKYCClick}>
          Reset
        </Button>
      }
    >
      Your KYC allows you to swap with no limits
    </Alert>
  );

  return (
    <Box
      sx={{
        px: 3,
        pb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Avatar
        alt={profile?.name}
        src={profile?.avatarUri}
        sx={{ width: 128, height: 128 }}
      ></Avatar>
      <Typography component="h3" variant="h5">
        {salutation}
      </Typography>
      {isConnected ? (
        <>
          {kycChecked ? (
            <>{veridaProvidedKYCAlert}</>
          ) : (
            <>
              {veridaMissingKYCAlert}
              <Button
                onClick={() => void handleProvideKYCClick()}
                disabled={isWaitingKYCRequest}
              >
                {isWaitingKYCRequest ? `Waiting for KYC...` : `Provide KYC`}
              </Button>
              <Dialog open={kycDialogOpen} onClose={closeKYCDialog}>
                <DialogTitle>KYC Request</DialogTitle>
                <DialogContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography>
                      A request has been sent to your{" "}
                      <strong>Verida Vault</strong> to share a KYC credential.
                    </Typography>
                    <Typography>
                      If you don't have a KYC credential, you can perform one
                      with our partner FinClusive.
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePerformKYCClick}>Perform KYC</Button>
                  <Button onClick={closeKYCDialog}>Close</Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          <Box sx={{ alignSelf: "stretch" }}>
            <Typography>{connectedMessage}</Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {did}
            </Typography>
          </Box>

          {/* {veridaEnvironmentAlert} */}
          <Button variant="contained" onClick={() => void handleDisconnect()}>
            {disconnectButtonLabel}
          </Button>
        </>
      ) : (
        <>
          {veridaEnvironmentAlert}
          <ConnectVeridaButton
            onClick={() => void handleConnect()}
            isConnecting={isConnecting}
          />
        </>
      )}
      <Typography sx={{ alignSelf: "stretch" }}>{privacyMessage}</Typography>
    </Box>
  );
};
