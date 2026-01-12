---
title: Docker
description:
tags:
aliases:
publish: true
---
# Containerization with Docker




**Objectives**
- what are containers
- what is docker and why is it needed
- what can docker do?
- run docker containers
- create docker images'
- networks in docker
- docker compose
- docker concepts in depth
- docker for windows and mac
- docker swarm
- docker vs kubernetes

## why is docker needed?
- Compatibility with the OS issue
- Compatibility with versions of the components and libraries issue (matrix from hell)
- Delayed setting up of the environments for dev/test/prod


## what are containers?
- containers offer an isolated environment from the host operating system
- circumvent the dependency issue as the dependencies can be packaged into  the container
- the same existed as VMs before, but were clunky to set up and operate.
- docker is based on the LXC containers technology
- Containers share the underlying kernel
- Containers expect a Linux kernel.
- In Windows, docker uses the WSL layer to power the required kernel for the containers
- In Mac, the OS sets up a VM that provides the necessary kernel components for the containers 