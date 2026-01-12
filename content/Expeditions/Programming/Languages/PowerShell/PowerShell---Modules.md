---
title: PowerShell Modules
description: ""
aliases:
tags:
publish: true
---
## Introduction to Modules
PowerShell module is a package that contains various commands such as functions, cmdlets, aliases, parameters, workflow, and providers. And PowerShell comes with numerous modules installed by default.

```PowerShell
# Get all modules in the current session
Get-Module

# Get all installed modules in the system
Get-Module -ListAvailable

# Get all members of the Microsoft.PowerShell.Management module
Get-Command -Module Microsoft.PowerShell.Management
```

Some modules might also have **private functions** or **helper functions** that operate within the scope of the module alone, and they cannot be accessed by the user. Power

---
## The Components of a PowerShell Module


---
## Working with Custom Modules


---
## Creating own Modules


---
