# Base Stage
FROM node:20.17.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i pnpm --g

# Dev stage
FROM base AS dev
RUN pnpm i
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Test stage
FROM dev AS test
RUN pnpm run lint && pnpm run format-check

FROM test as build 
RUN pnpm run build

# Production stage
FROM base AS production
RUN pnpm prune --prod
RUN pnpm i --prod
RUN pnpm i -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]