module.exports = {
  apps: [
    {
      name: 'nestjs-sample',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        APP_NAME: 'nestjs-api',
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
  deploy: {
    production: {
      key: 'bin/lucas.pem',
      user: 'root',
      host: '134.209.170.246',
      ref: 'origin/master',
      repo: 'git@gitlab.com:lucasffm/nestjs-api-template.git',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      path: '/www/nestjs-api',
      'pre-deploy': 'rm yarn.lock || true &&  rm package-lock.json || true',
      'post-deploy':
        'env && node --version && npm config set scripts-prepend-node-path true && > .env && yarn run make:env && yarn install && yarn run build && yarn run migration:run && pm2 startOrRestart ecosystem.json --env production',
    },
  },
};
