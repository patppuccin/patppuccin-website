---
title: 12 Factor App
description:
tags:
aliases:
publish: true
---
# The 12-Factor App

Reference: [The Twelve-Factor App](https://12factor.net/) By [Heroku](https://www.heroku.com/)

1. **Codebase** - One codebase tracked in version control, many deploys. There should be *exactly one code repository per application*, but that codebase can be deployed to *multiple environments* (development, staging, production). Multiple apps sharing code should extract shared code into libraries managed through the dependency manager. This enables consistent versioning and deployment practices across all environments.

2. **Dependencies** - Explicitly declare and isolate dependencies. Never rely on implicit existence of system-wide packages. Use a *dependency declaration manifest* (like `package.json`, `requirements.txt`, or `go.mod`) to *declare* all *dependencies explicitly*. Use dependency isolation tools (like virtual environments) to ensure no dependencies "leak in" from the surrounding system. This guarantees the app can be run anywhere without assumption about what's pre-installed.

3. **Config** - Store *config in the environment*. Configuration that varies between deploys (database URLs, credentials, API keys, feature flags) should be stored in environment variables, never in code. Config should be *strictly separated from code* because config varies substantially across deploys while code does not. A good test is to ask if the codebase can be open-sourced right now without compromising any credentials.

4. **Backing Services** - Treat *backing services as attached resources*. A *backing service* is any *service the app consumes over the network* (databases, message queues, SMTP services, caching systems). The code should make no distinction between local and third-party services - both are accessed via URL or locator stored in config. Services should be attachable and detachable from deploys at will without code changes. This enables easy isolation for testing, staging and production environments.

5. **Build, Release, Run** - Strictly *separate build and run stages*. The build stage converts code into an executable bundle (compiling binaries, bundling assets). The release stage takes that build and combines it with deploy-specific config. The run stage executes the app in the execution environment. Code must not be allowed to change during runtime and every *release must have a unique ID for tracking and rollbacks*.

6. **Processes** - Execute the *app as one or more stateless processes*. Twelve-factor processes are stateless and share-nothing. Any *data that needs to persist* must be *stored in a stateful backing service* (typically a database). Never assume anything cached in memory or on disk will be available on a future request. Session state should be stored in a datastore with time-expiration (like Redis or Memcached).

7. **Port Binding** - Export *services via port binding*. The app is completely *self-contained and exports* HTTP (or other protocols) *by binding to a port*. The app doesn't rely on runtime injection of a webserver - it becomes the webserver. In production, a routing layer handles routing from public-facing hostname to the port-bound processes. This approach means one app can become a backing service for another app via its URL.

8. **Concurrency** - Scale out via the process model. *Processes are first-class citizens*. The app should be architected to handle diverse workloads by assigning each type of work to a process type (web process, worker process, clock process). Scale horizontally by running more processes, not by making individual processes larger (vertical scaling). Processes should never daemonize or write PID files - rely on the OS process manager instead.

9. **Disposability** - Maximize *robustness* with *fast startup and graceful shutdown*. Processes should start quickly (ideally a few seconds) and shut down gracefully when receiving a SIGTERM signal. For web processes, graceful shutdown means stopping acceptance of new requests, finishing current requests, then exiting. For worker processes, return jobs to the queue on shutdown.

10. **Dev/Prod Parity** - Keep *development, staging, and production as similar as possible*. Minimize gaps between development and production in three dimensions: time (code goes from dev to production in hours or minutes, not weeks), personnel (developers deploy their own code and observe it in production), and tools (keep dev and production environments as similar as possible - same database type, same backing services). Avoid using different backing services in different environments.

11. **Logs** - Treat *logs as event streams*. The app never concerns itself with routing or storage of its output stream. It writes all *logs unbuffered to `stdout` as a time-ordered stream of events*. In development, developers view the stream in their terminal. In production, the execution environment captures the stream and routes it to appropriate destinations (log indexing system, long-term archival, analytics tools). This separation of concerns makes logs flexible and powerful.

12. **Admin Processes** - Run *admin/management tasks as one-off processes*. One-off admin processes (database migrations, console sessions, one-time scripts) should run *in an identical environment to regular long-running processes*. Admin code ships with application code to avoid synchronization issues. Use the same dependency isolation techniques on all process types. REPL shells should be available in all environments for running arbitrary code or inspecting the database.