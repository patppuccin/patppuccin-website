---
description: Installing Python and running the mandatory 'Hello World' code
tags:
aliases:
publish: true
---
# Data Types and Variables in Python
One of the fundamental concepts in any programming/scripting language is to understand and work with data types and variables. These form the basis of data manipulation and processing, and mastering them essential to effective programming in python.

## Variables
Variables are *placeholders in memory to store some value*. In python, variables cannot be just defined whereas a variables is created upon declaring it.
To create a variable, it is declared with its appropriate data type syntax. Python can *auto-detect the data type* that is being assigned. Variables can also be *assigned explicitly* stating what data type must be stored in memory. Variables are *reusable or mutable*, meaning when a new value is assigned to a variable, the old value is overwritten and the new value propagates further.

```python
# Assigning values to variables
a = 10
b = "Hello World"
c = 233.42

# Single line multiple variable value assignment
d,e,f = 10,11,12

# Same value to muliple variables 
x = y = z = 100

```

### Variable Naming Conventions
Variable naming conventions are a set of rules governing what is acceptable as variable names and what is not. the following are the variables naming conventions to be followed in python
1. Variable names can only *contain alphanumeric characters* (0-9, a-z) and underscore.
2. Variable names can *start with an alphabet* or an *underscore*.
3. Variable names *cannot start with a number*.
4. Variable names are *case-sensitive*.
5. Multi-word variable names can be named with one of the preferred standards of [programming case types](../../../../../../Concepts.md##Programming%2520Case%2520Types)

```python
# Acceptable Naming Conventions 
variable = 10
Variable = 10
_variable = 10
variable_01 = 10
myVariable = 10
MyVariable = 10
My_Variable = 10
my_variable = 10

# Unacceptable Naming Conventions - Will throw error
01variable = 10
%variable = 10

```

### Type Conversions
Type conversions (converting the value stored in a variable from one data type to another) in python can be done in two ways.
1. **Implicit Conversions** - Data types that are converted into another by the python interpreter during execution.
2. **Explicit Conversions** - Data type conversions that are explicitly mentioned by the program. Explicit conversions offer additional arguments in certain conversions.

In order to get the data type of a variable, the `type()` function can be used.  

```python
# Getting the data type of a variable 
a = 5
b = type(a)
print("The data type of a is " + b)

# Implicit type conversions 
a = 10
b = 2.5
a = a + b
print("a is of type: " + type(a))

# Explicit type conversions 
a = 10
a = float(a)
print("a is of type: " + type(a))
```

### Variable Scoping
Scope in variables refers to the duration of execution until which the variable can be called for utilization. 
Some points to consider for variable scoping are as follows 
- Variables declared on the main function or the initial point of code execution are set to be global scoped. Meaning that they can be accessed along the entire runtime of the code/program.
- Variables declared within a block of code are referred to as local scoped and are available for utilization as long as the block of code gets executed.
- When the same name for the variables are used in both global and local scoped variables, then the local scoped variable takes precedence.
- To declare global scoped variables from within a function, use the `global` keyword.

```python
# Variable scoping 
a = 10 # a is global scoped declared globally
if a < 20:
	b = 5 # b is local scoped declared locally
	global c = a + b # c is global scoped declared locally
print(c)
```

## Data Types
Any data that can be stored in computer memory to be utilized when the program is executed belongs to a particular type. 
The default data types used in Python are given below classified into related types.

| Data Type Group | Data Type              | Notation  | Description                                                                                                                                                       |
| --------------- | ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text Types      | String                 | `str`       | Strings are sequences of alphanumeric characters surrounded by single, double or triple (multi-line) quotations.                                                  |
| Numeric Types   | Integer                | `int`       | Int or integer is a whole number (without decimals) both positive or negative and of unlimited length.                                                            |
| Numeric Types   | Floating Point Numbers | `float`     | Float or floating point number is a positive or a negative number with one or more decimal digits. It can also be used to denote numbers in scientific notations. |
| Numeric Types   | Complex Numbers        | `complex`   | Complex numbers are numbers combinations of real and imaginary numbers. In python, imaginary part is represented using 'j'.                                       |
| Sequence Types  | List                   | `list`      | Lists are collections of values of same or different data types. Lists are ordered, changeable, allow duplicates and zero (0) indexed.                            |
| Sequence Types  | Tuples                 | `tuple`     | Tuples are collections of values of same or different data types. Tuples are ordered and unchangeable, allow duplicates and zero (0) indexed.                     |
| Sequence Types  | Range                  | `range`     |                                                                                                                                                                   |
| Mapping Types   | Dictionary             | `dict`      | Dictionaries are a collection of Key-Value pairs of data that are ordered, changeable and does not allow duplicate keys.                                          |
| Set Types       | Set                    | `set`       | Sets are collections of values of the same data type and are unordered, unchangeable, unindexed, mutable and does not allow duplicates.                           |
| Set Types       | Frozen Set             | `frozenset` | Frozensets are collections of values of the same data type and are unordered, unchangeable, unindexed, immutable and does not allow duplicates.                   |
| Boolean Types   | Boolean                | `bool`      | Booleans are used to represent the states of either True or False                                                                                                 |
| Binary Types    | Bytes                  | `bytes`     |                                                                                                                                                                   |
| Binary Types    | Byte Array             | `bytearray` |                                                                                                                                                                   |
| Binary Types    | Memory View            | `memory`    |                                                                                                                                                                   |
| Note Type       | None Type              | `NoneType`  | NoneType is not a value, but merely an absence of it. It is similar to null in some other programming languages.                                                  |

### Text Types
Python has only one default data type for working with strings of any length.

1. **Strings** (`str`)
	- Strings are sequences of alphanumeric characters surrounded by single, double or triple (multi-line) quotations.
	- Strings support many default functions and methods which can be found [here](/Studio/Expeditions/Programming/Python/Methods%20and%20Functions#String%20Methods)
	- These methods that act on the string do not change the existing string, but return a new one.
	- Strings are basically lists, so elements can be accessed via a `[]` after the string to access a character.

```python
# Variable assignment to strings
name = "Robert Jenkins" # Implicit
identity_number = "DG214122" # Implicit
city = str("New York") # Explicit Assignment (Double Quotes)
country = str('United States') # Explicit Assignment (single quotes)

# Accessing part of the string
message = "Hello World"
print(message[3]) # prints the 4th character --> l 
print(message[2:5]) # prints 3rd, 4th & 5th characters --> llo
print(message[2:]) # prints from the 3rg character till the end
print(message[-5:-2]) # prints 3 characters from 5th last position to 2 last --> Wor
```

### Numeric Types
Python accepts 3 numeric data types such as `int`, `float` and `complex` 

1. **Integers** (`int`)
	- Int or integer is a whole number (without decimals) both positive or negative.
	- Integers can be of unlimited length.
2. **Floating Point Numbers** (`float`)
	- Float or floating point number is a positive or a negative number with one or more decimal digits.
	- It can also be used to denote numbers in scientific notations.
3. **Complex Numbers** (`complex`)
	- Complex numbers are numbers combinations of real and imaginary numbers.
	- In python, imaginary part is represented using 'j'.

```python
# Variable assignment to integers
x = 10 # Implicit
x = int(10) # Explicit

# Variable assignment to floats
x = 233.12 # Implicit
x = 6.023E23 # Implicit
x = float(233.12) # Explicit

# Variable assignment to complex numbers
x = 10j # Implicit
x = 5+2j # Implicit
x = int(10j) # Explicit
```

### Sequence Types 
Sequence data types are collections of data referred

1. **Lists**
	- Lists are used to store multiple items in a single variable.
	- List can be collection of different data types in itself.
	- Lists are ordered, changeable, allow duplicates.
	- Lists are indexed and can be accessed with a positional parameter.
	- Square brackets (`[]`) are used to define lists.
2. **Tuples**
	- Tuples are collections of values of same or different data types.
	- Tuples are ordered and unchangeable, allow duplicates.
	- Tuples are indexed and can be accessed with a positional parameter.
	- Round brackets (`()`) are used to define tuples.
	- However, when accessing an element, the index is enclosed inside square brackets like `my_tuple[0]`.
3. **Range**
	- Range is a self iterating data collection.
	- It is most commonly used when iterating over the entries in a collection.
	- It evaluates to a sequence of numbers starting from zero (by default) and incrementing by 1 (by default).

```python
# Assigning values to a list 
mylist = ["apple", "banana", "cherry"]

# Accessing elements from a list 
print(mylist[0])

# Assigning values to a tuple 
mytuple = ("apple", "banana", "cherry")

# Accessing elements from a tuple 
print(mytuple[0])

# Using range to iterate over a collection 
for i in range(5):
	print(i) # prints from 0 to 4 -> iterates 5 times

```

### Mapping Types 
Maps are a key-value combination of data. The value is uniquely identified by using the key.

1. **Dictionary**
	- Dictionaries are key-value pair data type implementation in python.
	- They are ordered, changeable and does not allow duplicate keys.

```python
# Assigning values to a dictionary 
thisdict = {  
  "brand": "Ford",  
  "model": "Mustang",  
  "year": 1964  
}

# Accessing elements of a dictionary (using key)
print(thisdict["brand"])
```

### Set Types 
1. Set
	- Sets are collections of values of the same or different data type.
	- They are unordered, unchangeable, unindexed, mutable.
	- Sets do not allow duplicates.
2. Frozen Set
	- Frozensets are collections of values of the same data type and are unordered, unchangeable, unindexed, immutable and does not allow duplicates.

```python
# Assigning a set 
myset = {"apple", "banana", "cherry"}
```

### Boolean Types 
Boolean data represents the state of ON/OFF, TRUE/FALSE or 1/0.

1. **Bool**
	- In python, the bool data type has the values `True` and `False`

```python
# Evaluating expressions to boolean outputs 
print(10 > 9)
print(10 < 9)
```

### Binary Types 
1. Bytes
	- Bytes
2. Byte Array
	- Byte Array
3. Memory View
	- Memory View

### None Type
None or Null are absence of values where an empty string (`""`) or a zero (`0`) as a value cannot be substituted.

1. **NoneType**
	- In python, the none type is represented by `None` keyword.

```python
x = None
```

::: info Collections of data in python
In python, Lists Tuples, Sets and Dictionaries are the collection data types as they include a collection of similar of different data within them.
:::

::: tip Arrays in Python
Python does not support arrays by default. However the NumPy library can be imported to add support to arrays and array methods. In place of arrays, lists are commonly used.
:::
