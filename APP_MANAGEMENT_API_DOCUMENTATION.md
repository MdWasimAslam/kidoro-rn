# 🚀 App Management & Remote Configuration API Specification

> **Document Version**: `1.0.0`  
> **Last Updated**: July 23, 2026  
> **Target Client**: React Native Expo Mobile App (`Kidora`) & Next.js Admin Backend  

---

## 📌 Executive Overview

The **App Management System** delivers server-driven Remote Configuration, Over-the-Air (OTA) theme styling, dynamic feature toggling, version enforcement, and emergency maintenance mode control.

---

## 🌐 API Endpoints & Access Methods

### 1. REST API Endpoint (*Next.js Backend*)

| HTTP Method | Endpoint Path | Description | Access Level | Response Format |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/app-config` | Fetch active global application configuration payload | Public | `JSON` |
| **`PUT`** | `/api/app-config` | Update application configuration parameters | Admin / Public dev | `JSON` |

#### Base URL Setup
- **Development (Android Emulator)**: `http://10.0.2.2:3000/api/app-config`
- **Development (Physical Device)**: `http://<YOUR_LOCAL_IP>:3000/api/app-config`
- **Production**: `https://<YOUR_NEXTJS_DOMAIN>/api/app-config`

---

### 2. Supabase Direct Database Access (*Mobile Client Fallback*)

When accessing Supabase directly via REST or `@supabase/supabase-js`:

- **Table Name**: `public.app_config`
- **Row Identifier**: `id = 1`
- **Query**: `SELECT config FROM app_config WHERE id = 1`

---

## 🛠️ Complete Data Schema & Features Breakdown

Below is the full breakdown of all **5 core configuration sections**:

### 🎨 1. Theme Configuration (`theme`)
Controls the Over-the-Air visual identity and default theme mode of the mobile app.

| Key | Type | Example / Values | Description & Usage |
| :--- | :--- | :--- | :--- |
| `primaryColor` | `string` | `#EF4444` | Primary brand color for buttons, active navigation indicators, and main highlights |
| `secondaryColor` | `string` | `#F59E0B` | Secondary color for reward badges, star icons, and secondary buttons |
| `accentColor` | `string` | `#3B82F6` | Accent color for link texts, subtle card borders, and highlight tags |
| `defaultTheme` | `string` | `"light"` \| `"dark"` \| `"system"` | Enforces initial app color scheme for new user installs |

---

### 🏠 2. Home Screen Layout & Widgets (`home`)
Server-driven visibility control for widgets and promotional banners on the child's feed.

| Key | Type | Default | Description & Usage |
| :--- | :--- | :--- | :--- |
| `showBanner` | `boolean` | `true` | Show or hide top promotional/announcement hero banner |
| `bannerTitle` | `string` | `"Welcome to Kidoro"` | Headline string rendered inside top hero promotional banner |
| `showFeatured` | `boolean` | `true` | Show or hide the "Featured Content" horizontal video slider |
| `showContinueWatching` | `boolean` | `true` | Show or hide the "Continue Watching" progress row |
| `showCategories` | `boolean` | `true` | Show or hide category selector chips grid on the home feed |

---

### ⚡ 3. Feature Flags & Capabilities (`features`)
Instantly toggle major application modules on or off without app store releases.

| Key | Type | Default | Description & Usage |
| :--- | :--- | :--- | :--- |
| `enableSearch` | `boolean` | `true` | Enables or hides global video search icon & search screen |
| `enableNotifications` | `boolean` | `true` | Enables or disables push notifications and notification inbox |
| `enableDownloads` | `boolean` | `true` | Enables or disables offline video downloading & local video cache |
| `enableDarkMode` | `boolean` | `true` | Enables or disables manual dark mode toggle in app settings |

---

### 📲 4. Version Control & Force Update (`version`)
Enforces app version compatibility checks to prevent broken API calls on legacy clients.

| Key | Type | Example | Description & Usage |
| :--- | :--- | :--- | :--- |
| `currentVersion` | `string` | `"1.0.0"` | Latest available version in the App Store / Play Store |
| `minSupportedVersion` | `string` | `"1.0.0"` | Oldest client version allowed to access backend services |
| `forceUpdate` | `boolean` | `false` | When `true` and client version `< minSupportedVersion`, displays un-dismissible update modal |
| `forceUpdateMessage` | `string` | `"Please update..."` | Message displayed on forced update screen pointing to store links |

---

### 🛠️ 5. Maintenance Mode (`maintenance`)
Puts mobile client in emergency maintenance mode during system upgrades.

