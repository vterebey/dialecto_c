FROM node:18 AS build
#
WORKDIR /app
#
## Копируем зависимости
COPY package.json package-lock.json ./
##
RUN npm install
#
## Копируем исходный код
COPY . .
#
## Собираем проект
RUN npm run build
#
VOLUME /app/build
#
#FROM nginx:alpine
#
## Копируем собранные файлы из предыдущего этапа в папку Nginx
#COPY --from=build /app/build /usr/share/nginx/html/static
#
## Открываем порт 80 для Nginx
#EXPOSE 80
#
## Запускаем Nginx
#CMD ["nginx", "-g", "daemon off;"]