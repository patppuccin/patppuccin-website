---
title: Terraform - The Platform-agnostic IaC Tool
description: About Terraform, the Infrastructure as Code (IaC) platform from Hashicorp
tags:
publish: true
---
**Terraform** is an [Infrastructure as Code](./Infrastructure-as-Code.md) tool by [HashiCorp](../../HashiCorp.md) for building, changing, and versioning infrastructure safely and efficiently. It applies software engineering best practices to infrastructure management with features such as versioning, collaboration, and automation, treating infrastructure the same way developers treat application code.

Before tools like Terraform, infrastructure was provisioned manually through cloud consoles, custom scripts, or click-ops workflows. These approaches were error-prone, difficult to reproduce, and nearly impossible to audit or roll back reliably.

Terraform was introduced in **2014** by **Mitchell Hashimoto**, co-founder of [HashiCorp](../../HashiCorp.md), as an open-source tool for provisioning and managing infrastructure across any cloud provider. It uses a declarative configuration language termed as *HashiCorp Configuration Language* or *[HCL](HCL.md)* to describe the desired state of infrastructure, leaving Terraform to determine how to get there.

Today, Terraform is the *de facto standard* for infrastructure as code across the industry. It is *provider agnostic*, supporting hundreds of cloud providers, SaaS platforms, and internal services through a rich ecosystem of plugins. The project is actively maintained by HashiCorp and has a large open-source community. An open-source fork, [OpenTofu](https://opentofu.org/), was established in **2023** under the *Linux Foundation* following HashiCorp's license change from MPL to BSL.

## The Fundamentals

### The Basics

Infrastructure has always had the need to be provisioned, configured, and maintained. Traditionally, this meant logging into a cloud console, clicking through wizards, running ad-hoc shell scripts, or SSHing into servers and making changes by hand. This approach works for one server. It breaks down fast at any meaningful scale.

The core problems with manual infrastructure management are:

- **It is not reproducible** - Manual click-ops to set up production is 
  rarely documented well enough to recreate exactly.
- **It is not auditable** - There is no reliable history of what changed, when, why and by whom.
- **It drifts** - Servers and resources modified manually diverge from each other over time, leading to the classic *"works on one server, breaks on another"* problem.
- **It does not scale** - Provisioning ten servers manually is tedious. Provisioning a hundred is dangerous.
- **It is not collaborative** - There is no clean way for a team to review, approve, and track infrastructure changes the way they would with application code.

Terraform solves this by treating infrastructure as code. Instead of clicking through a console or running imperative scripts, the desired state of the infrastructure is described in configuration files. Terraform reads those files, compares them against what actually exists (state), and figures out exactly what needs to be created, changed, or destroyed to reach that desired state. The result is infrastructure that is **version controlled**, **reproducible**, **auditable**, and **consistent** across environments.

> [!INFO] Infrastructure as Cattle, Not Pets
> Traditional infrastructure treated servers like **pets** by naming them cool names, hand-configuring them and carefully maintaining them. This makes them irreplaceable. However, Terraform (and other IaC tools) encourage treating infrastructure like **cattle**,  identical, disposable and replaceable. When something breaks, it is not fixed, rather destroyed and a new infrastructure is provisioned with a *sane configuration* in its place.
>
> This mindset is what makes IaC powerful. If every server is defined in code and reproducible on demand, nothing is precious.

> [!INFO] Infrastructure as Code is not just about automation
> The bigger benefit of IaC is not speed, but **confidence**. When infrastructure is defined in code, it can be reviewed, tested, and rolled back just like application code. This changes infrastructure from a source of unpredictable risk into a controlled and predictable system.

#### Declarative vs Imperative

There are two fundamental approaches to defining infrastructure: **declarative** and **imperative**.

**Imperative** means describing *how* to get somewhere via a sequence of steps a tool must execute in order to achieve the desired state.

```bash
# Example of an imperative IaC: shell script invoking AWS CLI
aws ec2 run-instances --image-id ami-abc123 --instance-type t3.micro
aws ec2 create-tags --resources i-xyz --tags Key=Name,Value=web-server
```

The problem with imperative approaches is that they describe *actions*, not *outcomes*. Running the same script twice creates two servers. The script has no awareness of what already exists.

**Declarative** means describing *what* you want (the intent), described as the desired end state. The tool then figures out how to get to there.

```hcl
# Declarative example — Terraform
resource "aws_instance" "web" {
  ami           = "ami-abc123"
  instance_type = "t3.micro"

  tags = {
    Name = "web-server"
  }
}
```

Running this configuration twice does not create two servers. Terraform checks what already exists, sees the server is already there, and does nothing. This property is called **idempotency**, which means even if the same configuration  applied multiple times, it always produces the same result.

> [!INFO] Declarative does not mean magic
> Terraform still executes real API calls to create, update, and destroy resources. The declarative syntax just means that the tool does not require a sequential instruction provided by the user to orchestrate the order and logic of those calls. Terraform handles that through its dependency graph (discussed later).

#### How It Compares to Other IaC Tools

Terraform is not the only infrastructure provisioning tool available. The table below compares it against the most commonly encountered alternatives.

|                 | Terraform                | Ansible              | Pulumi                         | CloudFormation               |
| --------------- | ------------------------ | -------------------- | ------------------------------ | ---------------------------- |
| Primary purpose | Provision infrastructure | Configure systems    | Provision infrastructure       | Provision AWS infrastructure |
| Language        | HCL (declarative DSL)    | YAML (imperative)    | Python, Go, TypeScript         | YAML / JSON                  |
| State tracking  | Yes, via state file      | No built-in state    | Yes, via state file            | Yes, via AWS                 |
| Cloud support   | Multi-cloud              | Multi-cloud          | Multi-cloud                    | AWS only                     |
| Learning curve  | Low to moderate          | Low                  | Moderate (depends on language) | Moderate                     |
| Best suited for | Multi-cloud IaC, teams   | Server configuration | Developer-heavy teams          | AWS-native workflows         |

Terraform and Ansible are frequently used together rather than as substitutes. Terraform provisions the infrastructure and Ansible handles what runs on it. Pulumi is the closest direct competitor, differing primarily in that it uses general-purpose programming languages instead of a dedicated DSL. CloudFormation is worth knowing about for AWS-native environments but offers no multi-cloud story.

#### When NOT to Use Terraform

Terraform is a powerful tool, but it is not the right choice for every situation.

- **Single, simple server management** - The overhead of state files, backends, and HCL configuration is not justified for a single VPS or a small number of manually managed servers.
- **Software configuration on existing servers** - Terraform is a provisioning tool, not a configuration management tool. Software installation, service configuration, and runtime management are better handled by Ansible, Chef, or cloud-init.
- **Rapidly and frequently changing infrastructure** - The plan/apply cycle introduces friction that may not suit workflows where infrastructure changes need to happen quickly and continuously without a review gate.
- **Teams with no IaC experience under time pressure** - Terraform has a real learning curve. For quick, one-off deployments, a cloud provider's native CLI or console may be the more pragmatic choice until the team is ready to invest in IaC properly.
- **Strictly single-provider environments** - When all infrastructure lives within one provider's ecosystem, native tools such as CloudFormation on AWS or ARM templates on Azure may offer deeper integration with provider-specific features and services.

> [!WARNING] Terraform is not a silver bullet
> Adopting Terraform introduces real operational overhead such as state management, backend configuration, module versioning, and pipeline integration. It is important to understand the complexity and ensure it is justified by the scale and longevity of the project as well as the skillset required to manage it.

### Core Concepts

Terraform configurations are built from a set of well-defined building blocks. Understanding what each one is and how they relate to each other is essential before writing any meaningful configuration.

#### Providers

A provider is a plugin that allows Terraform to interact with a specific platform or service via its API. Every resource in a Terraform configuration belongs to a provider. Without a provider, Terraform has no way to communicate with the target infrastructure.

Providers are binaries that are distributed separately from Terraform itself and are downloaded during `terraform init` step (discussed later). They are versioned independently, and pinning provider versions is considered a best practice to avoid unexpected breaking changes.

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
```

In Terraform, provider versions are pinned using version constraint strings inside the `required_providers` block. The constraint syntax comes from HCL and follows a standard set of operators. Version constraint operators work as follows

| Operator    | Meaning                | Example    |
| ----------- | ---------------------- | ---------- |
| `=`         | Exact version only     | `= 5.0.0`  |
| `!=`        | Exclude THIS version   | `!= 5.0.1` |
| `> >= < <=` | Comparison operators   | `>= 5.0.0` |
| `~`         | Pessimistic constraint | `~> 5.0`   |

> [!INFO] The pessimistic constraint operator
> The pessimistic constraint operator denoted with a `~` is the one that is most often used. It allows the rightmost version component to increment freely, while locking everything to the left.
> 
> For example,
> - `~> 5.0` allows `5.0`, `5.1` ... `5.9` ... `5.124` but not `6.0`
> - `~> 5.0.0` allows `5.0.1`, `5.0.2` ... `5.0.9` ... `5.0.124` but not `5.1.0`

> [!TIP] Recommended practice for version pinning
> - Usually for providers, `~> major.minor` is the standard practice. This allows patch updates automatically but blocks breaking major version changes.
> - For modules (discussed later), pinning to an exact version number is the best practice. Modules change more intentionally than providers, hence a exact version pinning makes it safer with the upgrades being explicit.

The [Terraform Registry](https://registry.terraform.io/browse/providers) hosts hundreds of officially maintained and community providers, covering major cloud platforms, SaaS services, databases, DNS providers, and more.

> [!INFO] Providers are not just for cloud platforms
> Providers exist for a wide range of targets beyond cloud infrastructure, including GitHub, PagerDuty, Datadog, Kubernetes, Vault, and even local utilities. If a service has an API, there is likely a Terraform provider for it.

#### Resources

A resource is the most fundamental building block in Terraform. It represents a single infrastructure object such as a virtual machine, a storage bucket, a DNS record, a database, a firewall rule, or any other manageable unit of infrastructure.

Resources are declared using a `resource` block, with two labels, *the resource type* and *a local name* used to reference it elsewhere in the configuration.

```hcl
resource "aws_s3_bucket" "media_store" {
  bucket = "acme-media-uploads"

  tags = {
    Environment = "production"
    Team        = "platform"
  }
}
```

Here `aws_s3_bucket` is the resource type defined by the AWS provider, and `media_store` is the local name used to reference this specific bucket elsewhere in the configuration. Terraform manages the full lifecycle of a resource starting from its creation, to any updates, and finally to the destruction of the resource based on how the configuration changes over time.

> [!WARNING] Resource names are local to Terraform
> The local name given to a resource (such as `media_store` above) is only meaningful within the Terraform configuration. It is not the name of the actual resource created in the cloud. The actual name is typically set via an argument like `bucket`, `name`, or `id` depending on the resource type.

#### Data Sources

A data source allows Terraform to read information about existing infrastructure that is not managed by the current configuration. Data sources are useful for referencing shared infrastructure, looking up dynamic values, or consuming outputs from another Terraform configuration.

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-22.04-amd64-server-*"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}
```

The `data.aws_ami.ubuntu.id` reference fetches the latest Ubuntu AMI ID at plan time without hardcoding it into the configuration.

> [!INFO] Data sources are read-only
> Terraform never creates, modifies, or destroys infrastructure through a data source. They are purely a mechanism for querying and referencing existing state from within a configuration.

#### Variables

Variables are the input parameters of a Terraform configuration. They allow *values to be passed in from outside the configuration*, making it reusable across different environments and contexts without modifying the underlying code.

```hcl
variable "instance_type" {
  type        = string
  description = "EC2 instance type to use for the web server"
  default     = "t3.micro"
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
}
```

Variables are referenced in configuration using the `var.` prefix followed by the variable name.

Terraform variables support the following types:

1. **Primitive Types**
	- `string` - A character sequence
	- `number` - A numeric value, including both integer and floating point values
	- `bool` - A boolean value, either *true* or *false*
2. **Collection Types**
	- `list(type)` - An ordered sequence of values of the same type, accessed by index
	- `map(type)` - A set of key-value pairs where all values share the same type, accessed by key
	- `set(type)` - An unordered collection of unique values of the same type
3. **Structural Types**
	- `object({...})` - a collection of named attributes each with their own type, similar to a struct
	- `tuple([...])` — an ordered sequence of values where each element can have a different type

```hcl
# Primitive types
variable "name"              { type = string }
variable "instance_count"    { type = number }
variable "enable_monitoring" { type = bool   }

# Collection types
variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

variable "tags" {
  type = map(string)
  default = {
    Environment = "production"
    Team        = "platform"
  }
}

variable "allowed_ports" {
  type    = set(number)
  default = [80, 443]
}

# Structural types
variable "database" {
  type = object({
    name     = string
    port     = number
    multi_az = bool
  })
  default = {
    name     = "acme-db"
    port     = 5432
    multi_az = true
  }
}

variable "server_config" {
  type    = tuple([string, number, bool])
  default = ["t3.micro", 8080, true]
}
```

Variables support custom validation rules that catch invalid values before a plan is attempted. Validation is defined inside a validation block within the variable declaration, using two required arguments, a `condition` and an `error_message`. 

The `condition` is an expression that must evaluate to true for the value to be accepted. The `error_message` is the message shown to the user when validation fails. It must be a complete sentence ending with a period.

```hcl
variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"

  validation {
    condition     = contains(["t3.micro", "t3.small", "t3.medium"], var.instance_type)
    error_message = "instance_type must be one of t3.micro, t3.small, or t3.medium."
  }
}
```

Conditions can use any *Terraform expression* or *built-in function* as long as they reference only the variable being validated using `var.<name>`. Common patterns include:

```hcl
# Validate string format using regex
variable "environment" {
  type = string

  validation {
    condition     = can(regex("^(development|staging|production)$", var.environment))
    error_message = "environment must be development, staging, or production."
  }
}

# Validate numeric range
variable "instance_count" {
  type = number

  validation {
    condition     = var.instance_count >= 1 && var.instance_count <= 10
    error_message = "instance_count must be between 1 and 10."
  }
}
```

Multiple validation blocks can be defined on a single variable, each enforcing a separate rule with its own error message. Terraform evaluates all of them and reports every failure, not just the first one encountered.

>[!INFO] Validation runs before plan
>Variable validation is evaluated before Terraform contacts any provider or reads state. It is a cheap, fast gate that catches bad input early, before any API calls are made to the provider.

Variables that hold secrets, passwords, or other sensitive values should be marked as sensitive. Terraform will redact their values from plan and apply outputs.

```hcl
variable "db_password" {
  type      = string
  sensitive = true
}
```

> [!WARNING] Sensitive variables are still stored in state
> Marking a variable as sensitive prevents it from appearing in terminal output, but the value is still written to the state file in plain text. The state file must be treated as sensitive material regardless of whether sensitive variables are used.

Variable values can be supplied in several ways, listed here in order of precedence from highest to lowest:

1. **HCP Terraform workspace variables** and **`-var` / `-var-file`** flags on the command line, in the order provided
2. **`*.auto.tfvars`** and **`*.auto.tfvars.json`** files in lexical order
3. **`terraform.tfvars.json`** file loaded automatically
4. **`terraform.tfvars`** file loaded automatically
5. **Environment variables** prefixed with `TF_VAR_`
6. **Default value** defined in the variable block

```bash
# Passing a value via command line flag
terraform apply -var="instance_type=t3.small"

# Passing a values file explicitly
terraform apply -var-file="production.tfvars"

# Passing via environment variable
export TF_VAR_instance_type="t3.small"
terraform apply
```

A typical `.tfvars` file for a production environment might look like this:

```hcl
instance_type      = "t3.medium"
instance_count     = 3
enable_monitoring  = true

tags = {
  Environment = "production"
  Team        = "platform"
  CostCentre  = "infra-001"
}
```

> [!WARNING] Never commit sensitive values in .tfvars files
> `.tfvars` files are convenient for managing environment-specific configuration, but they should never contain secrets, passwords, or API keys. Sensitive values should be supplied via environment variables, a secrets manager such as HashiCorp Vault, or injected at pipeline runtime.

#### Locals

Locals are named expressions within a configuration that compute and store intermediate values. Unlike variables, locals cannot be supplied from outside, but are defined and resolved internally within the configuration. Locals are primarily used to avoid repetition, simplify complex expressions, and give meaningful names to computed values.

```hcl
locals {
  environment = "production"
  app_name    = "acme"
  name_prefix = "${local.app_name}-${local.environment}"
}

resource "aws_s3_bucket" "uploads" {
  bucket = "${local.name_prefix}-uploads"
}

resource "aws_s3_bucket" "logs" {
  bucket = "${local.name_prefix}-logs"
}
```

|                               | Variables                                    | Locals                                           |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------ |
| **Source**                    | External, supplied by the caller             | Internal, defined within the configuration       |
| **Purpose**                   | Allow customisation across environments      | Avoid repetition and simplify expressions        |
| **Syntax**                    | `var.name`                                   | `local.name`                                     |
| **Can accept external input** | Yes                                          | No                                               |
| **Supports defaults**         | Yes                                          | N/A — always computed                            |
| **Supports validation**       | Yes                                          | No                                               |
| **Sensitive flag**            | Yes                                          | No                                               |
| **When to use**               | Value changes based on environment or caller | Value is derived, computed, or shared internally |

#### Outputs

Outputs expose values from a Terraform configuration after an apply. Outputs serve two primary purposes
1. Surfacing useful information to the caller
2. Passing values between configurations or modules.

```hcl
output "bucket_name" {
  description = "Name of the uploads S3 bucket"
  value       = aws_s3_bucket.uploads.bucket
}

output "instance_public_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web.public_ip
}
```

After `terraform apply`, outputs are printed to the terminal and can be queried at any time using `terraform output`.

> [!INFO] Outputs are essential for modules
> When building reusable modules, outputs are the mechanism through which a module exposes its results to the calling configuration. A module with no outputs is effectively a black box.

#### Meta-Arguments

Meta-arguments are special arguments available on every `resource` block regardless of the provider or resource type. They are not defined by the provider schema, but are part of the HCL language itself and control how Terraform manages the lifecycle and behaviour of a resource. [Documentation for meta-arguments can be found here](https://developer.hashicorp.com/terraform/language/meta-arguments).

Terraform provides the following meta-arguments:

##### depends_on

`depends_on` declares an explicit dependency between resources when Terraform cannot infer it automatically from attribute references or when an explicit overrides is required. It accepts a list of resource references and ensures the listed resources are fully created before the dependent resource is managed.

```hcl
resource "aws_iam_role_policy" "app_policy" {
  role   = aws_iam_role.app.id
  policy = data.aws_iam_policy_document.app.json

  depends_on = [aws_iam_role.app]
}
```

> [!INFO] Prefer implicit dependencies where possible
> Dependencies inferred from attribute references, called as *implicit dependencies* are cleaner and easier to maintain. `depends_on` should only be used when a real dependency exists that Terraform cannot detect on its own, such as a dependency on a side effect rather than an output value.

##### count

`count` creates multiple instances of a resource from a single block. It accepts a whole number and produces that many identical copies of the resource, each identified by an index.

```hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-abc123"
  instance_type = "t3.micro"

  tags = {
    Name = "web-server-${count.index}"
  }
}
```

Each instance is referenced using its index, for example `aws_instance.web[0]`, `aws_instance.web[1]`, and `aws_instance.web[2]`.

> [!INFO] count is best for truly identical resources
> When resources differ only by index, `count` is the appropriate method to create the resources. When resources differ meaningfully such as by name, region or configuration, then `for_each` is the better choice.

##### for_each

`for_each` creates multiple instances of a resource from a map or set of strings. Unlike `count`, each instance is identified by a meaningful key rather than a numeric index, making the configuration more readable and the state more stable.

```hcl
resource "aws_s3_bucket" "env_buckets" {
  for_each = toset(["development", "staging", "production"])

  bucket = "acme-${each.key}"

  tags = {
    Environment = each.key
  }
}
```

Each instance is referenced using its key, for example `aws_s3_bucket.env_buckets["production"]`.

##### provider

`provider` overrides which provider configuration a resource uses. It is relevant in configurations that manage infrastructure across multiple accounts, regions, or environments using aliased provider configurations.

```hcl
provider "aws" {
  alias  = "us_west"
  region = "us-west-2"
}

resource "aws_instance" "west_web" {
  provider      = aws.us_west
  ami           = "ami-abc123"
  instance_type = "t3.micro"
}
```

Without the `provider` meta-argument, the resource uses the default provider configuration for its type.

##### lifecycle

`lifecycle` controls how Terraform handles the creation, update, and deletion of a resource. It accepts a block with several arguments that modify default terraform workflow. Unlike other meta-arguments, lifecycle arguments cannot reference values from other resources or use expressions, hence they must be static & literal values.

**`create_before_destroy`**

By default, when resources are to be replaced, terraform destroys the existing resource first and then recreates the resource with the changes applied. This is done in cases where an in-place update is not possible. `create_before_destroy` reverses this order, provisioning the new resource before the old one is removed.

```hcl
resource "aws_instance" "web" {
  ami           = "ami-abc123"
  instance_type = "t3.micro"

  lifecycle {
    create_before_destroy = true
  }
}
```

This is particularly useful for resources that serve live traffic, such as EC2 instances behind a load balancer or DNS records, where destroying first would cause downtime.

> [!INFO] create_before_destroy propagates to dependencies
> When `create_before_destroy` is set on a resource, Terraform automatically applies the same behaviour to all resources that depend on it. This can have unintended consequences in complex dependency graphs and is worth verifying with a plan before applying.

**`prevent_destroy`**

`prevent_destroy` causes Terraform to reject any plan that would result in the destruction of the resource. It is a safeguard for critical infrastructure that should never be accidentally removed.

```hcl
resource "aws_db_instance" "primary" {
  identifier     = "acme-primary-db"
  engine         = "postgres"
  instance_class = "db.t3.medium"

  lifecycle {
    prevent_destroy = true
  }
}
```

Attempting to destroy this resource via a configuration change will produce an error and halt the plan. Common candidates for `prevent_destroy` include production databases or KMS keys.

> [!WARNING] prevent_destroy does not protect against all destroy paths
> `prevent_destroy` only blocks destruction that results from a configuration change, as in case when a resource must be replaced. Running `terraform destroy` directly or removing the resource block entirely from the configuration will still destroy the resource. It is a guardrail, not a hard lock.
 
**`ignore_changes`**

`ignore_changes` instructs Terraform to ignore drift on specific resource attributes, preventing it from attempting to revert changes made outside of Terraform for those fields. It accepts a list of attribute names.

```hcl
resource "aws_instance" "web" {
  ami           = "ami-abc123"
  instance_type = "t3.micro"
  
  tags {
    Env = "Staging"
    OU  = "Infrastructure Services"
  }

  lifecycle {
    ignore_changes = [ami, tags]
  }
}
```

This is useful when certain attributes are managed by an external process — for example, an autoscaling group that updates the AMI on instances, or a tagging pipeline that applies cost allocation tags outside of Terraform.

To ignore all attributes, `ignore_changes = all` can be used, though this effectively removes Terraform's ability to manage the resource and should be used sparingly.

```hcl
lifecycle {
  ignore_changes = all
}
```

> [!WARNING] ignore_changes masks real drift
> Ignoring changes means Terraform will never reconcile those attributes back to the configuration. If the external process that manages those fields breaks or produces unexpected values, Terraform will not detect or report it. Use `ignore_changes` only when the external management is minimal, intentional and reliable.

**`replace_triggered_by`**

`replace_triggered_by` forces a resource to be replaced when any of the listed resources or attributes change, even if the resource itself has not changed. It accepts a list of resource references or specific attribute references.

```hcl
resource "aws_instance" "web" {
  ami           = "ami-abc123"
  instance_type = "t3.micro"

  lifecycle {
    replace_triggered_by = [aws_security_group.web.id]
  }
}
```

Here, if `aws_security_group.web` is replaced for any reason, `aws_instance.web` will also be replaced on the next apply even if its own configuration has not changed.

**`precondition` and `postcondition`**

`precondition` and `postcondition` blocks allow assertions to be defined on resources and data sources. A `precondition` is evaluated before the resource is created or updated. A `postcondition` is evaluated after.

```hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  lifecycle {
    precondition {
      condition     = var.instance_type != "t2.micro"
      error_message = "t2.micro is not supported. Use t3.micro or higher."
    }

    postcondition {
      condition     = self.public_ip != ""
      error_message = "Instance did not receive a public IP address."
    }
  }
}
```

`precondition` and `postcondition` blocks are a powerful way to encode assumptions and guarantees directly into the configuration, surfacing failures with clear, actionable error messages rather than silent misconfigurations.

#### Expressions

Expressions are used throughout Terraform configuration to compute and reference values. Any argument that accepts a value — whether in a resource, variable, local, or output block — accepts an expression. Expressions range from simple literal values to complex computed references.

##### Literal Values

The simplest expressions are literal values written directly into the configuration.

```hcl
# String literal
name = "acme-web-server"

# Number literal
port = 8080

# Boolean literal
enable_monitoring = true

# List literal
availability_zones = ["us-east-1a", "us-east-1b"]

# Map literal
tags = {
  Environment = "production"
  Team        = "platform"
}
```

---

##### References

References allow one part of the configuration to read values from another. They are the primary mechanism for wiring resources, variables, locals, outputs, and data sources together.

```hcl
# Referencing a variable
instance_type = var.instance_type

# Referencing a local value
bucket_name = local.name_prefix

# Referencing a resource attribute
bucket = aws_s3_bucket.uploads.id
arn    = aws_s3_bucket.uploads.arn

# Referencing a data source attribute
ami = data.aws_ami.ubuntu.id

# Referencing a module output
vpc_id = module.vpc.vpc_id
```

---

##### String Interpolation

String interpolation allows expressions to be embedded inside string values using the `${}` syntax.

```hcl
locals {
  app_name    = "acme"
  environment = "production"
  name_prefix = "${local.app_name}-${local.environment}"
}

resource "aws_s3_bucket" "uploads" {
  bucket = "${local.name_prefix}-uploads"
}
```

Terraform also supports multi-line string templates using heredoc syntax.

```hcl
user_data = <<-EOF
  #!/bin/bash
  echo "Deploying ${local.app_name} in ${local.environment}"
  apt-get update -y
  apt-get install -y nginx
EOF
```

---

##### Arithmetic and Logical Operators

Terraform supports standard arithmetic and logical operators for computing values inline.

```hcl
locals {
  # Arithmetic
  total_instances = var.instance_count * 2
  next_port       = var.base_port + 1

  # Logical
  is_production   = var.environment == "production"
  enable_backups  = var.environment == "production" || var.environment == "staging"
  skip_monitoring = !var.enable_monitoring
}
```

---

##### Conditional Expressions

Conditional expressions follow a ternary pattern — a condition, a value if true, and a value if false.

```hcl
# Syntax: condition ? value_if_true : value_if_false

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.environment == "production" ? "t3.medium" : "t3.micro"

  monitoring = var.environment == "production" ? true : false
}
```

Conditionals are commonly used to vary resource configuration based on environment, feature flags, or input variables.

---

##### for Expressions

`for` expressions transform one collection into another. They can produce either a list or a map depending on the bracket type used.

```hcl
locals {
  # Produce a list — square brackets
  upper_zones = [for zone in var.availability_zones : upper(zone)]

  # Produce a map — curly brackets
  bucket_arns = {for name, bucket in aws_s3_bucket.env_buckets : name => bucket.arn}

  # Filter with an if clause
  prod_buckets = [for name, bucket in aws_s3_bucket.env_buckets : bucket.id if name == "production"]
}
```

---

##### Splat Expressions

Splat expressions provide a concise way to extract a single attribute from all instances of a resource created with `count` or `for_each`.

```hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}

output "all_instance_ids" {
  # Equivalent to [for instance in aws_instance.web : instance.id]
  value = aws_instance.web[*].id
}
```

---

##### Dynamic Blocks

Dynamic blocks allow repeatable nested blocks within a resource to be generated programmatically from a collection, avoiding repetition when the number of blocks is variable.

```hcl
variable "ingress_rules" {
  type = list(object({
    port        = number
    protocol    = string
    cidr_blocks = list(string)
  }))
}

resource "aws_security_group" "web" {
  name = "acme-web-sg"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

> [!INFO] Dynamic blocks are powerful but reduce readability
> Dynamic blocks are best used when the number of nested blocks genuinely varies based on input. For a fixed, known set of blocks, writing them explicitly is clearer and easier to review.

#### State

State is how Terraform keeps track of the infrastructure it manages. After every apply, Terraform writes the current state of all managed resources to a state file, typically named `terraform.tfstate`.

The state file serves as the source of truth for what Terraform believes exists in the real world. During a plan, Terraform compares the desired state in the configuration against the recorded state in the file, and generates a diff of what needs to change.

State is what makes Terraform's declarative model work in practice. Without it, Terraform would have no way to determine what already exists and would attempt to recreate everything on every apply.

> [!DANGER] Never edit the state file manually
> The state file is managed exclusively by Terraform. Manual edits can corrupt the state, cause resources to be orphaned, or result in Terraform attempting to destroy and recreate infrastructure unexpectedly. State manipulation, when necessary, is done through `terraform state` commands.

> [!WARNING] State contains sensitive data
> The state file stores all resource attributes, including secrets, passwords, and private keys returned by providers. It must be treated as sensitive material, stored securely, and never committed to version control.

#### Backends

A backend defines where Terraform stores its state file. By default, state is stored locally on disk in the working directory. In any environment where more than one person works with the same infrastructure, a remote backend is required.

Remote backends store state in a central, shared location and typically provide state locking, a mechanism that prevents two operations from modifying state simultaneously and causing corruption.

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.38"
    }
  }
  backend "s3" {
    bucket       = "acme-tf-state"
    key          = "learn/03-variables-locals-output/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

The most common remote backend pattern is AWS S3 along with state locking enabled. Other options include Azure Blob Storage, Google Cloud Storage, and HCP Terraform.


> [!] No more DynamoDB
> Contents


> [!INFO] Local backend is fine for learning
> The local backend requires no configuration and works out of the box, making it suitable for personal experimentation. It is not appropriate for shared or production environments due to the lack of locking and the risk of state loss.

#### Modules

A module is a container for a set of related Terraform resources. Every Terraform configuration is technically a module — the root module. Additional child modules can be created to encapsulate reusable patterns and called from the root or from other modules.

Modules are the primary mechanism for code reuse in Terraform. A well-designed module accepts input variables, manages a set of resources internally, and exposes outputs for the calling configuration to consume.

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "acme-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
}
```

> [!INFO] Modules are covered in depth later
> A full treatment of writing, structuring, versioning, and consuming modules is covered in the [Modules](Modules.md) section under Getting Production Ready.

---

#### The Dependency Graph

Terraform builds a dependency graph from the configuration before executing any operation. This graph represents the relationships between resources and determines the order in which they are created, updated, or destroyed.

Dependencies are resolved in two ways:

- **Implicit dependencies** are inferred automatically when one resource references an attribute of another. Terraform detects the reference and ensures the referenced resource exists before the dependent one is created.
- **Explicit dependencies** are declared manually using the `depends_on` argument when a dependency exists that Terraform cannot infer from attribute references alone.

```hcl
resource "aws_s3_bucket" "uploads" {
  bucket = "acme-uploads"
}

resource "aws_s3_bucket_policy" "uploads_policy" {
  bucket = aws_s3_bucket.uploads.id  # implicit dependency

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.uploads.arn}/*"
    }]
  })
}
```

Because `aws_s3_bucket_policy` references `aws_s3_bucket.uploads.id`, Terraform automatically knows the bucket must exist before the policy can be attached. Resources with no dependencies between them are provisioned in parallel.

> [!INFO] Visualising the dependency graph
> The dependency graph for any configuration can be exported and visualised using `terraform graph`. The output is in DOT format and can be rendered with tools like Graphviz. This is useful for understanding and debugging complex configurations.
### Terraform Architecture

![Terraform-Architecture.png](https://patppuccin-assets.r2.cloudflare.com/Terraform-Architecture.png)

1. **Terraform Configuration Files (.tf)**
    - Configuration files are written in *HashiCorp Configuration Language (HCL)* which is similar to JSON.
    - These files *define the desired state* of your infrastructure, specifying the resources, their properties, and dependencies.
    - These configuration files have an extension of `.tf`
    - Configuration files are the heart of Terraform. They describe what infrastructure should be created or modified.
    - Services such as [VCS](/Version%20Control%20System) can be integrated to the configuration files to make collaboration possible and easier.
2. **Terraform CLI (Command-Line Interface)**
    - The Terraform CLI is the primary tool for *interacting with Terraform*.
    - The terraform CLI is written in [Golang](./Golang.md).
    - It provides various commands for *initializing*, *planning*, *applying* changes, and more.
    - The CLI is how users interact with Terraform, executing commands to manage infrastructure.
3. **Providers**
    - Providers are plugins that *enable Terraform to communicate* with specific infrastructure platforms or services (e.g., AWS, Azure, Google Cloud, Docker) via API calls to the respective resources.
    - Each provider has its own set of resources and data sources.
    - Providers act as *intermediaries between Terraform and the target infrastructure*, allowing Terraform to create and manage resources.
4. **Terraform Core**
    - The core of Terraform, often referred to simply as "Terraform," *interprets* and *processes* configuration files, manages the state file, performs resource CRUD operations, and handles dependency resolution.
    - It is also written in [Golang](./Golang.md) and comes bundled with the CLI. 
    - Terraform Core is responsible for *orchestrating the entire infrastructure provisioning process*.
5. **State File**
    - Terraform maintains a state file (typically named `terraform.tfstate`) that records the *current state of the infrastructure resources*. It keeps track of resource attributes and their relationships.
    - The state file allows Terraform to determine the *difference between* the *desired* state (from configuration) and the *actual* state (from the state file).
    - It is critical for making changes without disruptions.
    - This file SHOULD NOT be edited manually.
6. **Backends (Local and Remote)**
    - Backend is where the state files are stored.
    - This can be either *local file storage* where the Terraform environment is run or it could be on *remote/cloud* in services such as AWS S3, Azure Blob Storage or even a database.
    - State backends *affect state management and collaboration*.
    - State backends *store state files*, *enable collaboration* on terraform managed infrastructure.
7. **Operations (Local and Remote)**
    - Terraform can perform operations either *locally* where it is installed or *remotely* using a remote execution service such as *Terraform Cloud* or *HashiCorp Consul*.
    - This allows for *collaboration*, *locking*, and remote *state management*.
    - Remote operations *enhance collaboration* and provide additional features like *state locking* to *prevent concurrent changes*.
8. **External Services (Optional)**
    - External services, such as *version control systems* (e.g., Git), *secrets management tools* (e.g., HashiCorp Vault), or *CI/CD pipelines* (e.g., Jenkins), can be integrated with Terraform to enhance its functionality.
    - External services *complement Terraform* by providing version control, secret management, automation, and other capabilities.

### Terraform Lifecycle

A barebones lifecycle of operations that can be carried out in a terraform configuration would consist of the following steps.

**STEP 1 : Initialization (terraform init)**
- Initialization is the first step when working with a new or existing Terraform configuration.
- It *sets up the working directory*, *downloads required provider plugins*, and *prepares the configuration* for use.
- To initialize a terraform project, run `terraform init`
- This command is typically *run only once per project* to prepare it for use.

**STEP 2 : Configuration:**
- Configurations are written in *Hashicorp Configuration Language* or *HCL* in files that end in a `.tf` extension. 
- These files *define the infrastructure* by specifying the resources, their properties, and dependencies.
- These files are *continuously edited* to refine the configuration as per the desired infrastructure state.
- A terraform project can have multiple `.tf` files, and they all will be considered as one singular file when terraform processes the configuration. This allows to logically separate and manage the terraform configuration files.
- A generic terraform project might contain the following files and directories
	- **📄 `.tf`**  - These files *define* infrastructure resources and dependencies.
	- **📄 `.tfvars`**  - These files *provide values* for declared variables used inside the `.tf` files.
	- **📄 `.tfstate`**  - These files *track* the actual *state* of infrastructure.
	- **📄 `.tfstate.backup`**  - These files form the *backup* of the current *state* file.
	- **📄 `.tfstate.lock`**  - This file is used as the *lock* file to prevent *concurrent access*.
	- **📂 `.terraform`**  - This folder (directory) contains *downloaded provider plugins* and internal files.

**STEP 3 : Planning**
- Terraform allows to *visualize the changes* that the current configuration makes by running the `terraform plan` command.
- This command *identifies* the *creation*, *modification*, or *destruction* actions to be made to the resources to match with the currently defined configuration.
- This command can be *run as many times*, as and when changes are made to the configuration files.
- Running this command gives a *glimpse of what changes terraform is about to make* to the existing infrastructure to be in-line with the configuration files.

**STEP 4 : Applying Changes**
- Applying changes is where Terraform *executes the actions outlined in the configuration files*.
- It creates, updates, or destroys resources as needed to reach the desired state.
- This can be performed by running the `terraform apply` command.
- This command can be *run whenever changes to the configuration have been made*.
- However, even if the command is *run multiple times*, the final *state would always be the same*, thus *achieving idempotency*.

**STEP 5 : State Management:**
- Terraform maintains a state file (typically named `terraform.tfstate`) to track the actual state of the infrastructure the configuration file(s) manage. It *records resource attributes and relationships*.
- Terraform *reads and updates the state file* during *apply and plan operations*.
- Terraform uses the state file to *manage infrastructure changes* and *avoid disruptions*.
- This file must *not be edited manually*, as this might lead to some unexpected results.

**STEP 6 : Updating Configuration:**
- As infrastructure requirements evolve, the Terraform configuration files are updated to reflect the desired state.
- Changes might include adding new resources, modifying properties, or removing resources.
- Thus, these configuration files with `.tf` are continuously updated and maintained to be in line with the changing infrastructure needs.
- The updated configurations can be applied by using the `terraform plan` and `terraform apply` commands to review changes and apply them respectively.

**STEP 7 : Destroying Resources**
- When resources are no longer needed, they can be taken down using the `terraform destroy` command to remove them.
- ***CAUTION:** THIS ACTION PERMANENTLY DESTROYS THE RESOURCES*.
- This command is used sparingly, only when the infrastructure is no longer needed.
- Production environments rarely see this command when in use, and this might be used in testing, dev or other environments whenever their purpose is served and they need to be decommissioned.

**STEP 8 : Workspace Management (Optional):**
- Terraform workspaces allow the maintenance of multiple environments such as *development*, *staging*, and *production* with separate state files.
- Each workspace can have its own configuration.
- To manage workspaces, use the following commands
	- `terraform workspace new` - To create a new workspace
	- `terraform workspace select` - To work with a specific workspace
	- `terraform workspace delete` - To remove a workspace
- Workspaces are useful for managing configurations across different environments or teams.

**STEP 9 : Collaboration (Optional):**
- In team environments, collaboration tools like version control systems (e.g., Git), Terraform Cloud, or other CI/CD pipelines can be integrated to facilitate collaboration and automation.
- Collaborative tools help manage changes, share configurations, and automate infrastructure deployments.

> [!WARNING] Handling Resources Manually
> - Avoid manually changing the resources in their respective GUIs outside of terraform.
> - This can cause huge problems in the state that is maintained by terraform.
> - Always manage the resources within terraform only.

> [!DANGER] Editing the `.tfstate` file
> - Do not manually edit the `.tfstate` file.
> - Terraform uses the `.tfstate` file to provision, manage and destroy resources.
> - Manual edits to this file might cause unforeseen issues on the actual resources managed by terraform.

### Basic Workflow

Following are some simple Terraform projects to understand the basic workflow in setting up a terraform project.
- [Setting up a Simple HTTP Web Server on AWS with Terraform](/Setting%20up%20a%20Simple%20HTTP%20Web%20Server%20on%20AWS%20with%20Terraform)
- [Setting up a Simple Nginx Server on Docker with Terraform](/Setting%20up%20a%20Simple%20Nginx%20Server%20on%20Docker%20with%20Terraform)

>[!INFO]+ Working with Providers
> When starting to work with a new provider, always *checkout the documentation*. Terraform's providers are usually well documented, with examples of code to implement a particular feature of the provider, so you get that copy pasta action.

### Best Practices
1. **IaC under Version Control** - Store the Terraform configurations in a version control system (e.g., Git) to track changes, collaborate with team members, and maintain a history of the infrastructure code as it evolves over time. This allows to rollback to a previous working version if things go south.
2. **Use Modules to keep it DRY** - Modules are a way to simplify repeated terraform code in the IaC configuration. Modules promote DRY (Do not Repeat Yourself) code. There are several prebuilt modules available as well, that speed up the IaC development process. Modularization improves code maintainability and encourages consistency across projects.
3. **Centrally manage state files** - Using a remote backend to store and lock state files is preferred especially when more than one individual contributes to an IaC. This allows for team collaboration and state locking. It prevents concurrent access issues and provides a central location for the state file.
4. **Define variables separately** - Declare variables and input values in separate variable files. This enhances code readability and allows for easy customization.
5. **Good Naming Conventions** - Follow consistent naming conventions for resources, variables, and outputs. Naming clarity reduces confusion and errors.
6. **Better Dependency Management** - Define resource dependencies explicitly. Terraform's dependency graph should accurately represent the order of resource creation.
7. **Use Data Sources** - Leverage data sources to fetch information (e.g., AMI IDs, subnet IDs) dynamically rather than hardcoding values. This ensures that the configurations remain up-to-date.
8. **Immutable Infrastructure** - Embrace the principle of immutable infrastructure by recreating resources when updates are needed rather than modifying them in-place. This reduces configuration drift and ensures consistency.
9. **Security Best Practices** - Implement security best practices, such as secure secret management (e.g., HashiCorp Vault), strict access control, and proper handling of sensitive data.
10. **Always Review and Test** - Regularly review and test your Terraform configurations to catch issues early. Use `terraform plan` to preview changes before applying them.
11. **Docs, Docs, Docs** - Maintain comprehensive documentation that includes usage instructions, variable descriptions, and explanations of resource configurations.
12. **Integrate CI/CD** - Integrate Terraform into CI/CD pipelines for automated testing, validation, and deployment. Automated workflows improve efficiency and reduce manual errors. Almost never run terraform code manually, and always run it via a pipeline.
13. **Isolate Environments** - Isolate environments (e.g., development, staging, production) with separate Terraform workspaces or state files. This prevents accidental changes in production.
14. **Perform Monitoring and Logging** - Implement monitoring and logging for the infrastructure to detect and respond to issues promptly. Services like AWS CloudWatch and Azure Monitor can be integrated.
15. **Keep em updated** - Keep Terraform, provider plugins, and modules up-to-date to benefit from new features, improvements, and security patches.

## Why Terraform?

1. **Infrastructure as Code (IaC)**
    - Terraform allows you to *define the infrastructure using code (configuration files)*, which enables *versioning*, *sharing*, and *collaboration* on infrastructure configurations just like application code under version control.
    - This promotes *consistency*, *repeatability*, and *automation* in infrastructure management.
2. **Multi-Cloud and Hybrid Cloud Support**
    - Terraform *supports multiple cloud providers* (e.g., AWS, Azure, Google Cloud), as well as *on-premises* and *hybrid* cloud environments.
    - As s single tool, Terraform can manage infrastructure across various platforms, *avoiding vendor lock-in* and enabling *seamless multi-cloud strategies*.
3. **Declarative Syntax**
    - Terraform uses a *declarative syntax* to describe the *desired state* of your infrastructure.
    - This makes the infrastructure be *idempotent*, meaning the infrastructure always *observes the desired state* as per definition in the configuration files, no matter how many times it is applied/updated.
    - Resources and their properties are specified in configuration files without worrying about the step-by-step process of provisioning, which in turn makes the configurations *more manageable* and *less error-prone*.
4. **Resource Management**
    - Terraform provides a wide range of *resource types* (e.g., virtual machines, databases, networks) for various providers.
    - You can manage diverse infrastructure components consistently through a single tool, simplifying the management of complex environments.
5. **Dependency Management**
    - Terraform automatically *identifies and manages dependencies* between resources in form of dependency graphs.
    - This ensures resources are *created and/or updated* in the *correct order*, reducing errors in the infrastructure.
6. **State Management**
    - Terraform maintains a *state file* that tracks the actual state of the infrastructure.
    - This enables Terraform to *understand and manage changes to the infrastructure*, making it safe to apply changes without causing unexpected disruptions.
7. **Parallel Execution**
    - Terraform can *provision multiple resources concurrently*, speeding up the deployment of complex infrastructures.
    - this facilitates an efficient infrastructure scaling strategy, *reducing provisioning times*.
8. **Modular Ecosystem**
    - Terraform has a rich ecosystem of *community-contributed modules and providers*.
    - This allows for a plug-and-play approach to have modular infrastructure configurations, *saving time and effort*.
9. **Security and Compliance:**
    - Terraform supports security best practices through its configurations, including *access controls* and *secret management*.
    - It helps to maintain a *secure* and *compliant* infrastructure.
10. **Extensibility:**
    - Terraform can be extended through *custom providers* and *modules*.
    - This allows Terraform to meet specific organizational or infrastructure requirements.
11. **Version Control Integration:**
    - Terraform configurations can be stored in *version control systems* (e.g., Git).
    - This allows to *track changes*, *collaborate with team members*, and *apply DevOps practices* to infrastructure management.
12. **Community and Support:**
    - Terraform has a *large and active community*, which means *extensive documentation*, *tutorials*, and *community support*.
    - This serves as a means to find solutions to common challenges and get help when needed.

## Beyond the Basics

### Backend
- A backend defines where terraform stores its state data files. this is DynamoDB 


#### Managing Backend

#### Local Backend
- Store the state file locally
- Sensitive information is stored locally in plain text.
- Not collaborative
- Manual process

#### Remote Backend
- Files are stores on remote backend services such as [Amazon S3](../../Amazon%20Simple%20Storage%20Service.md) or [HashiCorp Cloud](/HashiCorp%20Cloud).
- Data is encrypted.
- Collaboration as it is hosted on cloud.
- Possibility of automation.
- Problem is more complexity

##### HashiCorp/Terraform Cloud
- HashiCorp also has a cloud offering to manage the resources maintained by their products.
- Terraform cloud is a subset of cloud offerings by HashiCorp and can be found [here](Terraform.md)).

##### Amazon S3 
- For this configuration, an [Amazon S3](../../Amazon%20Simple%20Storage%20Service.md) bucket as well as a [DynamoDB](../../Amazon%20DynamoDB.md) table needs to be set up.
- Here, the S3 bucket offers storage and the DynamoDB table is used to state locking.
- In order to manage the S3 Bucket and the DynamoDB table with terraform itself while using these two as the remote backend, a little bit of pre-configuration needs to be done.
	- Initially, the S3 Bucket and DynamoDB table are created with local backend.
	- Initialize and apply the terraform configuration.
	- Then change the backend to use S3 and DynamoDB.
	- Run `terraform apply` to apply the modified terraform configuration.
	- Terraform will not migrate the backend to the S3 Bucket and DynamoDB combination.

### Terraform Objects
1. Resources
2. Data
3. Variables
4. Output

### Terraform Commands
 
> [!important] General Terraform Syntax
> `terraform [global options] <subcommand> [args]` 

> [!info] Flags in commands
> Terraform is not very strict in the syntax for flags. Flags can be written with both one dash or two dashes.
> For instance, `terraform -version` and `terraform --version` are both valid.

1. `terraform -version` - Shows the current version of terraform that is installed.
2. 
3. `terraform init` - It initializes the terraform environment
	- The command downloads the essential code for the *providers* and *modules* if any specified in the `.tf` files.
	- The configurations downloaded get stored in the `.terraform` directory.
	- **Flags:** 
4. `terraform plan` - Plans the sequence of steps needed to provision the desired environment. Checks the resources that it needs to create, modify or destroy.
	- **Flags:**
5. `terraform apply` - Executes the configuration to create, modify or destroy resources.
	- **Flags:** 
		- `--auto-approve` - Does not wait for confirmation, executes it straight, provided no variables need to be supplied.
6. `terraform destroy` - Undo for all the configuration that is currently managed by the terraform configuration. Does not touch the resources that are not maintained by the configuration. 
	- **Flags:** 
		- `--auto-approve` - Does not wait for confirmation, executes it straight, provided no variables need to be supplied.

## Extras

### Certifications

HashiCorp currently offers two certifications for professionals who wish to get certified on Terraform. HashiCorp currently uses [Certiverse](https://www.certiverse.com/#/) as their certification partner offering live-proctored exams.

For additional information on certifications pertaining to infrastructure automation with terraform visit the [official certifications page](https://developer.hashicorp.com/certifications/infrastructure-automation) on the HashiCorp website. 

[HashiCorp Certified: Terraform Associate (004)](https://developer.hashicorp.com/certifications/infrastructure-automation) is the entry-level Terraform certification, validating foundational knowledge and skills. It is aimed at Cloud Engineers who understand core Terraform workflows such as `init`, `plan`, `apply`, `destroy` and can manage state, work with modules, and identify the differences between Terraform Community Edition and Terraform Enterprise. The exam is an hour-long multiple-choice test, delivered remotely with a live proctor. The current version (004) aligns to Terraform version `1.12`.

[HashiCorp Certified: Terraform Authoring and Operations Professional](https://developer.hashicorp.com/certifications/infrastructure-automation) is the advanced-level certification, aimed at engineers with real production-level Terraform experience. Unlike the Associate exam, this is a hands-on, lab-based exam where the user performs actual tasks by writing dynamic HCL configuration, authoring reusable modules, and establishing scalable collaborative workflows. It is the right next step once you have enough real-world production exposure to troubleshoot and operate Terraform at scale.

Both certifications are valid for two years and can be renewed by passing the same or a higher level exam.

### Guides & Recipes

Practical, end-to-end walkthroughs for specific Terraform setups and configurations. This section grows over time as new patterns, setup and/or providers are explored and documented.

- [ ] Setting up a Local Backend
- [ ] Setting up a Remote Backend with AWS S3 + DynamoDB
- [ ] Setting up a Remote Backend with Azure Blob Storage
- [ ] Setting up a Remote Backend with Google Cloud Storage
- [ ] Setting up HCP Terraform as the Runner
- [ ] Running Terraform in GitHub Actions
- [ ] Running Terraform in GitLab CI
- [ ] Setting up Atlantis for GitOps-style Terraform
- [ ] Writing and Publishing a Module to the Terraform Registry
- [ ] Consuming a Module from the Terraform Registry
- [ ] Setting up and Configuring the AWS Provider
- [ ] Setting up and Configuring the Azure Provider
- [ ] Setting up and Configuring the GCP Provider

### Documentation & References

Quick access to official documentation, specifications, and community resources for
Terraform and the broader HashiCorp ecosystem.

- **Official Documentation**
	- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
	- [Terraform CLI Reference](https://developer.hashicorp.com/terraform/cli)
	- [Terraform Language Reference](https://developer.hashicorp.com/terraform/language)
	- [Terraform Registry](https://registry.terraform.io/)
	- [Provider Documentation](https://registry.terraform.io/browse/providers)
	- [Module Documentation](https://registry.terraform.io/browse/modules)
- **Best Practices & Guides**
	- [Terraform Best Practices](https://www.terraform-best-practices.com/)
	- [Google Cloud — Terraform Best Practices](https://cloud.google.com/docs/terraform/best-practices-for-terraform)
	- [HashiCorp — Terraform Recommended Practices](https://developer.hashicorp.com/terraform/cloud-docs/recommended-practices)
- **Specifications & Internals**
	- [HCL Native Syntax Specification](https://github.com/hashicorp/hcl/blob/main/hclsyntax/spec.md)
	- [Terraform State Internals](https://developer.hashicorp.com/terraform/internals/json-format)
	- [Terraform Provider Protocol](https://developer.hashicorp.com/terraform/plugin/how-terraform-works)
- **GitHub Repositories**
	- [hashicorp/terraform](https://github.com/hashicorp/terraform)
	- [hashicorp/hcl](https://github.com/hashicorp/hcl)
	- [terraform-aws-modules](https://github.com/terraform-aws-modules)
	- [opentofu/opentofu](https://github.com/opentofu/opentofu)
- **Awesome Lists**
	- [awesome-terraform](https://github.com/shuaibiyy/awesome-tf)

### Learning Resources

- Courses
	- [HashiCorp Learn — Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) — Official tutorials from HashiCorp, free, hands-on, beginner to advanced
	- [Terraform Associate (004) — Zeal Vora](https://www.udemy.com/course/terraform-beginner-to-advanced/) — Udemy, cert-focused, heavily practical
	- [Terraform on Coursera](https://www.coursera.org/courses?query=terraform) — Multiple specializations across AWS, Azure and GCP
- Books
	- [Terraform: Up and Running](https://www.terraformupandrunning.com/) — Yevgeniy Brikman (O'Reilly, 3rd ed.) — The definitive Terraform book, from basics to production-grade patterns
	- [Terraform in Action](https://www.manning.com/books/terraform-in-action) — Scott Winkler (Manning) — Hands-on, advanced techniques and real-world scenarios
	- [Mastering Terraform](https://www.amazon.com/Mastering-Terraform-practical-deploying-infrastructure/dp/1835086012) — Mark Tinderholt — Multi-cloud focus across AWS, Azure and GCP
- YouTube
	- [HashiCorp — Official Channel](https://www.youtube.com/@HashiCorp) — Official releases, demos and HashiConf talks
	- [TechWorld with Nana](https://www.youtube.com/@TechWorldwithNana/search?query=terraform) — Beginner-friendly walkthroughs, clean visual explanations
	- [KodeKloud](https://www.youtube.com/@KodeKloud/search?query=terraform) — Lab-focused, hands-on tutorials
	- [Anton Putra](https://www.youtube.com/@AntonPutra/search?query=terraform) — Deep-dive Terraform and DevOps content, production-oriented
	- [Tech Tutorials with Piyush](https://www.youtube.com/@TechTutorialswithPiyush/search?query=Terraform) — Use-case driven Terraform tutorials with hands-on examples