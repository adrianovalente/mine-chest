FROM timbru31/java-node

RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 25565
EXPOSE 8080

CMD [ "node", "src/index.js" ]
