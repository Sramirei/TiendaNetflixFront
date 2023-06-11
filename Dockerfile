# Utiliza una imagen base de Node.js
FROM node:18.15

# Establece el directorio de trabajo en el contenedor
WORKDIR /front

# Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente de la aplicación al directorio de trabajo
COPY . .

# Construye la aplicación de React en modo de producción
RUN npm run build

# Instala el servidor web estático de producción
RUN npm install -g serve

# Expone el puerto en el que el servidor web estará escuchando
EXPOSE 3000

# Comando para ejecutar el servidor web cuando el contenedor se inicia
CMD [ "serve", "-s", "build" ]
