FROM node:18

COPY package.json package-lock.json /app/

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build

CMD npm run app

#FROM node:18
#
#COPY dist app
#
#COPY package.json package-lock.json app/
#COPY prisma app/prisma
#
#WORKDIR /app
#
#RUN npm install
#
#
#RUN npx prisma generate
#RUN npx prisma migrate dev
#
#CMD npm run app
