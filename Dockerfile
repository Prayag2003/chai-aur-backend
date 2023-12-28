# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /src    

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "run", "dev"]
