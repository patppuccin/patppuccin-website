---
title: Infrastructure as Code (IaC)
description: about infrastructure as code
tags:
aliases:
  - IaC
publish: true
exclude: true
---

# Infrastructure as Code (IaC)

**Infrastructure as Code** (**IaC**) is a practice in software engineering that involves managing and provisioning infrastructure using _code and automation tools_. It allows defining and managing infrastructure, such as servers, networks, and databases, using code rather than manual processes.
This code is typically written using configuration files, and it can be versioned and stored in a version control system such as git. IaC brings _consistency_, _repeatability_, and _efficiency_ to infrastructure management, making it easier to deploy and manage complex systems while reducing the chances of human errors.

The following table aims to perform a brief comparison between manual configuration to an IaC approach

| Aspect                      | Manual Configuration                      | Infrastructure as Code (IaC)                |
| --------------------------- | ----------------------------------------- | ------------------------------------------- |
| **Consistency**             | Prone to inconsistencies                  | Ensures uniform configurations              |
| **Automation**              | Manual tasks, time-consuming              | Automated provisioning and setup            |
| **Version Control**         | Changes not easily versioned              | Code stored in version control systems      |
| **Scalability**             | Difficulty scaling up                     | Supports consistent scaling                 |
| **Documentation**           | Separate documentation required           | Infrastructure code serves as documentation |
| **Reproducibility**         | Inconsistent environments                 | Reliable recreation of exact setups         |
| **Dependency**              | Relies on specific personnel              | Reduces dependency on individuals           |
| **Security**                | Vulnerabilities due to inconsistent setup | Enforces security best practices            |
| **Auditing**                | Difficult to track changes                | Changes tracked in version control          |
| **Updates and Maintenance** | Complex and time-consuming updates        | Streamlines updates and maintenance         |

## The Fundamentals of IaC

### IaC and Infrastructure Lifecycle

The concept of infrastructure lifecycle refers to the stages that an IT infrastructure goes through, from planning and design to implementation, operation, and eventual decommissioning. Infrastructure as Code (IaC) plays a crucial role in various phases of this lifecycle, as showcased below.

1. **Planning and Design**
   - IaC helps in defining and designing infrastructure configurations using code. This allows you the modeling of the desired architecture and configurations before actual implementation.
   - Infrastructure blueprints are created, detailing the resources, services, and networks required for the project.
2. **Implementation**
   - IaC tools are used to provision and configure the defined infrastructure based on the coded configurations.
   - Code templates are deployed to cloud platforms or on-premises environments to create the actual infrastructure.
3. **Testing and Quality Assurance**
   - IaC enables consistent and repeatable testing by ensuring that the same infrastructure is deployed for each test cycle.
   - Automated testing can be performed on infrastructure code to identify configuration issues early in the development process.
4. **Deployment and Release**
   - IaC ensures that the same code is used for deploying infrastructure in different environments, leading to consistent deployments across development, testing, and production.
   - Release pipelines can be set up to automate the deployment of both application code and infrastructure code.
5. **Operations and Monitoring**
   - IaC facilitates efficient monitoring and management of infrastructure by providing a clear understanding of the configurations in use.
   - Changes to infrastructure can be tracked through version control, simplifying troubleshooting and auditing.
6. **Scaling and Maintenance**
   - IaC allows for easy scaling of infrastructure by adjusting the configuration code or parameters as needed.
   - Updates and maintenance can be performed by making changes to the code and then deploying the updated configuration.
7. **Decommissioning**
   - When infrastructure is no longer needed, IaC makes it straightforward to tear down resources by executing code that reverses the provisioning process.
   - This ensures that all resources are properly terminated and no lingering components are left behind.

Apart from this classification, SysAdmins also refer to the infrastructure lifecycle in a simple method as classified below.

| Activities       | Day 0                                                                                                                | Day 1                                                                                                    | Day 2                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Definition**   | Initial _planning_, _design_, and _implementation_ phase.                                                            | _Deployment_ and _initial configuration_ phase.                                                          | Ongoing _operations_, _management_, and _maintenance_ phase.                                                       |
| **Roles of IaC** | IaC defines the infrastructure model<br><br>Templates/blueprints created<br><br>Provides a foundation for deployment | IaC automates resource provisioning<br><br>Ensures consistent setup<br><br>Supports reliable deployments | IaC aids in monitoring configurations<br><br>Automates routine maintenance tasks<br><br>Enables controlled changes |

### Types of IaC tools in the wild

IaC tools come in many shapes and sizes serving a specific problem they set out to solve. Based on this, following are some of the most commonly used IaC tool types.

