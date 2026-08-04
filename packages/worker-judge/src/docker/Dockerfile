FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY executor.sh /app/
RUN chmod +x /app/executor.sh

ENTRYPOINT ["/bin/bash", "/app/executor.sh"]

