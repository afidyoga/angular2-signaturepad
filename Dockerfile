FROM node:16

RUN mkdir -p /home/node

WORKDIR /home/node
COPY ./package.json ./home/node/
COPY ./package-lock.json ./home/node/

RUN yarn install
RUN npm install -g @angular/cli@13.3.11

EXPOSE 3000
