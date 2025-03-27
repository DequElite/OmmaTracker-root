FROM node AS build

WORKDIR /omma
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx

COPY ../nginx.conf /etc/nginx/nginx.conf
COPY --from=build /omma/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]