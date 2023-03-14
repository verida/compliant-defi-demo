import React, { useRef } from "react";
import { WebUser } from "@verida/web-helpers";
import { config } from "config";

if (!config.veridaContextName) {
  throw new Error("Verida Context Name must be defined");
}

const webUserInstance = new WebUser({
  clientConfig: {
    environment: config.veridaEnv,
  },
  contextConfig: {
    name: config.veridaContextName,
  },
  accountConfig: {
    request: {
      logoUrl: config.veridaLogoUrl,
    },
  },
});

type VeridaContextType = {
  webUserInstanceRef: React.MutableRefObject<WebUser>;
};

export const VeridaContext = React.createContext<VeridaContextType>({
  webUserInstanceRef: { current: webUserInstance },
});

interface VeridaProviderProps {
  children?: React.ReactNode;
}

export const VeridaProvider: React.FunctionComponent<VeridaProviderProps> = (
  props
) => {
  const webUserInstanceRef = useRef(webUserInstance);

  return (
    <VeridaContext.Provider
      value={{
        webUserInstanceRef,
      }}
    >
      {props.children}
    </VeridaContext.Provider>
  );
};
