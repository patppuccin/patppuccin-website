---
description: Installing Python and running the mandatory 'Hello World' code
tags:
aliases:
publish: true
---
# Operators in Python
Operators are entities that are used to perform operations on variables and values. Python provides the following operator types
1. Arithmetic Operators 
2. Assignment Operators 
3. Comparison Operators 
4. Logical Operators 
5. Identity Operators 
6. Membership Operators 
7. Bitwise Operators 

## Arithmetic Operators 
These are used with numeric values to perform numeric calculations on them.

| Operator | Name           | Example |
| -------- | -------------- | ------- |
| +        | Addition       | x + y   |
| -        | Subtraction    | x - y   |
| *        | Multiplication | x * y   |
| /        | Division       | x / y   |
| %        | Modulus        | x % y   |
| **       | Exponentiation | x ** y  |
| //       | Floor Division | x // y        |

## Assignment Operators
The assignment operators are used to assign values to variables. 

| Operator | Example   | Same As      |
| -------- | --------- | ------------ |
| =        | x = 5     | x = 5        |
| +=       | x += 3    | x = x + 3    |
| -=       | x -= 3    | x = x - 3    |
| \*=      | x \*= 3   | x = x \* 3   |
| /=       | x /= 3    | x = x / 3    |
| %=       | x %= 3    | x = x % 3    |
| //=      | x //= 3   | x = x // 3   |
| \*\*=    | x \*\*= 3 | x = x \*\* 3 |
| &=       | x &= 3    | x = x & 3    |
| \|=      | x \|= 3   | x = x \| 3   |
| ^=       | x ^= 3    | x = x ^ 3    |
| >>=      | x >>= 3   | x = x >> 3   |
| <<=      | x <<= 3   | x = x <<= 3  |

## Comparison Operators
They are used to compare two values.

| Operator | Name                     | Example |
| -------- | ------------------------ | ------- |
| ==       | Equal                    | x == y  |
| !=       | Not Equal                | x !=    |
| >        | Greater Than             | x > y   |
| <        | Lesser Than              | x < y   |
| >=       | Greater Than or Equal To | x >= y  |
| <=       | Lesser Than or Equal To  | x <= y  |

## Logical Operators
Logical Operators are used to combine conditional statements.

| Operator | Description                                            | Example          |
| -------- | ------------------------------------------------------ | ---------------- |
| and      | Returns `true` if both statements are `true`           | x < 5 and x < 10 |
| or       | Returns `true` if any of the statements is `true`      | x < 5 or x < 4   |
| not      | Reverses the result - `true` is `false` and vice versa | not (x < 5)      |

## Identity Operators
Identity operators are used to compare objects if they are the actual same objects. These do not check for the similarity of content within the variable, but the actual memory location.

| Operator | Description                                            | Example    |
| -------- | ------------------------------------------------------ | ---------- |
| is       | Returns `true` if both variables are the same object   | x is y     |
| is not   | Returns `true` is both variables are different objects | x is not y |

## Membership Operators
Membership operators are used to test if a sequence is presented in an object of comparison.

| Operator | Description                                                                        | Example    |
| -------- | ---------------------------------------------------------------------------------- | ---------- |
| in       | Returns `true` if a sequence with the specified value is present in the object     | x in y     |
| not in   | Returns `true` if a sequence with the specified value is not present in the object | x not in y |

## Bitwise Operators
Bitwise operators are used to compare binary numbers.

| Operator | Name                 | Description                                                                                             |
| -------- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| &        | AND                  | Sets each bit to 1 if both bits are 1                                                                   |
| \|       | OR                   | Sets each bit to 1 if one of the two bits is 1                                                          |
| ^        | XOR                  | Sets each bit to 1 if only one of two bits is 1                                                         |
| ~        | NOT                  | Inverts the bits                                                                                        |
| <<       | Zero Fill Left Shift | Shift left by pushing zeros in from the right and let the leftmost bits fall off                        |
| >>       | Signed Right Shift   | Shift right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off |
