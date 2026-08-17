FROM ubuntu:22.04

# Avoid prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# Install g++, Node.js, and Java
RUN apt-get update && \
    apt-get install -y curl build-essential openjdk-17-jdk && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY executor.sh /app/
RUN chmod +x /app/executor.sh

# Set the entrypoint to the script
ENTRYPOINT ["/bin/bash", "/app/executor.sh"]
