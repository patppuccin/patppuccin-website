---
description: Installing Python and running the mandatory 'Hello World' code
tags:
aliases:
publish: true
---
## Flow Control and Loops in Python
Flow controls and loops are crucial part of any programming language. They facilitate to logically process a piece of information and take actions based on the outcome.
**Flow statements** are used to control the flow of code execution based on a logical test. If the test case passes, a specific block of code is executed, and if it fails, another action can be triggered.
Loops are used to iterate over a condition multiple times, based on a condition. These form the foundation of repeatability and consistency when performing operations with code, as the same code is iterated over multiple times.

::: info Pass, Break and Continue 
- The `pass` statement can be used to skip a block from getting executed. This is done as conditional blocks cannot be empty (without any code).
- The `break` keyword can be used to exit a block of code prematurely without evaluating it. It can be used to exit out of the loop.
- The `continue` keyword can be used to skip to the next iteration of the loop while ending the current iteration.
:::
::: warning Premature exits and else blocks
When a loop is exited using a `break` statement, the else block will not be executed.
:::

## If-elif-else Flow Control Statement
The is, else and elif statement is used to check for conditions and perform code executions. The order of execution is very important when dealing with the `if-elif-else` statements. The code is executed from top to bottom and the if condition checking process ends when the python finds the first `True` condition. The remaining conditions are not evaluated. It is also possible to chain multiple logical tests using the logical operators in python. The if conditions can also be nested, to check conditions within conditions. 

```python
# if-elif-else flow control statement
computer_value = 10
user_input = int(input("Enter a number from 1 to 10"))
if(computer_value = user_input ):
	print("the player guessed right")
elif(computer_value < user_input):
	print("User guessed a larger number")
else:
	print("User guessed a smaller number")

# Simple one-condition if statement 
a = 10
b = 20
if(a=b): print("a equals to b")

# Simple one-condition if-else condition
a = 10
b = 20
print("a equals to b") if(a=b) else print("a and b are not equal")

# Evaluating numtiple conditions 
a = 5
b = 10
c = 20
if (a < b) and (a < c):
	print("a is the smallest number")
elif (a == 0) or (b == 0) or (c == 0):
	print("One entry among a,b,c is a zero")
elif not (a == c ):
	print("a and c are non-identical")
else:
	print("All conditions have failed")

# Nested if-elif-else statements
a = 10
b = 20
c = 5	
if a > b:
	if c > a:
		print("c is the largest")
else:
	print("a is not greater")

# Skipping a block using the pass statement
a = 10
b = 20
if a > b:
	pass
``` 

## While Loop
A while loop is used to iterate over a block of code as long as the condition evaluates to true.

The `else` statement can be used to evaluate a block of code when the condition for a while loop evaluates to a false.

```python
# Simple while loop to evaluate a conditions 
a = 10
while(a>0):
	print("The value of a is" + str(a))
	a = a - 1

# Using break to exit the loop
a = 10
while(a>0):
	if(a == 4): break
	print("The value of a is" + str(a))
	a = a - 1

# Using continue to skip current iteration
a = 10
while(a>0):
	if(a == 4): continue
	print("The value of a is" + str(a))
	a = a - 1

# Using else to run a block of code when the condition evaluates to false
a = 10
while(a>0):
	print("The value of a is" + str(a))
	a = a - 1
else:
	print("The Loop has ended")
```

## For Loop
For loops are used to iterate over a block of code a set number of times. This loop is chosen when the number of times the looping has to be done is known.
Several ways can be used to supply the looping entity to the for loop. For loop is most often used over collection data types such as lists, sets, tuples and dictionaries.

```python
# Looping through a list 
my_list = ["apple", "oranges", "pineapples"]
for list_item in my_str:
	print(list_item )

# Looping through a string 
string = "Hello World"
for each_char in string:
	print(each_char)

# Looping through with range function
for i in range(5):
	print(i) # prints from 0 to 4 (5 times)

for i in range(2,5):
	print(i) # prints 2,3,4 (3 values: 5-2=3)

for i in range(2,11,2):
	print(i) # prints 2,4,6,8,10 (steps of 2)
```

The range function supplies values from the start till, but not including the end number, in whatever increment required. It can also take in negative numbers for the incrementing number argument.