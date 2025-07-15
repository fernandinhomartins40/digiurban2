module.exports = {
  apps: [{
    name: 'digiurban-minimal',
    script: 'dist-server/server/index.js',
    cwd: '/opt/digiurban/current',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    error_file: '/opt/digiurban/logs/error.log',
    out_file: '/opt/digiurban/logs/out.log',
    log_file: '/opt/digiurban/logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    listen_timeout: 3000,
    kill_timeout: 5000,
    shutdown_with_message: true,
    wait_ready: true
  }],

  deploy: {
    production: {
      user: 'root',
      host: ['$VPS_HOST'],
      ref: 'origin/main',
      repo: 'https://github.com/fernandinhomartins040/digiurban2.git',
      path: '/opt/digiurban',
      'post-deploy': 'npm ci --silent && npm run build && mkdir -p dist-server/public && cp -r dist/* dist-server/public/ && pm2 reload ecosystem.config.js --env production'
    }
  }
}; 