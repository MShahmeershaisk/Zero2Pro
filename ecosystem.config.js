// PM2 cluster config — uses every CPU core (multi-process Node) and shares
// sessions via the MongoDB session store, so any instance can handle any user.
//
// Usage:
//   pm2 start ecosystem.config.js        # start in cluster mode
//   pm2 reload ecosystem.config.js       # zero-downtime restart
//   pm2 logs                              # view logs
//   pm2 stop ecosystem.config.js         # stop
module.exports = {
  apps: [
    {
      name: "zero-to-pro",
      script: "index.js",
      instances: "max", // one process per CPU core
      exec_mode: "cluster",
      max_memory_restart: "500M", // restart a worker that's leaking memory
      autorestart: true,
      watch: false,
      kill_timeout: 5000,
      listen_timeout: 10000, // give MongoDB/compiler warmup time before PM2 marks it ready
      env: {
        NODE_ENV: "production",
      },
      // Rotate logs so they never grow unbounded
      out_file: "logs/out.log",
      error_file: "logs/error.log",
      merge_logs: true,
      time: true,
    },
  ],
};