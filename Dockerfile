# base image
FROM node:11-alpine

# set working directory
RUN mkdir -p ./src/cc_chat/client
WORKDIR ./src/cc_chat/client

# Install app dependencies
COPY package*.json ./
RUN npm install

# add app
COPY . .

# start app
EXPOSE 80
CMD [ "npm", "start" ]
