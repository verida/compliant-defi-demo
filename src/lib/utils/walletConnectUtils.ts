/* eslint-disable no-console */
import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
// TODO remove the modal dependency after testing

export const DEFAULT_BRIDGE_URL = "https://bridge.walletconnect.org";
export const DEFAULT_CHAIN_ID = "eip155:1";

export const initWalletConnect = async (
  bridgeURL = DEFAULT_BRIDGE_URL
): Promise<WalletConnect> => {
  // Create a connector
  const connector = new WalletConnect({
    bridge: bridgeURL,
    // qrcodeModal: QRCodeModal, // the modal is not required
  });

  // Check if connection is already established
  if (!connector.connected) {
    // create new session
    await connector.createSession();
  }

  // Subscribe to connection events
  connector.on("connect", (error, payload) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("WalletConnect on connect payload:", payload);
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("WalletConnect on session_update payload:", payload);
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("WalletConnect on disconnect payload:", payload);
  });

  return connector;
};
