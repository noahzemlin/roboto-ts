FROM node:10-alpine

WORKDIR /opt/roboto

# Install deps
COPY package.json .
COPY package-lock.json .
RUN apk add --no-cache bash git make gcc g++ python && \
  npm install --no-optional && \
  apk del bash git make gcc g++ python

# Build
COPY src src
COPY tsconfig.json .
COPY tslint.json .
RUN npm run build

EXPOSE 8080:8080

# Run
CMD npm run start