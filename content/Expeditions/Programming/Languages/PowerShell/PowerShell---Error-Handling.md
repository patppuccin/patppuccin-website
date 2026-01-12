---
title: PowerShell - Error Handling
description: Gracefully handling errors in PowerShell
aliases:
tags:
  - Programming-and-Scripting
publish: true
---
## Working with Exceptions and Errors
When working with code and its execution, one is sure to encounter bugs and errors in code execution. Some errors can be anticipated and can be dealt with, such as string inputs for numerical variables, invalid file path and so on.

But lot can go wrong and it is very difficult to anticipate all errors. But, it is mandatory to code the logic to handle errors gracefully and provide context as to why the error occurred, and overall provide a better user experience.

This concept is known as **Error Handling**. Whenever PowerShell encounters an obstacle in the path of its execution, it throws an error, with some context to what type of error it had encountered.

PowerShell can encounter two types of errors namely
1. **Non-Terminating Errors** - Errors that do not stop the flow of code execution.
2. **Terminating Errors** - Errors that stop the flow of code execution.

---
## Handling Non-Terminating Errors
Non-terminating errors are errors thrown by the PowerShell that do not stop the execution of the script/program. Non-terminating errors can be handled by using the `-ErrorAction` parameter of every cmdlet. 

All cmdlets in PowerShell have the parameter `-ErrorAction` that specify PowerShell how the user wishes to handle non-terminating errors arising out of processing the cmdlet. The following table summarizes the values that the `-ErrorAction` parameter can take and what they do.

| Parameter Value  | Description                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Continue         | Outputs the error message and continues to execute the cmdlet. This is the default value           |
| Ignore           | Continues to execute the cmdlet without outputting an error or recording it in the $Error variable |
| Inquire          | Outputs the error message and prompts the user for input before continuing                         |
| SilentlyContinue | Continues to execute the cmdlet without outputting an error, but records it in the $Error variable |
| Stop             | Outputs the error message and stops the cmdlet from executing                                                                                                   |

```PowerShell
# Handling non-terminating errors
$Files = Get-ChildItem -Path .\FakeFolder -ErrorAction Stop
$Files.foreach({$_.Name})
```

When an `-ErrorAction` passes its value to the `$Error` variable, the user can choose to log it or use it to find and debug the non-terminating errors. The `-ErrorAction` parameter allows to handle non-terminating errors on a cmdlet to cmdlet basis. In general, it is best to avoid the concept of non-terminating errors by setting `-ErrorAction` to stop and not deal with the complexity of handling the error actions on a per cmdlet basis.

---
## Handling Terminating Errors
Terminating errors are ones that stop the execution of the script. This is accomplished by using the try/catch/finally construct. The `try/catch/finally` or `try/catch` (finally is optional) construct is a safety net for catching terminating errors in scripts. These represent 3 blocks (or 2, if finally block is not used) of script that are run based on each condition as follows.
- **`try` block** - Executed first. Actual code lives here.
- **`catch` block** - Executed if a terminating error is encountered. The error handling code lives here.
- **`finally` block** - Always executed, but optional code block.

```PowerShell
# Handling terminating errors
try {
	Get-ChildItem -Path .\FakeFolder
} catch {
	Write-Host "The Script has encountered some error"
}
```

Here, the `finally` block can be used to clean up code and execution as well as log in errors and execution reports for debugging purposes.

---
## PowerShell $Error Variable
The `$Error` is a default variable that is used by PowerShell to store errors of both terminating and non-terminating natures. The errors are stored in the variable in the order in which they were caught. Individual error records can be accessed via the array member access notation like `Error[0]` to access the first member of the `$Error` array.

```PowerShell
# Default error variable in PowerShell
$Error
$Error.Exception.Message
$Error.Exception.Source
```

---