import React from "react";
import { ThemesProvider } from "./ThemesContext";
import { KycProvider } from "./KycContext";
import { VeridaProvider } from "./VeridaContext";

type Props = {
  children?: React.ReactNode;
};

export const AppContextProvider: React.FunctionComponent<Props> = (props) => {
  return (
    <VeridaProvider>
      <KycProvider>
        <ThemesProvider>{props.children}</ThemesProvider>
      </KycProvider>
    </VeridaProvider>
  );
};
