import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import configService from '../services/config.service';

const AppConfigContext = createContext(null);

export function AppConfigProvider({ children }) {
  const [config, setConfig] = useState(() => configService.getConfig());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await configService.fetchConfig();
    setConfig(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const refetchConfig = useCallback(async () => {
    await load();
  }, [load]);

  return (
    <AppConfigContext.Provider value={{ config, loading, refetchConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfigContext() {
  const ctx = useContext(AppConfigContext);
  return ctx || { config: configService.getConfig(), loading: false, refetchConfig: () => {} };
}

export default AppConfigContext;
