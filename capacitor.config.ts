import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.cellsight.mobile',
  appName: 'CellSight AI',
  webDir: 'out',
  server: {
    url: 'http://192.168.29.243:3000',
    cleartext: true
  }
};

export default config;
