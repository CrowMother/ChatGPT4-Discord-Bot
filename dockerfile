# Use the official Node.js 16 image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . /app

# Expose the port your application will be running on
EXPOSE 3001

# Specify the command to start the application
CMD [ "node", "bot.js" ]