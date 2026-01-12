---
title: Kubernetes
description: Kubernetes container orchestration platform
tags:
  - containers
  - MOC
publish: true
---
# Container Orchestration with Kubernetes

Kubernetes, often abbreviated as **K8s**, is a popular *open-source* *container orchestration* platform that automates the *deployment*, *scaling*, and *management* of *containerized applications*. Originally *developed by Google*, it has gained widespread adoption due to its ability to simplify the complexities of containerized environments. At its core, Kubernetes provides a framework for *automating* the *deployment and scaling* of application containers across *clusters of hosts*. It abstracts away the underlying infrastructure, allowing developers to focus on building and deploying applications without worrying about the intricacies of the infrastructure.

Kubernetes operates based on a master-node architecture, where the *master node*, which is now termed as the *control plane* manages the overall cluster and coordinates communication with worker nodes. *Worker nodes*, on the other hand, host the containers (in units called pods) and execute the tasks assigned by the master. Kubernetes supports features like automatic load balancing, rolling updates, and self-healing, making it a powerful tool for managing containerized workloads at scale.

> [!INFO]- No more MASTERS - Moving towards a more inclusive language
> The industry-wide movement toward inclusive language responds to the recognition that certain terms in technology may carry implicit biases. A notable aspect is the shift away from terms like "master" and "slave" to more neutral alternatives, promoting a more welcoming and inclusive environment. This effort, embraced by many organizations and communities, aims to eliminate language that could be exclusionary and contributes to building a diverse and respectful culture within the tech

## Comparing BMs, VMs and Containers

