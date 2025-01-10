# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.11.0
ARG PNPM_VERSION=9.15.3

################################################################################
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

################################################################################
FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

################################################################################
FROM base AS final

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

USER node

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.output ./.output

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
