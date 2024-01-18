FROM node:18


COPY package.json package-lock.json ./app/

COPY . ./app/


WORKDIR /app

RUN npm install

RUN npm run build

CMD npm run preview