![BMs-VMs-Containers.png](https://patppuccin-assets.r2.cloudflare.com/BMs-VMs-Containers.png)

| Specification           | Bare Metal (BMs)                                                                     | Virtual Machines (VMs)                                                                   | Containers                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Isolation**           | Runs directly on physical hardware without an additional layer.                      | Runs on a hypervisor, providing isolation from the physical hardware.                    | Runs on a shared operating system kernel, providing lightweight isolation.                     |
| **Resource Overhead**   | Minimal, as there is no virtualization layer.                                        | Moderate to high, as VMs include a full OS and hypervisor overhead.                      | Low, as containers share the host OS kernel and do not require a full OS.                      |
| **Resource Efficiency** | Maximum resource utilization but lacks flexibility.                                  | Moderate resource efficiency due to the hypervisor layer.                                | Highly efficient use of resources, providing rapid scalability.                                |
| **Performance**         | Generally provides high performance but lacks flexibility in resource allocation.    | Slightly reduced compared to bare metal due to virtualization overhead.                  | Minimal overhead, resulting in near-native performance.                                        |
| **Deployment Time**     | Longer deployment time due to manual setup and configuration.                        | Faster deployment compared to bare metal, but slower than containers.                    | Almost instant deployment due to lightweight nature and minimal setup.                         |
| **Isolation**           | Complete isolation.                                                                  | Strong isolation between VMs.                                                            | Lightweight isolation, sharing the host OS kernel.                                             |
| **Scalability**         | Limited scalability compared to VMs and containers.                                  | Offers good scalability with the ability to run multiple VMs on a single physical host.  | Highly scalable, allowing the deployment of numerous containers on a single host.              |
| **Deployment Speed**    | Slow deployment.                                                                     | Faster deployment than bare metal but slower than containers.                            | Almost instant deployment.                                                                     |
| **Use Case**            | Suitable for resource-intensive applications that require direct access to hardware. | Ideal for running multiple applications with different OS requirements on a single host. | Best for microservices architectures, CI/CD pipelines, and lightweight, scalable applications. |

### Containerization v Container Orchestration

| Aspect                | Containerization                                                                                  | Container Orchestration                                                                                             |                                         |
| --------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Definition**        | Packaging, distributing, and executing applications in isolated environments known as containers. | Managing the deployment, scaling, and operation of containers within a larger ecosystem.                            |                                         |
| **Focus**             | Concerned with bundling and running applications in isolated environments.                        | Concerned with automating, scaling, and managing the lifecycle of multiple containers as part of a system.          |                                         |
| **Key Components**    | Containers, Images, Docker (or containerization platform of choice).                              | Orchestration platforms (e.g., Kubernetes, Docker Swarm, Apache Mesos).                                             |                                         |
| **Isolation Level**   | Provides lightweight isolation, sharing the host OS kernel.                                       | Manages the deployment and operation of multiple containers, ensuring they run seamlessly in isolated environments. |                                         |
| **Resource Overhead** | Low, as containers share the host OS kernel and have minimal overhead.                            | Moderate, as orchestration platforms add additional components and services for managing containers.                |                                         |
| **Scalability**       | Scalable, but manual scaling might be required for larger deployments.                            | Highly scalable, with automated scaling based on demand, ensuring efficient resource utilization.                   |                                         |
| **Use Case**          | Ideal for packaging and running applications consistently across different environments.          | Essential for deploying and managing large-scale, distributed applications with multiple interacting components.    |                                         |
| **Examples**          | [Docker](/dockerd), Podman, containerd.                                                                                       | Kubernetes, Docker Swarm, Apache Mesos. |

### Understanding container orchestration

- **Container Orchestration** is the automated process of *managing*, *deploying*, *scaling*, and *operating* containerized applications. It involves coordinating the deployment and lifecycle management of multiple containers to ensure they work together seamlessly to deliver a *complex*, *distributed application*.
- Some of the key components of a container orchestration platform/engine are Orchestrators
	1. **Orchestrators** - Tools or platforms that automate the management of containers.
	2. **Cluster** - A collection of machines (nodes) that collectively run containerized applications.
	3. **Container Runtime** - The underlying software responsible for running containers (e.g., Docker, containerd).
- Some of the most commonly used container orchestration platforms are
	1. [Studio/Expeditions/DevXOps/Kubernetes](/Studio/Expeditions/DevXOps/Kubernetes) - An open-source platform for automating deployment, scaling, and management of containerized applications.
	2. [Docker Swarm](/Docker%20Swarm) - A native clustering and orchestration solution for [Docker](../Docker/index.md).
	3. [Apache Mesos](/Apache%20Mesos) - A distributed systems kernel that abstracts resources and manages workloads.
- Some of the key features of container orchestration are listed below.
	- **Automated Deployment** - Simplifies the process of deploying applications across multiple containers and nodes.
	- **Scaling** - Allows automatic scaling of the number of containers based on demand to handle varying workloads.
	- **Load Balancing** - Distributes incoming traffic among containers to ensure even resource utilization and high availability.
	- **Health Monitoring and Recovery** - Continuously monitors the health of containers and automatically replaces or restarts failed instances.
	- **Networking** - Manages network configurations, enabling communication between containers and external services.
	- **Resource Allocation** - Efficiently allocates computing, storage, and network resources to containers.
	- **Service Discovery** - Facilitates the discovery and communication between containers within a dynamic environment.

### Why Kubernetes?

Kubernetes has emerged as the de facto standard for container orchestration due to its comprehensive feature set, robust architecture, and widespread community adoption. The advantages of using Kubernetes extend across various aspects of containerized application management:

1. **Automated Deployment and Scaling**
	- Kubernetes allows users to define the desired state of their applications, and it automatically handles the deployment and scaling of containerized workloads to meet that desired state.
	- Automated scaling features, including horizontal pod autoscaling, enable applications to dynamically scale based on demand.
2. **High Availability and Fault Tolerance**
	- Kubernetes ensures high availability by distributing applications across multiple nodes in a cluster.
	- It automatically reschedules and replaces failed containers, contributing to fault tolerance.
	- Self-healing mechanisms detect and address issues, minimizing downtime and disruptions to applications.
3. **Service Discovery and Load Balancing**
	- Kubernetes provides built-in service discovery, allowing containers within a cluster to find and communicate with each other using DNS or environment variables.
	- Integrated load balancing ensures even distribution of traffic among containerized applications, optimizing performance and reliability.
4. **Resource Efficiency**
	- Kubernetes efficiently utilizes resources by packing containers onto nodes based on resource requirements and constraints. This ensures optimal use of computing resources in the cluster.
	- Resource quotas and limits allow for fine-grained control over resource allocation, preventing one application from monopolizing resources.
5. **Declarative Configuration**
	- Users can define the desired state of their applications and infrastructure using declarative configuration files (YAML). This approach simplifies deployment and promotes version control of configurations.
	- Declarative syntax allows for easy tracking of changes, collaboration, and rollbacks to previous configurations.
6. **Extensive Ecosystem**
	- Kubernetes has a rich ecosystem of extensions, tools, and plugins. This includes Helm charts for package management, Operators for automating application management, and a variety of storage and networking solutions.
	- The vast ecosystem contributes to Kubernetes' adaptability to diverse use cases and environments.
7. **Portability and Vendor Neutrality**
	- Kubernetes is open source and follows a container-centric infrastructure approach, making it vendor-agnostic. It can run on various cloud providers, on-premises data centers, and even edge environments.
	- This portability ensures that applications built and deployed on Kubernetes can easily move across different environments without major modifications.
8. **Community Support and Innovation**
	- Kubernetes benefits from a large and active open-source community. This community-driven development model fosters innovation, continuous improvement, and the rapid adoption of emerging best practices.
	- Regular releases and updates introduce new features, security enhancements, and performance improvements.
9. **Built-in Security Features**
	- Kubernetes provides several security features, including role-based access control (RBAC), pod security policies, and network policies. These features help enforce access controls and secure communication between pods.
	- Kubernetes allows for integration with container runtime security solutions and provides a foundation for building secure containerized applications.
10. **Standardization and Industry Support**
	- Kubernetes has become a standard for container orchestration, with major cloud providers offering managed Kubernetes services (Amazon EKS, Google Kubernetes Engine, Azure Kubernetes Service).
	- Standardization simplifies the deployment and management of containerized applications, fostering a consistent experience across different environments.

## Getting to know Kubernetes

### History and Current State

Kubernetes originated from Google's internal container orchestration system, **Borg**. Google open-sourced the Kubernetes project in 2014, allowing it to quickly gain traction as a leading container orchestration platform. The [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) took over its governance in 2015, fostering a vibrant and collaborative ecosystem around the project.

Over the years, Kubernetes has evolved to become the de facto standard for container orchestration in the industry. Its robust features for automating deployment, scaling, and management of containerized applications have made it a cornerstone of modern cloud-native infrastructure. The project has seen regular updates and enhancements, with a strong focus on scalability, stability, and extensibility. Kubernetes has also spurred the development of a rich ecosystem of tools and services, contributing to its widespread adoption across various industries.

In the current state, Kubernetes continues to be a dynamic and influential force in the world of container orchestration. Its community-driven development model ensures ongoing innovation, and its compatibility with diverse environments, including on-premises data centers and multiple cloud providers, solidifies its role as a key enabler of scalable and resilient application architectures. As Kubernetes matures, it remains a critical technology for organizations seeking to deploy and manage containerized workloads at scale.

### Alternatives to K8s

1. **Docker Swarm** - Docker's native orchestration tool, Swarm, provides a simple and lightweight way to orchestrate Docker containers without the need for Kubernetes.
2. **Nomad** - Developed by HashiCorp, Nomad is a standalone orchestrator that supports both containers and virtual machines. It is designed for simplicity and flexibility.
3. **Mesos/Marathon** - Apache Mesos, combined with the Marathon framework, offers a general-purpose orchestration solution for both containers and traditional workloads.
4. **Amazon ECS (Elastic Container Service)** - ECS is Amazon's proprietary container orchestration service that manages Docker containers. While AWS offers Amazon EKS with Kubernetes, ECS itself is a separate solution.

## The Basics of Kubernetes

### Kubernetes Architecture

In Kubernetes, the architecture is commonly referred to as the **Master-Node Architecture**. Machines in which Kubernetes is running is usually referred to as a *cluster*. In a Kubernetes cluster, the following types of nodes are available.
1. **Master Node**
2. **Worker Node**

#### Master Node
In a Kubernetes cluster, the Master Node plays a pivotal role in *orchestrating* and *managing* the *overall state* of the system. It is responsible for *coordinating the activities* of the cluster and *ensuring* that the *desired state*, as *defined* by users and applications, is maintained. A master node has 4 components.
1. **API Server**
	- At the heart of the Master Node is the API Server, serving as the *primary entry point for all communication* within the cluster. This includes CLI or GUI based interfaces, 3rd party kubernetes management tools or even inter-node communications.
	- This component *exposes the Kubernetes API*, receiving requests and facilitating interactions between various entities. 
	- It acts as the *central hub for communication*, validating and processing requests.
	- It *enforces security* measures through *authentication*, *authorization*, and *admission control*.
2. **Controller Manager**
	- The Controller Manager is tasked with *overseeing controllers* that *regulate the state of the cluster*.
	- These controllers ensure that the current state aligns with the desired state, managing aspects like *replication*, *endpoints*, and more.
	- Manages various controllers that govern different aspects of the cluster's state such as the *Replication Controller* and *ReplicaSet controller*.
	- This is the entity that ensures that the *current state matches the desired state* defined by users.
3. **Scheduler**
	- The Scheduler is responsible for *making decisions regarding pod placement*. 
	- When a new pod is created, the Scheduler determines the optimal node for deployment based on factors such as *resource requirements*, *affinity*, and *anti-affinity rules*.
	- The scheduler listens for new pod requirements without assigned nodes and then makes decisions on pod placement, optimizing resource utilization.
4. **etcd**
	- Serving as the *distributed key-value store*, etcd is a critical component of the Master Node. It is considered as distributed as in case of more than one master nodes, the etcd is set up as a distributed data store, serving data to other kubernetes master components.
	- It *stores* the *configuration data* of the entire cluster, acting as the source of truth.
	- etcd ensures *consistency* and *fault tolerance*, providing *resilience against node failures*.

> [!TIP]+ Kubernetes Control Plane
> The **Control Plane** is the core system within Kubernetes that is responsible for *maintaining the desired state of the cluster*. It actively *responds to changes* and *makes decisions* to facilitate the *deployment*, *scaling*, and *management of applications* according to user specifications. This authoritative entity acts as a *central interface*, orchestrating various activities within the cluster. Not confined to a single master node, the Control Plane is a *distributed collection of master nodes*, ensuring *redundancy and high availability* while collectively serving the management functionality of the Kubernetes cluster.

> [!NOTE]- Why was docker support suspended by kubernetes?
> 
> ![meme-containerd-and-kubernetes.png](https://patppuccin-assets.r2.cloudflare.com/meme-containerd-and-kubernetes.png)
> 
> The Kubernetes project has made a strategic decision to deprecate Docker as its default container runtime. This decision holds significant implications for both individual users and organizations relying on Kubernetes for container orchestration.
> 
> Initially, Kubernetes exclusively supported Docker as its sole container runtime. However, as the project matured, a growing demand emerged within the community for the ability to support various container runtimes. To address this, Kubernetes shifted its approach towards accommodating Open Containers Initiative (OCI) compatible runtimes, introducing the Container Runtime Interface (CRI) to facilitate interactions between Kubernetes and any container runtime adhering to OCI standards.
> 
> To maintain compatibility with Docker, especially given its widespread usage, Kubernetes introduced the concept of `dockershim`. This served as a compatibility layer, allowing Kubernetes to communicate with Docker through the CRI. Over time, however, maintaining support for Docker through `dockershim` proved to be challenging. The approach introduced complexities and was deemed less efficient compared to direct support for OCI-compliant runtimes like containerd.
> 
> Underlying this decision is the recognition that Docker itself utilizes `containerd` as its core container runtime, and both Docker and containerd adhere to OCI standards. The decision to deprecate Docker reflects the acknowledgment that supporting Docker through `dockershim` was becoming cumbersome and less sustainable in the long run.
> 
> Looking ahead, Kubernetes aims to transition away from Docker as the default container runtime. The focus will shift towards containerd, which is not only Docker's underlying runtime but also a well-established and OCI-compatible container runtime. Users are encouraged to follow migration guidance provided by the Kubernetes community, ensuring a smooth transition from Docker to containerd or other OCI-compatible runtimes.
> 
> This move signifies Kubernetes' commitment to staying aligned with industry standards, fostering compatibility within the broader container ecosystem, and maintaining a modular and adaptable architecture. While users will need to adapt their workflows and tooling to accommodate this change, the overall goal is to enhance the robustness, security, and flexibility of Kubernetes as a container orchestration platform.

##### etcd
- `etcd` serves as a distributed key-value store that is simple, secure and fast. 
- `etcd` plays the following roles in a kubernetes cluster (in the master node).
	- **Data Store for Cluster State** - `etcd` serves as the persistent and distributed data store where Kubernetes stores its configuration data, state information, and metadata. This includes details about nodes in the cluster, configurations, and the state of various Kubernetes objects.
	- **Consistency and Reliability** - It provides strong consistency guarantees, ensuring that all nodes in the Kubernetes cluster have a consistent view of the configuration data. This is crucial for maintaining the integrity and reliability of the entire system.
	- **Distributed System** - `etcd` is designed to be distributed, meaning that it can run on multiple (master) nodes in a Kubernetes cluster. This distribution ensures fault tolerance and high availability, reducing the risk of a single point of failure.
	- **Watch Mechanism** - Kubernetes components and controllers can watch specific keys or directories in `etcd` to be notified of changes. This watch mechanism enables real-time updates to the cluster state and facilitates the dynamic nature of Kubernetes.
- `etcd` uses the *RAFT consensus algorithm* to *achieve distributed consensus* among its nodes. Raft ensures that the data stored in `etcd` remains *consistent* even in the presence of *node failures* or *network partitions*. 
- `etcd` exposes a simple *HTTP+JSON API*, allowing clients, including Kubernetes components, to interact with it. This API is used for *reading* and *writing* key-value pairs, *watching for changes*, and more.

> [!NOTE]- The RAFT Consensus Algorithm
> Raft is a consensus algorithm designed to achieve distributed consensus in a network of nodes. It was introduced by Diego Ongaro and John Ousterhout in their seminal paper titled "In Search of an Understandable Consensus Algorithm" in 2014. Raft is widely used in distributed systems to ensure that a group of nodes can agree on a single, consistent state despite the possibility of node failures. One of the design goals of Raft was to be more understandable than other consensus algorithms like Paxos. Its simplicity makes it easier for developers to reason about and implement.
>
> Following are the key aspects of the Raft consensus algorithm
> 
> - **Leader Roles and Electing a Leader**
> 	- **Leader Role** - Raft *designates one node* as the *leader* among the group of nodes. The leader is responsible for *coordinating* the *consensus process* and *ensuring* that all *nodes agree* on the *current state*.
> 	- **Leader Elections** - Nodes in the Raft algorithm *periodically exchange heartbeat messages*. If a node *doesn't receive* a heartbeat within a certain time frame, it assumes that the leader is *either unreachable or has failed*. Nodes then *initiate a leader election process* to select a *new leader*.
> - **Log Replication and Consistency**
> 	- **Log Entries** - Raft maintains a log of commands that represent state changes in the system. Each log entry is identified by an index.
> 	- Consistent Log - The leader accepts client requests, appends them to its log, and replicates the entries to followers. Raft ensures that all logs in the system are consistent, meaning all nodes have the same set of entries in the same order.
> 	- **Committing Log Entries** - Once an entry in the log is replicated to a majority of nodes, the leader commits the entry and informs other nodes. This ensures that committed entries are durable and will not be lost, even in the event of leader changes or node failures.
> - **Safety and Progress Guarantees**
> 	- **Safety** - Raft guarantees safety properties, ensuring that once a log entry is committed, it will be present in the logs of all future leaders. This prevents inconsistencies in the distributed system.
> 	- **Progress** - Raft ensures progress by requiring that a leader must be able to contact a majority of nodes in the cluster to make progress. This prevents the system from making progress without consensus.

- High level flow of `etcd` in a Kubernetes cluster
	- **Cluster Bootstrapping** - When a Kubernetes cluster is initialized or a new node joins the cluster, `etcd` is typically bootstrapped to establish the initial configuration.
	- **Cluster Configuration Storage** - Kubernetes components, such as the kube-apiserver, kube-controller-manager, kube-scheduler, and others, interact with `etcd` to store and retrieve configuration data. This data includes information about nodes, pods, services, and other objects.
	- **Ensuring Consensus and HA** - `etcd` ensures consensus among its nodes, providing high availability and fault tolerance. Multiple instances of `etcd` can run on different nodes in the cluster, allowing the system to continue functioning even if some nodes fail.
	- Real-Time Updates

Installing `etcd` can be done by downloading their binaries from their [GitHub releases page](https://github.com/etcd-io/etcd/releases/) and following the installation instructions as provided in their [documentation](https://etcd.io/docs/v3.5). `etcd` is available as a standalone package for MacOS, Linux and Windows Operating Systems. In the context of Kubernetes, the etcd service forms the distributed storage backbone of the kubernetes. 

##### kube-apiserver
- The `kube-apiserver` is a crucial component in the architecture of Kubernetes, serving as the API server for the entire Kubernetes control plane. It exposes the Kubernetes API, which allows users and other components to interact with the Kubernetes cluster.
- The `kube-apiserver` is typically *integrated with* a distributed storage backend like `etcd`. It stores and retrieves the cluster's state from this backend, ensuring consistency and reliability.
- It *communicates* with other *control plane* components, such as the controller manager and scheduler, to ensure the *cluster's desired state* is *maintained* and that new resources are appropriately *scheduled* and *managed*.
- The following are the key responsibilities of the `kube-apiserver`.
	- **API Endpoint** - The `kube-apiserver` is the *primary endpoint* for the Kubernetes control plane API. All *interactions with the cluster*, including *creating*, *updating*, and *deleting* resources, are typically performed through this API server.
	- **Authentication and Authorization** - It handles user authentication and authorization for requests made to the Kubernetes API. This ensures that only *authorized users* and *components* can perform certain *operations within the cluster*. This is done via *token-based authentication*, *client certificates*, and integration with *external identity providers*.
	- **Secure Communication with TLS** - The `kube-apiserver` supports secure communication through *[Transport Layer Security](/Transport%20Layer%20Security) (TLS) certificates*. It terminates TLS connections, *ensuring secure communication* between clients and the API server.
	- **Validation and Admission Control** - The `kube-apiserver` *performs validation* of incoming *requests* to ensure they *adhere* to the *defined schema* and *policies*. Admission control plugins can also be configured to *enforce* additional *policies* or *modify requests* before they are persisted.
	- **Persistence of Cluster State** - The API server interacts with the distributed key-value store, such as `etcd`, to *persistently store* the desired state of the cluster. This includes information about nodes, pods, services, and other Kubernetes objects.
	- **Watch Mechanism** - It provides a watch mechanism that allows clients to *subscribe to changes* in the cluster state. This enables *real-time updates*, with clients *receiving notifications* when changes occur.
	- **Resource Endpoints** - `kube-apiserver` exposes *RESTful endpoints* for various Kubernetes resources. For example, endpoints exist for pods, services, nodes, and other objects, allowing users and controllers to interact with these resources *through HTTP requests*.
- The `kube-apiserver` can be horizontally scaled by deploying *multiple instances* behind a *load balancer*. This helps distribute the load and ensures availability in case of a failure.
- In case of *high availability* configurations, *multiple instances* of the `kube-apiserver` can run in an *active-standby* or *active-active* mode, further enhancing the resilience of the control plane.
- The `kube-apiserver` generates logs that can be crucial for troubleshooting and auditing. Proper logging configurations help administrators and developers understand the state and behavior of the API server.
- Monitoring tools can be integrated to keep track of the `kube-apiserver` metrics, ensuring its health and performance are within acceptable ranges.

##### kube-controller-manager
- The `kube-controller-manager` is a crucial component within the Kubernetes control plane responsible for managing various controllers that *regulate the state* of the cluster. 
- The `kube-controller-manager` interacts with the Kubernetes API server to retrieve the current state of the cluster and to watch for changes.
- To observe and reconcile the state of the cluster, controllers within the `kube-controller-manager` interact with the distributed key-value store, usually `etcd`. This ensures that the desired state is persisted and consistent across the cluster.
- The following are the key responsibilities of the  `kube-controller-manager`
	- **Controller Lifecycle Manager** - The primary responsibility of the `kube-controller-manager` is to manage and oversee various controllers that are responsible for regulating the state of the cluster. Examples of controllers include the Node Controller, Replication Controller, and Endpoint Controller.
	- **Cluster State Reconciliation** - Controllers continuously watch the desired state of the cluster, as stored in the distributed key-value store (e.g., `etcd`). If there are differences between the desired state and the observed state, controllers take corrective actions to reconcile the two.
	- **Node Controller** - The Node Controller ensures that the observed state of nodes (machines) in the cluster aligns with the desired state. It handles tasks such as detecting node failures, additions, and terminations.
	- **Replication Controller and ReplicaSet Controller** - The Replication Controller (legacy) and ReplicaSet Controller (modern replacement) are responsible for ensuring the desired number of pod replicas is maintained. They scale pods up or down based on the defined specifications.
	- **Service Account and Token Controller** - Manages the lifecycle of service accounts and associated tokens, ensuring that pods have the necessary identities and access to Kubernetes resources.
	- **Endpoint Controller** - Maintains Endpoints objects, which represent the sets of IPs and ports available for accessing services. The Endpoint Controller updates Endpoints based on changes in service selectors.
	- **Namespace Controller** - Ensures that all the required resources within namespaces are created and properly configured.
- For high availability scenarios, multiple instances of the `kube-controller-manager` can be deployed where each instance manages a specific set of controllers, and the load can be distributed to achieve scalability.
- The `kube-controller-manager` generates logs that are crucial for diagnosing issues, understanding controller behavior, and auditing changes within the cluster.
- Monitoring tools can be integrated to track metrics related to the `kube-controller-manager`. This helps administrators ensure the health and performance of the controllers.
- Kubernetes allows the development of custom controllers to meet specific requirements. These controllers can be run alongside the built-in controllers within the `kube-controller-manager`.

#### Worker Node

Worker nodes form the *foundation* of a Kubernetes cluster, *executing* and *managing* the *containers* that make up the applications. They play a crucial role in realizing the desired state set by the Control Plane, and their proper functioning ensures the efficient operation of the entire system. In short, this is where the actual containers and thereby the applications deployed (workload) runs. A worker node has 3 main components.
1. **Kubelet**
	- Kubelet acts as the node-level supervisor, ensuring containers are running in a Pod.
	- It listens for instructions from the Control Plane (via the API Server) to start and stop containers.
	- It also reports the status of the node such as resource (CPU, memory) utilization, back to the control plane (again, via the API server)
2. **Container Runtime**
	- Container runtimes are the entities that execute and manage the actual containers as per the instructions from Kubelet.
	- It pulls the container images from the container repositories as per the instruction from the kubelet.
	- It runs container based on the specifications defined in pods.
	- Any container runtimes that follow the OCI spec can be used as the container runtime. Some of the most popular choices include *[containerd](/containerd)* and *[Docker](../Docker/index.md)*. 
3. **Kube proxy**
	- Kube proxy maintains the network rules on nodes
	- It serves as the communications channel across the kubernetes cluster facilitating communication between pods across the cluster.
	- It manages the efficient routing of traffic to the intended pod.

| Consideration Category | Master Nodes Considerations | Worker Nodes Considerations |
| ---- | ---- | ---- |
| **High Availability** | Deploy multiple Master Nodes for redundancy and fault tolerance. Generally odd numbers of Master Nodes (e.g., 3 or 5) are recommended to avoid split-brain scenarios. | Deploy multiple worker nodes to distribute the application workload and improve availability. |
| **API Server Load Balancing** | Implement load balancing for the API Server to distribute requests evenly. It enhances availability by ensuring that requests can be handled by any available Master Node. | Enhances availability by ensuring that requests can be handled by any available Master Node. |
| **Resource Allocation** | Allocate sufficient resources to Master Nodes based on cluster size and requirements. Adequate resources ensure the smooth functioning of control plane components. | Allocate sufficient resources to worker nodes based on the resource requirements of the running containers. |
| **Network Connectivity** | Ensure robust network connectivity between Master Nodes. Low-latency, high-bandwidth communication is crucial for effective coordination. | Low-latency, high-bandwidth communication is crucial for effective coordination. |
| **Backup and Restore Procedures** | Establish backup and restore procedures for etcd. Regular backups mitigate the risk of data loss or corruption, aiding recovery. | Regular backups mitigate the risk of data loss or corruption, aiding recovery. |
| **Security Measures** | Implement security measures to protect Master Nodes from unauthorized access. Regularly update and patch both the operating system and Kubernetes components to address security vulnerabilities. | Regularly update and patch both the operating system and Kubernetes components to address security vulnerabilities. |
| **Monitoring and Logging** | Set up monitoring and logging for Master Nodes. Monitor API Server, Controller Manager, Scheduler, and etcd for performance metrics and errors. |  |
| **Isolation from Workload** | Avoid running application workloads, Kubelet, and Container Runtime on Master Nodes. Isolating Master Nodes enhances security, stability, and resource management. |  |




