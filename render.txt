services:
  - type: web
    name: saxo-proxy-clean
    env: node
    region: virginia
    plan: free
    rootDir: .
    buildCommand: "npm install"
    startCommand: "node server.js"
    autoDeploy: true
