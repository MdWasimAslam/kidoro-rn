import { useState, useEffect } from 'react';
import configService from '../services/config.service';

export function useAppConfig() {
  const [config, setConfig] = useState(() => configService.getConfig());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configService.fetchConfig().then((cfg) => {
      setConfig(cfg);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return { config, loading };
}
