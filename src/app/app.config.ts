import { environment } from '../environment/environment';

// const APP_BASE = 'http://10.0.1.5:8080/';
// const IMAGE_SERVER = 'http://10.0.1.5:8182';

const APP_BASE = environment.apiServer;
const IMAGE_SERVER = environment.imageServer;
const API_BASE = APP_BASE + '/api';
const WS_BASE = APP_BASE + '/websocket';
const GLOBAL = window['__VIX_SETTINGS__'] || {};

export class Config {
  env: string;
  dev: any;

  constructor() {
    this.env = 'dev';

    this.dev = {
      appBase: APP_BASE,
      apiBase: API_BASE,
      imageServer: IMAGE_SERVER,
      wsBase: WS_BASE,
      fbLoginUrl: APP_BASE + '/auth/facebook',
      stompDebug: true,
      sharedComponentsDebug: false,

      // Injected Settings
      ...GLOBAL
    };
  }

  public get(name: string) {
    return this[this.env][name];
  }
}