1. **Configuration Management Tools**
   - _Tools_ - [Ansible](/Ansible), [Puppet](/Puppet), [Chef](/Chef), SaltStack
   - Focus on detailed automation of configuration and management of individual servers and nodes.
   - Usually agent-based, where agents are installed on the nodes themselves nodes or on a separate master node to manage the configuration process.
2. **Orchestration Tools**
   - _Tools_ - [Thesaurus/Terraform](/Thesaurus/Terraform), [CloudFormation](../../../../AWS%20CloudFormation.md), Azure Resource Manager
   - Concentrate on provisioning and managing cloud resources, networks, and services across different platforms.
   - Define infrastructure using declarative code and templates.
3. **Server Templating Tools**
   - _Tools_ - [Packer](/Packer), [Docker](../../Infrastructure-&-Ops/Platforms/Docker/index.md)
   - Focus on creating custom server images or containers that can be deployed consistently across environments.
   - Enables the creation of immutable infrastructure.
4. **Container Orchestration Tools**
   - _Tools_ - [Studio/Expeditions/DevXOps/Kubernetes](/Studio/Expeditions/DevXOps/Kubernetes), [Docker Swarm](/Docker%20Swarm), [Amazon ECS](../../../../Amazon%20Elastic%20Container%20Service.md)
   - Primarily designed to manage and automate the deployment of containers at scale.
   - Define how containers are deployed, scaled, and managed.
5. **Infrastructure Provisioning Tools**
   - _Tools_ - [Thesaurus/Terraform](/Thesaurus/Terraform), [CloudFormation](../../../../AWS%20CloudFormation.md), [Pulumi](/Pulumi)
   - Concentrate on provisioning infrastructure resources, including virtual machines, networks, and storage.
6. **Application Deployment Tools**
   - _Tools_ - [Jenkins](/Jenkins), [Travis CI](/Travis%20CI), GitLab CI/CD
   - Not exclusive to IaC, but often integrated for deploying applications along with their required infrastructure.
7. **Hybrid Tools**
   - _Tools_ - Ansible Terraform Modules, AWS CDK
   - Combine configuration management and orchestration for more comprehensive infrastructure management.

### What's with the terms?

Here's a brief capture of what each terminology means in the context of computer infrastructure and IaC.

| Terminology       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Configuration** | _Infrastructure:_ Configuration refers to the settings and parameters that define how a specific component or system operates. It includes details like network configurations, software settings, and security policies<br><br>_IaC:_ In the context of IaC, configuration refers to defining the desired state of infrastructure components and services through code or configuration files. IaC tools use these configurations to automate the setup and maintenance of infrastructure resources |
| **Provisioning**  | _Infrastructure:_ Provisioning involves the process of acquiring and preparing the necessary hardware, software, and resources to make them available for use. This includes setting up servers, storage, and networking<br><br>_IaC:_ In IaC, provisioning refers to the automated creation and allocation of infrastructure resources based on code-defined configurations. IaC tools provision resources as per the defined specifications, ensuring consistency and repeatability                |
| **Orchestration** | _Infrastructure:_ Orchestration is the coordination of multiple individual tasks or processes to work together as a unified system. It ensures that various components interact correctly to achieve a specific outcome<br><br>_IaC:_ In IaC, orchestration refers to the automated coordination and management of infrastructure resources and their configurations. IaC tools often handle the sequencing and dependencies of resource provisioning and configuration tasks                        |
| **Deployment**    | _Infrastructure:_ Deployment is the process of releasing and installing software or applications onto a server or network for operational use<br><br>_IaC:_ In IaC, deployment involves automating the setup and configuration of infrastructure resources according to code-defined specifications. It ensures that infrastructure is prepared and ready to host applications and services.                                                                                                         |

### Advantages of using IaC

1. **Consistency and Repeatability**
   - IaC ensures that changes to the infrastructure are _idempotent_, _consistent_, _repeatable_ and _predictable_, thus reducing errors and misconfigurations.
2. **Automation**
   - IaC automates provisioning, configuration, and management tasks, _saving time_ and _reducing_ the need for _manual intervention_.
3. **Version Control**
   - Infrastructure code can be stored in version control systems, allowing you to _track changes_, collaborate, and _roll back_ to previous states if needed.
4. **Documentation and Self-Service**
   - Infrastructure code serves as documentation, making it easier for team members to understand configurations and setups.
   - Self-service provisioning becomes possible, enabling teams to deploy resources using _pre-defined templates_.
5. **Faster Deployment**
   - IaC accelerates deployment processes, enabling _quick scaling_ and _reducing time-to-market_ for applications.
6. **Scalability**
   - IaC simplifies scaling by enabling you to define and deploy resources in a consistent manner across various environments.
