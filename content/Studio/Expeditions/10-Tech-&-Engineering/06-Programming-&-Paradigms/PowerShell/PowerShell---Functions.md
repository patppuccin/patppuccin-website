---
title: PowerShell Functions
description:
aliases:
tags:
publish: true
---

## Introduction to Functions in PowerShell
Functions are blocks of code that performs a specific operation and that alone. Functions can help to make the code easier to read and understand, as well as debug in case of errors. Functions are used to compartmentalize the code and to avoid one pile of code mess that is executed in linear fashion. Functions can be reused by invoking (or calling) them when required.

In PowerShell, this might be similar to a cmdlet, but cmdlets are typically written in languages other than PowerShell, such as C#. Functions can be referred to as user-defined entities, written in PowerShell.

## Function Definition
Function definition is the process of building the function with what inputs and output the function works with. It is best practice to use the default naming scheme of PowerShell that is a `Verb-Noun` pattern. A general function definition follows the pattern of the keyword function, then the function's name and then a set of curly braces within which the code to be executed lives.

```PowerShell
# Basic function definition
function Install-Software {
	Write-Host "Success: The software has been installed."
}
Install-Software
```

To change the function and what it does, it can be redefined once again and the changes are captured. Functions can be defined directly on the command line interface, in a script or in a [module](/PowerShell%20Modules). 

---
## Functions with parameters
When a function is defined, it can be designed to accept several inputs (parameters), that can be used inside the function for processing. These parameters can be made mandatory or optional, and can even be made to restrict the input to a limited possible list of arguments.

Parameters for functions can be defined in PowerShell with a `param` block. The `param` block holds all the parameters for the function.

```PowerShell
# Basic funcion with parameters
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter()]
		[string] $Version
	)
	Write-Host "Success: Version $Version of the software has been installed." -ForegroundColor DarkGreen
}
Install-Software
```

Here's a breakdown of what each part in the code above does,
- `[CmdletBinding()]` - Initializes a new instance of a special attribute class that can be used to define PowerShell's behavior. Including this at the top of the function definition makes the function an advanced function. 
- `param()` - Defines and holds the parameters to be used in the function.
- `[Parameter()]` - 
- `[string] $Version` - Defines the name of the parameter and optionally define the type of data the parameter must accept.

Multiple parameters can be defined by separating them with commas in the `param` block. 

```PowerShell
# Basic funcion with multiple parameters
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter()]
		[string] $Version,
		
		[Parameter()]
		[string] $UserName
	)
	Write-Host "Success: Version $Version of the software has been installed for the user $UserName." -ForegroundColor DarkGreen
}
Install-Software
```

The `param` block can be used to modify all the attributes about a parameter that PowerShell can and will accept from the user. Some oft he most common ones are discussed below

### Setting Datatype
When defining functions in the `param` block, the data type of the parameter value can be defined as well. This is optional, but is recommended as it helps avoid a lot of errors based on the datatype of the parameter.

```PowerShell
# Datatype in param block of function definition
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter()]
		[string] $Version
	)
	Write-Host "Success: Version $Version of the software has been installed." -ForegroundColor DarkGreen
}
Install-Software
```

### Setting Mandatory Parameters
Parameters can be set to be mandatorily provided by the invoking entity for the script to proceed in PowerShell. If a mandatory argument is skipped, PowerShell prompts the invoking entity to enter in a value for the mandatory parameter.

```PowerShell
# Setting a datatype to be mandatory function definition
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter(Mandatory)]
		[string] $Version
	)
	Write-Host "Success: Version $Version of the software has been installed." -ForegroundColor DarkGreen
}
Install-Software -Version 3
```

### Setting Default values to Parameters
Default values can be set for parameters, that take effect when the invoking entity does not explicitly pass in values to the parameters. This is much used for mandatory arguments avoid PowerShell from prompting the invoking entity if the mandatory parameter value was not explicitly passed.

```PowerShell
# Setting a datatype to be mandatory function definition
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter(Mandatory)]
		[string] $Version = 3
	)
	Write-Host "Success: Version $Version of the software has been installed." -ForegroundColor DarkGreen
}
Install-Software
```

### Setting up Parameter Validation
The values passed into the parameters can also be validated before PowerShell executes the function. This helps in avoiding extensive error handling and mitigation code.

```PowerShell
# Setting a datatype to be mandatory function definition
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter(Mandatory)]
		[ValidateSet("1","2","3")]
		[string] $Version = 3
	)
	Write-Host "Success: Version $Version of the software has been installed." -ForegroundColor DarkGreen
}
Install-Software
```


---
# Accepting Pipeline Input
The power of functions and cmdlets in PowerShell is their ability to process objects through the pipeline. To make a function accept values via the pipeline, it has to be declared prior in the `param` block. A function can accept pipeline input either `ByValue` (entire object) or `ByPropertyName` (a single object property).

The indication to allow passing of pipeline in0put is made in the parameter section of the parameter definition as given below.

```PowerShell
# Setting a datatype to be mandatory function definition
function Install-Software {
	[CmdletBinding()]
	param(
		[Parameter(Mandatory)]
		[ValidateSet("1","2","3")]
		[string] $Version = 3,

		[Parameter(Mandatory, ValueFromPipeline)]
		[string] $ComputerName
	)
	process{
		Write-Host "Success: Version $Version has been installed on $ComputerName."
	}
}
$ComputerName = @("DMSRV01","DMSRV02","DMSRV03")
$CmputerName | Install-Software -Version 3
```

Here, the `ValueFromPipeline` denotes that the value is sent `ByValue`. If the value is sent by property, it is denoted as `ValueFromPipelineByPropertyName`. 

It is also notable from the example that the code that has to be performed inside the function is enclosed in a process block. If this were not done, the last value to be processed by the pipeline will be the only object that will be acted upon. Thus, when working with pipeline passing of objects, it is mandatory to declare the function code inside the `process` block.

---