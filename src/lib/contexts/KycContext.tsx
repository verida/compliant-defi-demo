import React, { useCallback, useState } from "react";
import { config } from "config";
import { useVerida } from "lib/hooks";

type KycContextType = {
  kycChecked: boolean;
  isWaitingKYCRequest: boolean;
  sendKYCRequest: () => Promise<void>;
  resetKYC: () => void;
};

export const KycContext = React.createContext<KycContextType>({
  kycChecked: false,
  isWaitingKYCRequest: false,
  sendKYCRequest: () => Promise.resolve(),
  resetKYC: () => {},
});

interface KycProviderProps {
  children?: React.ReactNode;
}

export const KycProvider: React.FunctionComponent<KycProviderProps> = (
  props
) => {
  const [isWaitingKYCRequest, setWaitingKYCRequest] = useState(false);
  const [kycChecked, setKYCChecked] = useState(false);

  const { did, webUserInstanceRef } = useVerida();

  const sendKYCRequest = useCallback(async () => {
    console.debug(`sendKYCRequest`);
    const context = await webUserInstanceRef.current.getContext();
    if (!context || !did || !config.kycVCSchemaURL) {
      // TODO Handle these cases
      return;
    }
    console.debug("Preparing KYC request");
    setWaitingKYCRequest(true);

    const messaging = await context.getMessaging();

    void messaging.onMessage((message: string) => {
      console.debug("message received from Verida", message);
      setWaitingKYCRequest(false);

      // TODO: Verify KYC VC

      setKYCChecked(true);
    });

    const message = "Please share a KYC credential";
    const messageType = "inbox/type/dataRequest";

    const messageData = {
      requestSchema: config.kycVCSchemaURL,
      filter: {},
      userSelect: true,
    };

    await messaging.send(did, messageType, messageData, message, {
      recipientContextName: "Verida: Vault",
      did,
    });
    console.debug("KYC request sent");
  }, [did, webUserInstanceRef]);

  const resetKYC = useCallback(() => {
    setWaitingKYCRequest(false);
    setKYCChecked(false);
  }, []);

  const value: KycContextType = {
    isWaitingKYCRequest,
    kycChecked,
    sendKYCRequest,
    resetKYC,
  };

  return (
    <KycContext.Provider value={value}>{props.children}</KycContext.Provider>
  );
};
