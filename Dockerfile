FROM node:16

WORKDIR /app

# ------CHOOSE BACKEND------
#ENV REACT_APP_SERVER https://sara-server.herokuapp.com/
ENV REACT_APP_SERVER http://localhost:5555/
# ------------

# ------ADJUST------
ENV REACT_APP_GOOGLE_MAPS_API_KEY ---FIXME---
ENV PORT 8081
# ------------

ENV PATH /app/node_modules/.bin:$PATH
ENV CHOKIDAR_USEPOLLING true

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./src /app/src
COPY ./public /app/public
RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]


# ------NOT DOCKER COMPOSE------
# ------USE FOR BUILDING AND RUNNING DOCKERIZED REACT CLIENT ------
#
# Increase RAM allocation for docker (e.g. using Docker Desktop) to at least 4GB
#
# docker build -t react-app:latest .
# docker run -p 0.0.0.0:8081:8081 -d react-app:latest
# ------------
