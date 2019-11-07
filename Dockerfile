FROM node:10

RUN mkdir /sample-task
WORKDIR /sample-task

COPY . /sample-task
RUN npm install

CMD [ "npm", "start" ]
EXPOSE 3000