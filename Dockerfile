FROM node:alpine

LABEL description="This is the base docker image for the SafeSign Backend Node app."
LABEL maintainer = ["nivjayak@cisco.com", "nivjayak@cisco.com"]

WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
#COPY . .
COPY server/ server/
COPY config/ config/
EXPOSE 3001
#CMD ["node", "index.js"]
CMD ["npm", "start"]