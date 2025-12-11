---
title:
description: ""
aliases:
tags:
publish: true
---
Topics to Cover
1. Talk about comparison operators
2. Talk about continue, break, and exit keywords and what they mean in what context

## Variables
Variables are placeholders to store values. Variables in PowerShell begin with a dollar(\$) sign. This indicates to PowerShell that a variable is called and not a cmdlet. Variables can be declared and referred to by using the name of the variable after the dollar(\$) sign. To assign values to a variable, the assignment is done using the equals(=) sign (assignment operator - dealt later).

Variables can be set and retrieved using the traditional cmdlet way of defining and accessing variables by using the `Set-Variable` and `Get-Variable` cmdlets.

**Command:**

```PowerShell 
$FavoriteFruit = "Apple"
Set-Variable -Name FavoriteFood -Value "Soup"
$FavoriteFruit
Get-Variable -Name FavoriteFood
```

**Output:**

```PowerShell
Apple
Soup
```

In PowerShell there are two types of variables, namely
1. **Automatic Variables** - Variables that are pre-defined in a given PowerShell environment.
2. **User-Defined Variables** - Variables that are created and managed by the users.

To retrieve all the variables currently in memory and tracked by PowerShell, use the `Get-Variable` cmdlet, which lists both Automatic and User-Defined Variables.

**Command:**

```PowerShell
Get-Variable
```

**Output:**

```PowerShell
Name                           Value
----                           -----
?                              True
^                              $FavoriteFood
$                              $FavoriteFood
args                           {}
ConfirmPreference              High
DebugPreference                SilentlyContinue
EnabledExperimentalFeatures    {}
Error                          {The term 'Get' is not recognized as a name of a cmdlet, function, script file, or exec…
ErrorActionPreference          Continue
ErrorView                      ConciseView
ExecutionContext               System.Management.Automation.EngineIntrinsics
false                          False
FavoriteFood                   soup
FavoriteFruit                  Apple
---snip---
```

### Automatic Variables
These are variables defined and maintained by the PowerShell environment. It is generally not considered good practice to edit these variables as they might lead to unexpected outputs. Thus, the automatic variables must be considered as `Read-Only` variables.

To learn more about automatic variables visit the [PowerShell Documentation Page for Automatic Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables?view=powershell-7.3) 

### User-Defined Variables
User-defined variables are variables that are defined and managed by the users. A variable must be defined before it can be called upon and used in the PowerShell environment.

> [!abstract] Setting Strict Mode
> To make PowerShell allow only defined variables to be called upon by the user, use the option `Set-StrictMode -Version Latest`. This mode is often used when scripting using PowerShell to promote good coding practices. However, when running commands from the prompt, it is mostly not turned on (it is turned off by default).
> 
> For more information about the `StrictMode`, try accessing the help documentation by using the command `Get-Help Set-StrictMode`


Once defined, a variable can be used and reused and reassigned to any value. A user-defined variable's value does not change unless explicitly changed by the user or a script.

---
## Data Types
PowerShell supports a variety of variable types derived directly from its `.NET` feature set.

To reference variables as values when using with strings, double quotes must be used and to fetch the names of the variables, single quotes must be used.

**Command:**

```PowerShell
$NumVar = 10
$BoolVar = $true
$StringVar = "it is a bright and sunny day to go spelunking"

# Accessing variables as values
Write-Host "It is $true that $StringVar plus, I have $NumVar days of vacation left."

# Accessing variables as variable names
Write-Host 'It is $true that $StringVar plus, I have $NumVar days of vacation left.'

```

**Output:**

```PowerShell
# Accessing variables as values
It is True that it is a bright and sunny day to go spelunking plus, I have 10 days of vacation left.

# Accessing variables as variable names
It is $true that $StringVar plus, I have $NumVar days of vacation left.
```

---

## Data Structures


---

## Objects
In PowerShell, everything is an object. This enables far more native functionality. Objects have Properties and Methods.
1. **Properties** - Data about the object.
2. **Methods** - Functionality of the object.

---

## Piping and Redirection


---
## PowerShell Scripts


---