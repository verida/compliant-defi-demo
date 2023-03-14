import { useCallback, useContext, useEffect, useState } from "react";
import { WebUserProfile } from "@verida/web-helpers";
import { VeridaContext } from "../contexts";

export const useVerida = () => {
  const { webUserInstanceRef } = useContext(VeridaContext);
  const webUserInstance = webUserInstanceRef.current;

  const [isConnected, setIsConnected] = useState(false);
  const [did, setDid] = useState<string>();
  const [profile, setProfile] = useState<WebUserProfile>();

  const updateStates = useCallback(() => {
    webUserInstance
      .isConnected()
      .then(setIsConnected)
      .catch(() => {
        setIsConnected(false);
      });
    webUserInstance
      .getDid()
      .then(setDid)
      .catch(() => {
        setDid(undefined);
      });
    webUserInstance
      .getPublicProfile()
      .then(setProfile)
      .catch(() => {
        setProfile(undefined);
      });
  }, [webUserInstance]);

  const veridaEventListener = useCallback(() => {
    void updateStates();
  }, [updateStates]);

  useEffect(() => {
    updateStates();
    webUserInstance.addListener("connected", veridaEventListener);
    webUserInstance.addListener("profileChanged", veridaEventListener);
    webUserInstance.addListener("disconnected", veridaEventListener);
    return () => {
      webUserInstance.removeListener("connected", veridaEventListener);
      webUserInstance.removeListener("profileChanged", veridaEventListener);
      webUserInstance.removeListener("disconnected", veridaEventListener);
    };
  }, [webUserInstance, updateStates, veridaEventListener]);

  const connect = useCallback(() => {
    return webUserInstanceRef.current.connect();
  }, [webUserInstanceRef]);

  const disconnect = useCallback(() => {
    return webUserInstanceRef.current.disconnect();
  }, [webUserInstanceRef]);

  return {
    isConnected,
    did,
    profile,
    connect,
    disconnect,
    webUserInstanceRef,
  };
};
