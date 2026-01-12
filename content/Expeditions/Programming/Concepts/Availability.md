---
description: Resilient applications ans systems that can withstand failures.
tags:
  - Category
  - Software-Development
aliases:
publish: true
exclude: true
---

Availability means the application or system does not go down/offline and is resilient to failures and shortages even if some parts of the applications or system goes offline. Usually, availability is correlated to [Scalability](/Scalability), and most specifically horizontal scalability as more computing units can be employed to keep the application/system running. The primary goal of making an application or system highly available is to survive a data center loss.

Availability is generally expressed in terms of % or as a number of nines. The following table captures the downtime per year for some of the most prevalent availability cases.

| Availability (%)                | Downtime (per year) |
| ------------------------------- | :-----------------: |
| 90% (one nine)                  |     36.53 days      |
| 99% (two nines)                 |      3.65 days      |
| 99.9% (three nines)             |     8.77 hours      |
| 99.95% (three and a half nines) |     4.38 hours      |
| 99.99% (four nines)             |    52.60 minutes    |
| 99.995% (four and a half nines) |    26.30 minutes    |
| 99.999% (five nines)            |    5.26 minutes     |

## Increasing Availability

- One way to increase availability is to **increase redundancy**. This could mean increasing the infrastructure.
- But increasing is not always the answer as increased infrastructure increases the cost as well.
- Some of the ways availability can be increased with cost consciousness is by
  1.  **Replication**: The data is replicated in another zone that is geographically isolated.
  2.  **Redirection**: When one of the services goes down, the users must be automatically redirected to the resources that can support the traffic. This is usually handled by means of a load balancer that automatically routes the traffic to the resources that respond to health checks.

## Availability Types

There are two types of approaches that can be taken when setting up a system for high availability

1. **Active-Passive**:
   - One of the 'n' instances are available to the users at a time.
   - The others are in stand-by to take over the traffic in case of failures.
   - Advantage of this method is that for systems and services that are stateful where the user session info is stored, it would be a smooth experience for the users.
2. **Active-Active**
   - It is superior in scalability.
   - Modifying a system to be stateless enables scalability.
   - Since more than one resource servers the traffic, the traffic is shared between the resources, thus preventing overloading onto one resource.
   - This works well for stateless applications.

## Capacity issues in availability

- Availability and reachability can be improved by adding more servers, but care must be taken to not run into capacity issues.
- The problem with the active-passive mode of availability is that when the traffic increases, the bottleneck is not handled, but merely routed to another instance, which would also end up throttling due to the traffic.
- In such cases, [scaling](/Scalability) is the way to ensure proper availability.

---
