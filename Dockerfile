FROM node:20-alpine

RUN apk update && apk add openssl

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install 

COPY . .

COPY .env .env

EXPOSE 3000

RUN chmod +x start.sh

CMD ["./start.sh"]