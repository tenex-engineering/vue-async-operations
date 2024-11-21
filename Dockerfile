# syntax=docker/dockerfile:1

ARG NODE_VERSION=22
ARG PNPM_VERSION=9

FROM node:${NODE_VERSION}-slim AS node-base

####
FROM node-base AS deps

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app/

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

####
FROM node-base

WORKDIR /app/

RUN chown node:node ./

COPY --chown=node:node ./ ./
COPY --chown=node:node --from=deps /app/node_modules/ ./node_modules/

USER node

CMD ["npm", "run", "dev"]
