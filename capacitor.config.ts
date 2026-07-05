import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ttguide.app',
  appName: "Time Traveler's Guide",
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0a0a0a',
    allowMixedContent: true,
  },
};

export default config;
