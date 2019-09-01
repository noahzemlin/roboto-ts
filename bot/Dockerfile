FROM node:10-alpine

WORKDIR /opt/roboto

# Install deps
COPY package.json .
COPY package-lock.json .
RUN apk add --no-cache bash git make gcc g++ python ffmpeg && \
  npm install --no-optional && \
  apk del bash git make gcc g++ python

# Build
COPY src src
COPY tsconfig.json .
COPY tslint.json .
RUN npm run build

# Run
CMD npm run start