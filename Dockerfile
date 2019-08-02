FROM node:10-jessie

WORKDIR /opt/roboto

# Install deps
COPY package.json .
RUN npm install --no-optional

# Build
COPY src src
COPY tsconfig.json .
COPY tslint.json .
RUN npm run build

# Run
CMD npm run start