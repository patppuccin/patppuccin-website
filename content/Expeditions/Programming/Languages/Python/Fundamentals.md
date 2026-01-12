---
description: Installing Python and running the mandatory 'Hello World' code
tags:
aliases:
publish: true
---
# Syntactical Fundamentals of Python
This guide covers the foundational rules that govern the structure and composition of Python code and cover topics such as proper indentation, correct usage of punctuation and symbols, and adherence to the syntax required by the language. Understanding and following these syntactical principles is vital for writing code that is both readable and functional. By mastering these fundamentals, developers can create Python programs that are clear, organized, and free from syntax errors.

### Input and Output
Two of the most frequent activities any programming language performs is displaying information to a user and getting input from the users. 

Printing to the console can be performed in python using the `print` statement. To print in multiple lines, `\n` can be used to indicate line breaks, where `\` functions as the escape character. To concatenate multiple strings, the `+` operator can be used. However, to concatenate a number data type to a string, the number must be converted to a textual representation before it can be concatenated.

In order to avoid multiple concatenations, the concept of `fstrings` can be used. It is accomplished by adding an `f` before the first quote within the print function, followed by mentioning the variable name within curly brackets `{}`.

```python
# Printing to the console
print("Hello World")

# Printing in multiple lines 
print("Hello World! \nPython is a beginner friendly programming language.")

# Concatenation when printing 
age = 10
name = "David"
print("Hello there " + name + ", your age is " + str(age) + ".")

# Using f-strings to avoid concatenations 
age = 10
name = "David"
print(f"Hello there {name}, your age is {age}.")
```

The `input` statement can be used to accept values from the user. The input statement waits for user input before continuation of code execution. Values accepted by the input statement are stored as text by default. If these values need to be used downstream, explicit type conversions must be made along with getting these values from the users.

```python
# Getting input from the users
name = input("What is your name? ")
age = int(input("What is your age? "))
```

In Python, escape sequences are special characters that allow the inclusion of non-printable or special characters within strings when using the `print` function. Here are some commonly used escape sequences:
- `\n` - Newline / Line Break)
- `\t` - Horizontal Tab
- `\\` - Backslash
- `\'` -  Single quote
- `\"` - Double quote

::: code-group
```python [Escape Characters]
# Using escape sequences
print("Hello\nWorld")
```

```txt [Output]
Hello
World
```

### Commenting
Commenting and Indentation are some of the most commonly used tools when writing code. Both of these help in making the code easier to read, understand and debug. The concept of [Self-Documenting Code](/Self-Documenting%20Code) is emphasized here. It means that any code written must be structured in a way that it is evident of what action it performs.

Comments are a way to document code as it is written. While code must preferably be self-documenting, comments play a major part in making sure that the code is easier to understand and troubleshoot. In python, single line commenting is made by using the `#` symbol.

Python does not have a specific syntax for multi-line comments, thus a multi-line comment is a sequence of single-line comments each preceded with a `#` sign. 

However, as python ignores string literals that are not assigned to a variable, a multi-line string can be used similar to a multi-line comment. By this way, python will read the string, but as the string is not assigned to a variable, it is ignored. Multi-line strings are made using triple quotes (`"""`) and placing the comment within the pair of these triple quotes.

```python
# this is a single-line comment 

# this is a multi-line comment - line 1
# this is a multi-line comment - line 2
# this is a multi-line comment - line 3

"""
This is a multi-line string 
This is a string literal not assigned to a variable.
Thus, python ignores it
This makes this string act as a multi-line comment
"""
```

### Indentation
Indentation refers to the spaces at the beginning of a code line. In most languages, indentation just serves the purpose of making the code easy to read and follow along. But in python, *indentation is crucial*. Python relies on indentation to differentiate blocks of code, while other languages might use braces.

Typically 4 spaces are used as the indentation standard, however even 1 space would work. The same standard must be used in a given block of code, meaning if 4 spaces are used in a block of code, then all code within the same block must use the same 4 spaces as indentation. Most text-editors and IDEs use 1 TAB key as 4 SPACES, so that less key strokes are made.

Any code that is not indented properly will throw an error on execution.

```python
# Indentation in python - Correct practice
a = 10
b = 20
if  b > a:
	print("b is greater than a")

# Indentation in python - Wrong practice - Throws an error
a = 10
b = 20
if  b > a:
print("b is greater than a")

```
