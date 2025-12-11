---
description: Modification of the sequence of code execution in PowerShell
tags:
publish: true
---

## Controlling the Flow of Code Execution
In programming and scripting, control flow is the order in which individual statements, instructions or function calls of a program gets executed. Controlling the flow of code execution allows to work in logic into the code execution. 

PowerShell offers two ways to accomplish control flow
1. Conditional Statements
2. Loops

---
## Conditional Statements
**Conditional Statements**, **Conditional Expressions** or just **Conditionals** are features in a programming language that tell the computer to execute certain actions provided certain conditions are met. Conditionals work based on the Boolean values of `true` or `false`, meaning a block of code is executed if the condition evaluates to `true` and is not executed if the condition evaluates to `false`.

PowerShell has two conditional statements, namely
1. If-Else-ElseIf Statement
2. Switch statement

### If-Else-ElseIf Statement
The `if`,  `elseif`  and `else` conditional statement is used to evaluate if a condition evaluates to a true. If so, the block of code under the condition is executed, else the block of code is skipped. Following is an example of how this is structured and executed in PowerShell.

```powershell
# PowerShell if/elseif/else statement example
$a = 5
$b = 5
if ($a -eq $b) {
	Write-Host '$a is equal to $b'
} elseif ($a -le $b) {
	Write-Host '$a is less than $b'
} else {
	Write-Host '$a is greater than $b'
}
```

### Switch statement
A `switch` statement allows the execution of various blocks of code based on a value evaluated out of an expression. The switch statement consists of different blocks of code that shall be executed if the condition were true, and then a default block of code when all the conditions fail. A switch statement can contain as many conditions as possible, but it is not considered a best practice to evaluate too many. When there are too many cases to evaluate, it is better rethink the coding approach. When one condition is met, PowerShell evaluates the condition, and then proceeds to check the other conditions, unless specified otherwise (using `break` keyword) to exit the switch statement.

```PowerShell
# PowerShell switch statement
$UserInput = Read-Host "Choose the option A or B or C "
switch ($UserInput) {
	"A" {Write-Host "You have chosen A"}
	"B" {Write-Host "You have chosen B"}
	"C" {Write-Host "You have chosen C"}
}
```

---
## Loops
Loops are ideal to use when a particular task has to be repeated multiple times. A loop construct executes a certain block of code repeatedly until a loop termination condition is attained. PowerShell offers 5 main loop types namely,
1. foreach loop
2. for loop
3. while loop
4. do/while
5. do/until

### foreach Loop
A `foreach` loop can be used to iterate (repeatedly operate) over the items present in a collection (such as arrays). The loop performs the same action on each item/member of the collection being iterated. It is one of the most commonly used loop types in PowerShell. The `foreach` loop can be implemented in 3 ways namely
1. foreach statement
2. ForEach-Object cmdlet
3. foreach() method

In a `foreach` loop, the original item/member of the collection thus iterated upon is not modified.

#### foreach statement
The `foreach` loop is used to iterate over a collection, where each item/member in the collection is copied to a new variable and then processed as per the code specified. Here, the original item/member is not modified, the current item is copied and then acted upon.

```PowerShell
# foreach statement example
$FilePath = Get-ChildItem -Path "C:\Users\FakeUser\Documents\Important Documents"
foreach ($File in $FilePath) {
	Write-Host "Current file is : $File"
}
```

#### ForEach-Object cmdlet
The `ForEach-Object` cmdlet can iterate over a set of objects and perform an action on them. As it is a cmdlet, the action to be performed over the collection of objects must be passed as parameters to the cmdlet. This is usually done in a script block format.

```PowerShell
# ForEach-Object cmdlet example
$FilePath = Get-ChildItem -Path "C:\Users\FakeUser\Documents\Important Documents"
ForEach-Object -InputObject $FilePath -Process{
	Write-Host "Current file is: $_"
}
```

Notice that there is no separate variable being declared to hold in the content of each individual item/member in the collection, hence the actions are performed on the item/members themselves. To reference the current item/member the `$_` notation is used.

One major advantage of the ForEach-Object cmdlet is that it accepts pipeline input, hence it is mostly used along a pipeline flow to act on objects in a pipeline. Refer example below to see how this is implemented.

```PowerShell
# ForEach-Object cmdlet example along a pipeline
Get-ChildItem -Path ".\Important Documents" | ForEach-Object -Process{
	Write-Host "Current file is: $_"
}
```

