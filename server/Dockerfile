FROM mhart/alpine-node:6


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm config list
RUN npm config set registry "https://registry.npm.taobao.org/"
RUN npm config list

RUN npm install
# Bundle app source
COPY . /usr/src/app

RUN npm run compile

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
CMD [ "sh", "run.sh" ]
