module.exports = {
  apps: [{ name: "apple-product-tracker", script: "./server/dist/index.js" }],
  deploy: {
    production: {
      user: "ubuntu",
      host: "ec2-3-14-206-30.us-east-2.compute.amazonaws.com",
      key: "./AWS_Login/apple-product-tracker.pem",
      ref: "origin/main",
      repo: "https://github.com/jamesh48/apple-product-availability-tracker.git",
      path: "/home/ubuntu/apple-product-availability-tracker",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js",
    },
  },
};
