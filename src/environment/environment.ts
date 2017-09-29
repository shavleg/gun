// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
     apiServer: 'https://api.fanzone.me',
    // imageServer: 'http://vix.avtorebi.com:8080'
    imageServer: 'https://cdn.fanzone.me'
  };
  
  /*export class environment  {
    public production: false;
    public apiServer: 'https://api.fanzone.me';
    // imageServer: 'http://vix.avtorebi.com:8080'
    public imageServer: 'https://cdn.fanzone.me';
  }*/