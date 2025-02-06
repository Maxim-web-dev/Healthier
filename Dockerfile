# Используем официальный образ Node.js
FROM node:20

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN yarn

# Копируем исходный код приложения
COPY . .

# Запускаем приложение
CMD ["yarn", "start"]