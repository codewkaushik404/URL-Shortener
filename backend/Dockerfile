FROM node:slim

WORKDIR app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . .

RUN npm run db:generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]