FROM node:22

WORKDIR /app

COPY ./frontend/web/package*.json ./frontend/web/pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY ./frontend/web .
RUN pnpm run build

CMD ["pnpm", "run", "start"]