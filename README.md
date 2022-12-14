# Welcome to SARA project
#### Search and Rescue Application

## iOS app repository: [馃崕 iOS app](https://github.com/macko99/sara-ios-public)

## Docker compose repo: [馃捒 Docker](https://github.com/macko99/sara-docker-public)


## What's SARA?

SARA stands for Search and Rescue Application

Praca in偶ynierska w ramach studi贸w I stopnia na Akademii G贸rniczo-Hutniczej w Krakowie na kierunku Informatyka 

Zadaniem aplikacji jest monitorowanie, koordynowanie i zarz膮dzanie w czasie rzeczywistym poszukiwawczymi w r贸偶nych terenach. Aplikacja b臋dzie umo偶liwia艂a 艣ledzenie ruch贸w grup, pokrytego przez ni膮 terenu oraz komunikacj臋 dwustronn膮 z central膮 oraz grupami mi臋dzy sob膮, wraz z przesy艂aniem zdj臋膰 i plik贸w.

## Contributors

- <a href="https://github.com/tombush0">Tomasz Zachwieja</a>
- <a href="https://github.com/macko99">Maciej Kozub</a>

## About this repository

1. This repository is maintained for Heroku app deployment as well as for Docker image of web client application
2. Application is available at: https://sara-panel.herokuapp.com
3. Autodeployment is done for branch **master**
4. This application provides web panel for action coordination and user management
5. REST API server is available at: https://sara-server.herokuapp.com

---
### UPDATE 馃馃徎鈥嶐煉?
[Docker Compose](https://docs.docker.com/compose/) images prepared 

Now you are just one command away from running **database + backend + frontend** locally

1. Make sure you have [Docker](https://www.docker.com/get-started) installed on your system

2. **Increase RAM allocation for docker (e.g. using Docker Desktop) to at least 4GB**

3. Clone [馃捒 Docker](https://github.com/macko99/sara-docker-public) and navigate to folder **docker**, you will find **docker-compose.yaml** inside

4. Execute 

        $ docker compose up -d --build

5. All info below about running seperate docker images are still valid

6. For more information and adjustments please read comments inside **docker-compose.yaml** and proper **Dockerfiles**

---

## Running Dockerized client web application

1. Make sure you have [Docker](https://www.docker.com/get-started) installed on your system

2. **Increase RAM allocation for docker (e.g. using Docker Desktop) to at least 4GB**

3. Run two commented commands from **Dockerfile**:

        $ docker build -t react-app:latest .
        $ docker run -p 0.0.0.0:8081:8081 -d react-app:latest

4. To change server instance or web portal bind port  please look inside **Dockerfile**

## Local development

1. (Recommended) Use your favorite IDE (e.g. WebStorm)

2. Install required npm packages:

        $ npm install

3. Set proper environment variables (on your system on inside IDE):

   - REACT_APP_SERVER=..
   - REACT_APP_GOOGLE_MAPS_API_KEY=...
   - PORT=...*

   *needed for production environment

4. Run development server by executing:

        $ npm run dev

    *tested using **node v14 v15 v16**

5. Access web portal on http://localhost:3000

6. To run production environment execute two commands:

       $ npm run build
       $ npm start

7. Found a bug? Please report Issue on GitHub

## Deployment on Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-python#set-up)

2. To deploy changes:

        git push heroku master

3. See logs:

        heroku logs --tail

4. Scale your application:

        heroku ps:scale web={number}

5. Run any commend in enviroment (inpersistent):

        heroku run {command}

---

## How to make it work?

Fix all `---FIXME---` placeholders in the source code.