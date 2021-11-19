FROM node:alpine

LABEL description="This is the base docker image for the SafeSign Backend Node app."
LABEL maintainer = ["nivjayak@cisco.com", "nivjayak@cisco.com"]

WORKDIR /app


COPY ["package.json", "package-lock.json", "./"]


RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]