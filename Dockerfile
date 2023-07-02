 # Use the latest version of Node
 FROM node:latest

 # Create a directory
 WORKDIR /app

 # Copy package.json
 COPY package.json /app

 # Install dependencies
 RUN npm install

 # Copy everything across
 COPY . /app

 # Run
 CMD [ "npm", "run", "dev" ]