| Key | Type | Default | Description & Usage |
| :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `false` | When `true`, redirects all app navigation to a full-screen maintenance message |
| `message` | `string` | `"We're making things better..."` | Text displayed to users during active maintenance |

---

## 📄 Complete Sample JSON Response

```json
{
  "theme": {
    "primaryColor": "#EF4444",
    "secondaryColor": "#F59E0B",
    "accentColor": "#3B82F6",
    "defaultTheme": "system"
  },
  "home": {
    "showBanner": true,
    "bannerTitle": "Welcome to Kidoro",
    "showFeatured": true,
    "showContinueWatching": true,
    "showCategories": true
  },
  "features": {
    "enableSearch": true,
    "enableNotifications": true,
    "enableDownloads": true,
    "enableDarkMode": true
  },
  "version": {
    "currentVersion": "1.0.0",
    "minSupportedVersion": "1.0.0",
    "forceUpdate": false,
    "forceUpdateMessage": "Please update to the latest version"
  },
  "maintenance": {
    "enabled": false,
    "message": "We're making things better. Check back soon."
  }
}
```

---

## 📱 React Native Implementation Example (`TypeScript`)

### 1. Configuration Service (`src/services/configService.ts`)

```typescript
import { BASE_URL, supabaseRest } from './api';

export interface AppConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    defaultTheme: 'light' | 'dark' | 'system';
  };
  home: {
    showBanner: boolean;
    bannerTitle: string;
    showFeatured: boolean;
    showContinueWatching: boolean;
    showCategories: boolean;
  };
  features: {
    enableSearch: boolean;
    enableNotifications: boolean;
    enableDownloads: boolean;
    enableDarkMode: boolean;
  };
  version: {
    currentVersion: string;
    minSupportedVersion: string;
    forceUpdate: boolean;
    forceUpdateMessage: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  theme: {
    primaryColor: '#EF4444',
    secondaryColor: '#F59E0B',
    accentColor: '#3B82F6',
    defaultTheme: 'system',
  },
  home: {
    showBanner: true,
    bannerTitle: 'Welcome to Kidoro',
    showFeatured: true,
    showContinueWatching: true,
    showCategories: true,
  },
  features: {
    enableSearch: true,
    enableNotifications: true,
    enableDownloads: true,
    enableDarkMode: true,
  },
  version: {
    currentVersion: '1.0.0',
    minSupportedVersion: '1.0.0',
    forceUpdate: false,
    forceUpdateMessage: 'Please update to the latest version',
  },
  maintenance: {
    enabled: false,
    message: "We're making things better. Check back soon.",
  },
};

export async function fetchAppConfig(): Promise<AppConfig> {
  try {
    const response = await fetch(`${BASE_URL}/api/app-config`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('[configService] REST fetch failed, falling back to Supabase REST:', error);
  }

  // Fallback: Direct Supabase REST Query
  try {
    const res = await supabaseRest('app_config', { select: 'config', id: 'eq.1' });
    if (res && res[0]?.config) {
      return res[0].config;
    }
  } catch (e) {
    console.error('[configService] Supabase fallback error:', e);
  }

  return DEFAULT_APP_CONFIG;
}
```

### 2. React Context & Custom Hook (`src/context/AppConfigContext.tsx`)

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppConfig, DEFAULT_APP_CONFIG, fetchAppConfig } from '../services/configService';

interface AppConfigContextType {
  config: AppConfig;
  loading: boolean;
  refetchConfig: () => Promise<void>;
}

const AppConfigContext = createContext<AppConfigContextType>({
  config: DEFAULT_APP_CONFIG,
  loading: true,
  refetchConfig: async () => {},
});

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchAppConfig();
    setConfig(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, loading, refetchConfig: load }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => useContext(AppConfigContext);
```

### 3. Usage in Screen Component (`src/screens/HomeScreen.js`)

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAppConfig } from '../context/AppConfigContext';

export default function HomeScreen() {
  const { config, loading } = useAppConfig();

  if (loading) return <View><Text>Loading config...</Text></View>;

  // Check Maintenance Mode
  if (config.maintenance.enabled) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Under Maintenance</Text>
        <Text style={{ textAlign: 'center', marginTop: 10 }}>{config.maintenance.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Dynamic Hero Banner */}
      {config.home.showBanner && (
        <View style={{ padding: 16, backgroundColor: config.theme.primaryColor }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {config.home.bannerTitle}
          </Text>
        </View>
      )}

      {/* Dynamic Categories Row */}
      {config.home.showCategories && (
        <View>{/* Render Categories Component */}</View>
      )}

      {/* Dynamic Featured Video Row */}
      {config.home.showFeatured && (
        <View>{/* Render Featured Slider */}</View>
      )}
    </View>
  );
}
```
