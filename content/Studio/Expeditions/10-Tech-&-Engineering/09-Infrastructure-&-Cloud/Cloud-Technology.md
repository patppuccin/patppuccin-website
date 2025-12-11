---
title: Cloud Technology
description: Various tools and techniques in the world of cloud computing and cloud services.
aliases:
  - Cloud Tech
tags:
publish: true
---
## Evolution of Cloud Hosting
1. **Dedicated Server** - A separate physical machine is dedicated to run a service for a business.
	- Maintained by the business.
	- Very expensive.
	- High maintenance.
	- High security as the data is handled by the business itself.
2. **Virtual Private Server** - A separate physical machine is dedicated to a business and the machine is virtualized into sub-machines to run multiple services.
	- Provides better utilization and Isolation of resources.
	- Maintained by the business.
	- Expensive, high maintenance.
	- High security.
3. **Shared Hosting** - One physical machine is shared by many business to run one or many services as required. Here, the bet is to have the clients under-utilize the power so that the capacity can be shared to many clients.
	- Relatively cheap.
	- Limited functionality.
	- Poor isolation.
4. **Cloud Hosting** - Multiple physical machines act as one system and multiple businesses can share the resources as they require.
	- Flexible.
	- Cost Effective.
	- Scalable.
	- Benefits from economies of scale. 
	- Secure.
	- Virtualized isolation.

## The Benefits of Cloud
### Agility
- Increased speed and agility

### Pay-as-you go pricing
- Pay only for what is used and when it is used.

### Economies of scale
- Benefit from reduced cost as a lot of people share the cost burden.

### Global reach
- Going global in minutes.

### Security
- Highly reliable security systems implemented by the cloud service providers.

### Reliability
- No need to worry about maintaining data centers, the cloud service providers does it by themselves.

### High availability
- Have a high Service Level Agreement (SLA).

### Scalability
- Quickly increase the usage as and when it is required.

### Elasticity
- Flexibility to use any technology the cloud service providers offers

## Seven advantages to cloud
1. **Cost effective** - Pay as required with no up-front cost. On-demand pricing or Pay-as-you-go with thousands of customers sharing the cost of the resources.
2. **Global** - Launch workloads to anywhere in the world.
3. **Secure** - [CSP](/Cloud%20Service%20Provider)s take care of the security of the services they provide. Also a granular access control can be set.
4. **Reliable** - Data backup, data recovery, data replication, fault tolerance features are available.
5. **Scalable** - Increase or decrease resources and services based on demand.
6. **Elastic** - Automate scaling during spikes and drop in demand.
7. **Current** - The underlying hardware and managed software is patches, upgraded and replaced by the [CSP](/Cloud%20Service%20Provider) without interruption for the user.

# General Concepts in Cloud
## Cloud Architect
A cloud architect is a solutions architect who is focused solely on architecting technical solutions using cloud services. A solutions architect is a role that involves creating a technical solution using multiple systems via researching, documentation and experimentation.

A solutions architect needs to consider the following two factors
- The security of the solution.
- The cost of the solution.

A cloud architect needs to consider the following concepts into the architecture design based on the business requirements.
- Availability
- Scalability
- Elasticity
- Fault Tolerance
- Disaster Recovery

### Availability
The ability to ensure a service remains available. This can be accomplished by ensuring there is no single point of failure and making sure that there is a certain level of performance at all costs.

This could be accomplished by running a workload across multiple locations so that failure of one or two services would not affect the service. A load balancer

### Scalability
The ability to grow rapidly and unimpeded based on the increasing demand of traffic, memory or computing power. The scaling can be done in two ways.
1. **Vertical Scaling** - Upgrading to a bigger server.
2. **Horizontal Scaling** - Add more servers of the same size.

### Elasticity
The ability to shrink and grow to meet the demands *automatically*. Usually elasticity needs to account for increase and decrease in demand and thus pertains to horizontal scaling only, as quickly servers can be added upon requirement and underutilized servers can be removed upon excess.

## Fault Tolerance
Fault tolerance means to support uninterrupted service despite failure of certain components in a system. This means to ensure there is no single point of failure. This can be accomplished by establishing Fail Overs.

