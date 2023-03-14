import { KycContext } from "lib/contexts";
import { useContext } from "react";

export const useKyc = () => {
  return useContext(KycContext);
};
