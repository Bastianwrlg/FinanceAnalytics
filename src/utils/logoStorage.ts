import { useState, useEffect } from 'react';

export interface LogoConfig {
  customLogoUrl: string | null;
  mode: 'official' | 'custom';
  bgColor: 'black' | 'transparent' | 'dark' | 'white';
  padding: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'poda_logo_config';
const EVENT_NAME = 'poda_logo_updated';

const DEFAULT_CONFIG: LogoConfig = {
  customLogoUrl: null,
  mode: 'official',
  bgColor: 'black',
  padding: 2,
  lastUpdated: new Date().toISOString(),
};

export function getLogoConfig(): LogoConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to read logo config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveLogoConfig(config: Partial<LogoConfig>): LogoConfig {
  const current = getLogoConfig();
  const updated: LogoConfig = {
    ...current,
    ...config,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (e) {
    console.error('Failed to save logo config:', e);
  }
  return updated;
}

export function resetLogoToDefault(): LogoConfig {
  const resetConfig: LogoConfig = {
    customLogoUrl: null,
    mode: 'official',
    bgColor: 'black',
    padding: 2,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetConfig));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: resetConfig }));
  } catch (e) {
    console.error('Failed to reset logo:', e);
  }
  return resetConfig;
}

export function useLogoConfig() {
  const [config, setConfig] = useState<LogoConfig>(getLogoConfig);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<LogoConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getLogoConfig());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        setConfig(getLogoConfig());
      }
    });

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  return config;
}