7. **Reduced Risk of Human Error**
   - Automation through IaC reduces the likelihood of manual configuration errors that can lead to vulnerabilities and downtime.
8. **Infrastructure as Code**
   - Applying development practices to infrastructure simplifies management and aligns infrastructure with the principles of software development.
9. **Simplified Testing and QA**
   - IaC supports _automated testing_ of infrastructure code, leading to faster and more consistent quality assurance processes.
10. **Efficient Collaboration**
    - Teams can _collaborate_ more _effectively_ as they work with code, using version control and code review processes.
11. **Cost Efficiency**
    - IaC enables efficient resource allocation and management, helping to _optimize infrastructure costs_.
12. **Compliance and Auditing**
    - IaC provides an auditable record of changes, making it easier to _maintain compliance_ with regulations and internal policies.
13. **Consistent Environments**
    - IaC ensures that development, testing, and production environments are identical, reducing environment-related issues.
14. **Immutable Infrastructure**
    - With IaC, infrastructure can be treated as _immutable_, promoting _easier updates_, _rollback_, and _security_.

::: info Idempotency
**Idempotency** is a concept in computer science and mathematics that describes an operation or function that can be _applied multiple times without changing the result_ beyond the initial application. In other words, if an idempotent operation is performed once or multiple times, the _final state remains the same_ as if it had been performed just once.

- In IaC, idempotent scripts or configurations ensure that the infrastructure resources are created or configured consistently, regardless of how many times the script is executed.
- When an idempotent IaC script is run:
  - If the infrastructure resources already exist and match the desired state described in the script, no changes are made.
  - If the infrastructure resources do not exist or deviate from the desired state, the script creates or configures them to match the specified state.
- This property is valuable because it allows the application of IaC scripts multiple times without causing unintended changes or disruptions to the infrastructure being worked on.
- It simplifies management by eliminating the need to track the current state of resources and ensures that the infrastructure remains in a known and consistent state.
  :::

::: info Immutability
**Immutability** is a concept in computer science and software engineering that refers to the characteristic of an object, data structure, or state that cannot be modified after it is created. In other words, once an immutable object is created, its content or state remains fixed and cannot be changed. Any attempt to modify it results in the creation of a new object or instance with the desired changes, leaving the original object unchanged.

**Immutability in IaC:**

- In IaC, immutability means that once infrastructure resources are created or configured, their state remains fixed and cannot be altered directly. Any changes or updates to the infrastructure result in the creation of new resources with the desired configurations.
- Immutability is often associated with the idea of treating infrastructure as disposable. Rather than trying to modify a running server or network configuration, you discard the old resource and create a new one with the updated settings.
- Immutability aligns with the principle of predictability and reduces the risk of configuration drift or unintended changes in your infrastructure.

**Benefits:**

- **Predictability:** Immutability ensures that your infrastructure remains consistent and predictable. Each change results in a new resource with the expected configuration.
- **Reproducibility:** Infrastructure can be easily recreated from code, which is valuable for disaster recovery, scaling, and testing purposes.
- **Parallelism:** Immutable infrastructure is well-suited for parallel and automated provisioning. Multiple instances of the same resource can be created simultaneously without concerns about shared state.
- **Consistency:** Immutability helps maintain consistent environments across development, testing, and production, as configurations are fixed and well-defined.
  :::

## Infrastructure Automation

### IaC Approaches

Based on how an IaC tool approaches the definition and management of the resources, there are two ways it can be accomplished.

| Aspect                 | Declarative Approach                                                                                        | Imperative Approach                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Definition**         | The end-state is expressed                                                                                  | Step by step definition is provided                      |
| **Approach**           | The requirement is defined, the tool figures out the approach                                               | Explicit step-wise instructions are provided to the tool |
| **Focus**              | End-state configuration                                                                                     | Procedural configuration                                 |
| **Usage**              | Suitable for provisioning complex resources                                                                 | Managing individual servers and nodes                    |
| **Abstraction Level**  | Higher level, abstract                                                                                      | Lower level, detailed                                    |
| **Flexibility**        | Less specific instructions                                                                                  | Highly specific instructions                             |
| **Human Intervention** | Less control over individual steps                                                                          | More control over each step                              |
| **Examples**           | [Thesaurus/Terraform](/Thesaurus/Terraform), [CloudFormation](/AWS%20CloudFormation%5C), Azure RM templates | [Ansible](/Ansible), [Puppet](/Puppet), [Chef](/Chef)    |

### Tools and Services

1. [Hashicorp Terraform](/Thesaurus/Terraform) -
2. [Ansible](/Ansible) -
3.
