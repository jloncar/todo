Node is used across the stack. `nvm use` in root folder to switch to appropriate node version.

Docker & docker compose are required

- frontend: react app
- backend: nodejs app, websocket.io wrapper around redis pubsub
- redis: todo store & pubsub
- wordpress: mount endpoint for wordpress installation files
- todo-block: wordpress gutenberg block
- todo-protocol: communication npm package shared across different projects

Real Time Socket communication