#### foreach() method
The `foreach()` method exists as a method for all array collections. It iterates over the items/members of the array. The code block is passed as a method argument. Similar to the `ForEach-Object` it uses `$_` to capture the current item/member in iteration.

```PowerShell
# foreach() method example
$FilePath = Get-ChildItem -Path "C:\Users\FakeUser\Documents\Important Documents"
$FilePath.foreach({Write-Host "Current file is: $_"})
```

On performance perspective, foreach() method performs considerably faster than the other two foreach types, and hence is recommended for iterating over large collections.

### for Loop
The `for` loop is ideal to iterate over a specific block of code a specific number of times. A `for` loop consists of 4 distinct parts namely,
- An iterating variable
- Increment/decrement operation for the iterating variable
- Loop exit condition
- Script block to execute the set number of times

When the iterating variable hits the loop exit condition, it exits out of the loop.

```PowerShell
# for loop example
for($i = 0; $i -lt 5; $i++) {
	Write-Host "Current iterating variable value is : $i"
}
```

**Note:** Notice the semicolon - `;`  (not a comma) separating the arguments in the `for` iteration condition section.

### while loop
The `while` loop is one of the simplest forms of looping in PowerShell (and programming in general), as it iterates over a block of code as long as the condition specified evaluates to true.

It is important to set a terminating condition clearly as failing to do so might cause the script block to be executed indefinitely, called as an infinite loop. As seen before, premature loop exit can be performed via a `break` keyword.

```PowerShell
# while loop example
$UserResponse = Read-Host "Please choose a value between 1 and 10 "
while($UserResponse -ne 4) {
	Write-Host "Try Choosing Again."
	$UserResponse = Read-Host "Please choose a value between 1 and 10: "
}

# Non-terminating while loop
while($true) {
	Write-Host "Continuously Running..."
}
```

### do/while loop
A `do/while` loop executes a block of code as long as the condition evaluates to true. The difference to do/while compared to while is that the code block is executed at least once before the condition is evaluated, thus proving useful in such cases where the action needs to be performed at least once before it can be evaluated.

```PowerShell
# do/while loop example
do {
	$SubscriptionChoice = Read-Host -Prompt "Do you wish to continue the subscription?"
} while ($choice -eq "yes")
Write-Host -Object "Correct!"
```

### do/until loop
A `do/until` loop executes a block of code until the specified condition is met. Similar to the `do/while` loop the code block is executed at least once before the condition is evaluated, thus proving useful in such cases where the action needs to be performed at least once before it can be evaluated.

```PowerShell
# do/until loop example
do {
	$choice = Read-Host -Prompt "What is the best programming language?"
} until ($choice -eq "PowerShell")
Write-Host -Object "Correct!"
```

The difference between do/while and do/until loop is that do/while executes a loop as long as the condition evaluates to true and a do/until executes a block of till the condition is met, meaning exits the loop when the condition evaluates to true.

---
## Usage Considerations
The following table captures the different scenario that each Control Flow construct is best suited to handle, and other considerations to keep when using them in code.

| Control Flow Construct | Type        | Description                                                                                   | Use Case                                                                                                                                                                                                                    |
| ---------------------- | ----------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| if/elseif/else         | Conditional | Evaluate a condition to be true or false                                                      | Used when a block of code is to be executed if a condition evaluates to true. Recommended for evaluating less conditions only.                                                                                              |
| switch                 | Conditional | Evaluate a condition to be true or false                                                      | Used when a block of code is to be executed if a condition evaluates to true. Can check multiple conditions. Evaluates other conditions even upon encountering a true condition, unless explicitly supplied a break clause. |
| for                    | Loop        | Execute a block of code a set number of times                                                 | Used when a single block of code needs to be repeatedly executed for a defined number of times.                                                                                                                             |
| foreach                | Loop        | Iterate over a block of code for items within a collection                                    | Used when a block of code needs to repeatedly run over elements in a collection object, such as an array.                                                                                                                   |
| while                  | Loop        | Execute a code block as long as a condition is met. Condition evaluated before code execution | Used when a block of code needs to be iterated multiple times, where the count of iteration is not known.                                                                                                                   |
| do/while               | Loop        | Execute a code block as long as a condition is met. Condition evaluated after code execution  | Used to iterate over a block of code at least once and then check the condition to check and perform the operation again as long as the condition evaluates to true.                                                        |
| do/until               | Loop        | Execute a code block till a condition is met.  Condition evaluated after code execution       | Used to iterate over a block of code at least once and then check the condition to check and perform the operation again as long as the condition evaluates to false.                                                       |

---