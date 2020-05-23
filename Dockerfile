FROM node:10

WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm run build
COPY . /app
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/npm", "start"]