# Build image
FROM node:8 as builder

# Copy all files to the container
COPY . /tmp/readyblocks-action/
WORKDIR /tmp/readyblocks-action/

# Install all development dependencies
RUN [ "yarn", "install", "--non-interactive", "--pure-lockfile" ]

# Build the required files
RUN [ "yarn", "build" ]

# Completed image
FROM node:8-alpine

WORKDIR /etc/readyblocks-action/

# Import prepared files from the builder
COPY --from=builder /tmp/readyblocks-action/dist/app.js /etc/readyblocks-action/app
COPY --from=builder /tmp/readyblocks-action/package.json /tmp/readyblocks-action/yarn.lock /etc/readyblocks-action/

# Symlink the cli
RUN [ "ln", "-s", "/etc/readyblocks-action/app", "/usr/bin/readyblocks-action" ]

# Install the production dependencies
RUN [ "yarn", "install", "--production", "--non-interactive", "--pure-lockfile" ]

# Document exposing the interaction port
EXPOSE 3000/tcp

# Image metadata
LABEL name="readyblocks-action-base" version="1.0.0-alpha.0" maintainer="dhellstern@outlook.com"

WORKDIR /

CMD [ "readyblocks-action" ]
