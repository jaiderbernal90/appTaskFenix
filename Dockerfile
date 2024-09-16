###################
# BASE STAGE
###################

FROM node:18 AS base

# Set the working directory
WORKDIR /usr/src/app

# Install build essentials
RUN apt-get update && apt-get install -y build-essential python3

# Create the database directory and set permissions
RUN mkdir -p /usr/src/app/db && chown -R node:node /usr/src/app

###################
# DEVELOPMENT STAGE
###################

FROM base AS development

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY --chown=node:node . .

###################
# BUILD STAGE
###################

FROM development AS build

# Build the application
RUN npm run build

###################
# PRODUCTION STAGE
###################

FROM base AS production

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install production dependencies and rebuild bcrypt
RUN npm ci --only=production && npm rebuild bcrypt --build-from-source

# Copy built application from build stage
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Set NODE_ENV to production
ENV NODE_ENV production

# Switch to non-root user
USER node

# Start the server using the production build
CMD [ "node", "dist/main.js" ]