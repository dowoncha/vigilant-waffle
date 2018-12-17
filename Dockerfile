FROM node:latest

# Set Workspace
WORKDIR /app

# Install static server
RUN npm install -g serve

# Dependencies should eventually be moved out to the CI environment
COPY package-lock.json package.json /app/
RUN npm install

# Copy and build this mofo 
COPY . /app

ARG API_HOST="http://localhost:3000"

ENV REACT_APP_API_HOST=${API_HOST}

RUN npm run build

EXPOSE 8080

ENTRYPOINT ["serve", "-s", "build", "-p", "8080"]