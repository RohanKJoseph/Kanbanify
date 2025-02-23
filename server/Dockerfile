FROM node:18-alpine3.20

WORKDIR /app

COPY . .

RUN npm install
    

CMD ["sh", "-c", "npm run db:deploy && npm start"]