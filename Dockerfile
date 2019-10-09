FROM node:10

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/npm", "start"]