**Fail Overs** is where a redundant system takes over a traffic in case of failure of the primary system by shifting the traffic to itself. 

A **fault domain** is a section of network that if any damage occurs will not cascade the damage to other regions limiting the extent of the damage.

A **fault level** is a collection of fault domains that is contained. It is up to the [Cloud Service Provider](/Cloud%20Service%20Provider) to define the boundaries of the domain and level. Generally a fault domain might be a specific servers in a server rack, or specific rack in a data center, specific room in a data center and so on.

These fault domains have the following ways to minimize interdependency. 
- Separated from each other and located in lower flood risk areas.
- Are powered by Uninterruptible Power Supply (UPS). 
- Powered by separate substations to avoid an outage by a common substation.

### High Durability
Ability to recover from a disaster and prevent loss of data. The solutions that facilitate recovery are known as **Disaster Recovery(DR)** services.

Some of the questions to ask when setting up a DR include
- Is there a backup.
- How fast can a restore be done.
- Does the backup still work.
- How to ensure current live data is not corrupt.

### Disaster Recovery
The ability to recover from a disaster. This is a measure of how durable the system is. The data recovery options are described and defined in a [Business Continuity Plan](/Business%20Continuity%20Plan).

Disaster recovery be provided in multiple ways as follows with each having their own pros and cons

#### Backup and Restore
- The data is backed up and restored to new infrastructure.
- The restoration can be done in hours.
- Used for lower priority business cases.
- It restores the data after the event.
- It deploys the resources after the event.
- Cost: $

#### Pilot Light
- The data is replicated to another region with the minimal services running.
- The restoration time might be around 10 minutes.
- It has less stringent [RPOs](/Business%20Continuity%20Plan#Recovery%20Point%20Objective%20RPO) and [RTOs](/Business%20Continuity%20Plan#Recovery%20Time%20Objective%20RTO)
- It is used to run the core services.
- Start and scale the resources after the event.
- Cost: \$\$

#### Warm Standby
- Scaled down copy of the existing infrastructure but in a scaled down environment.
- The restoration can be run within a few minutes.
- Business critical services are run here
- Scales the resources after the event.
- Cost: \$\$\$

#### Multi-site Active/Inactive
- Scaled up or a similar infrastructure similar to the existing infrastructure maintained in another region.
- The restoration is real-time.
- Zero downtime
- Zero data loss
- Runs mission critical services
- Cost: \$\$\$\$ (Almost as much as the actual business solution)

## Data Residency
It is the physical or geographical location where the cloud resources are stored (reside). 

## Compliance Boundaries
A legal requirement by a government or organization that dictates where the data and cloud resources should be stored physically.

## Data Sovereignty 
It is the jurisdictional control or legal authority that can be asserted over data that is stored in a location under a government's or an organizational jurisdictional boundary.

## Common Compliance Standards
1. **Federal Risk and Authorization Management Program (FedRAMP)** - It is a US government wide program that provides a standardized approach for security assessment, authorization and continuous monitoring of cloud products and services.
2. **Criminal Justice Information Systems (CJIS)** - Department of Justice's security policy.
3. **International Traffic in Arms (ITAR)**
4. **Export Administration Regulations (EAR)**

## Infrastructure as Code (IaC)
Creating, updating and destroying of cloud infrastructure can be automated with scripts using IaC. IaC is a blueprint for the infrastructure and the infrastructure follows the code to make sure the infrastructure is maintained in the way described in the blueprint (IaC). IaC allows easy share, version and inventory the cloud infrastructure. There can be two types of IaC code and they are discussed as follows.

## Declarative IaC
- WYSIWYG style of specifying the requirements (*Explicit*).
- More verbose, but has less chance of mis-configuration.
- Uses scripting languages like JSON, YAML, XML.

## Imperative IaC
- Specify requirements, the rest is filled in automatically (*Implicit*).
- Less verbose, but has chance of mis-configuration.
- More features than the declarative IaC.
- Uses programming languages like Python, Ruby, [JavaScript](../06-Programming-&-Paradigms/JavaScript/index.md).
