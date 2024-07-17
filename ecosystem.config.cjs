module.exports = {
  apps: [{
    name: 'chat-app',
    script: 'app.js',
    exec_mode: 'cluster',
    instances: 2,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    merge_logs: true,
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    env: {
      NODE_ENV: 'production',
    },
  }],
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
