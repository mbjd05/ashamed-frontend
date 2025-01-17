FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

LABEL org.opencontainers.image.source="https://github.com/mbjd05/ashamed-frontend"
