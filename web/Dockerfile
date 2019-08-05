FROM node:10-alpine

WORKDIR /opt/roboto

# Install deps
COPY package.json .
RUN npm install --no-optional

# Build
COPY src src
COPY public public
COPY tsconfig.json .
RUN npm run build

# Run
CMD npm run start