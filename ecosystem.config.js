// Target server hostname or IP address
const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST
  ? process.env.TARGET_SERVER_HOST.trim()
  : '';
// Target server username
const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER
  ? process.env.TARGET_SERVER_USER.trim()
  : '';
// Target server application path
const TARGET_SERVER_APP_PATH = `/www/${process.env.APP_NAME}`;
// Your repository
const REPO = 'git@gitlab.com:lucasffm/nestjs-api-template.git';

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'nestjs-sample',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        APP_NAME: 'Nestjs Boilerplate',
        NODE_ENV: 'production',
        PORT: 4545,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'postgres',
        DB_NAME: 'postgres',
        JWT_SECRET: 'as7d9a8sd79as8d7as9d',
        MAIL_USER: '12f88fb18d4e38',
        MAIL_PASS: 'cf27a88d3022f9',
        MAIL_HOST: 'smtp.mailtrap.io',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: TARGET_SERVER_USER,
      host: TARGET_SERVER_HOST,
      ref: 'origin/master',
      repo: REPO,
      ssh_options: 'StrictHostKeyChecking=no',
      path: TARGET_SERVER_APP_PATH,
      'pre-deploy': `rm yarn.lock || true &&  rm package-lock.json || true && echo ${TARGET_SERVER_HOST}`,
      'post-deploy':
        'env && node --version && npm config set scripts-prepend-node-path true && > .env && yarn run make:env && yarn install && yarn run build && yarn run migration:run && pm2 startOrRestart ecosystem.json --env production',
    },
  },
};
