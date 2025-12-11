---
title: JavaScript
description: All about JavaScript
tags:
aliases:
  - JS
publish: true
---
# Ubiquitous Scripting with JavaScript



## Basics of JavaScript
JavaScript is an [Interpreted & Compiled programming Languages](/Interpreted%20&%20Compiled%20programming%20Languages) programming language. Almost all browsers support JavaScript. 

## Syntax

```js

	alert("Hello World");

```

- The `alert` is called as the **Keyword** or **function**.
- `"Hello World"` is called as the **Message**.
- The `;` denotes the **end of the line of code**.

When copying and pasting code from a word processor, be mindful of the quotes that surround the message. Code uses the same quotes symbol at the start and end of a string, whereas word processors use a differently styled one. 

Best practices
- Do not leave spaces between functions and messages. 
- Use double quotes to denote strings, however JavaScript does work with both.

Read more for best practices followed in the industry for JavaScript in this [GitHub Page](https://github.com/rwaldron/idiomatic.js)

---
## Data Types
Data types are a way of telling the computer what the information is and how to handle it.

The data types used in JavaScript are
1. **String** - A collection of alphanumeric characters. Enclosed within double quotes.
2. **Numbers** - A collection of strictly numbers. No special notation needed.
3. **Boolean** - It has two states, `true` or `false`

---
## Variables
Variables are placeholders that can store information so that they can be used later in the operations to follow. A general syntax of a JavaScript variable is

```js

 	var myName= "Patrick Ambrose";

```

Here, the `var` is the Keyword and the `myName` is the name of the variable. The keyword `var` is used only when initializing the variable for the first time and need not be used the subsequent times. 

### Naming conventions
1. Should **not use standalone keywords** as variable names.
2. Variables **cannot begin with a number**, however can contain after the beginning.
3. Variable names **cannot contain spaces**.
4. Allowed characters for variables include **letters**, **numbers**, **$**, **_**.
5. Variables names **do not accept hyphens**.

As a best practice, it is advisable to use **camel casing**, where the first word starts with a small case and the second starts with a capital.

## String operations
1. **String Concatenations**
Two strings can be concatenation by connecting them using the `+` operator.

```js
	alert("Hello "+"World");
```

2. **Finding the length of the string**
Using the length function, it is possible to get the length of the string.

```js
	var str="Hello World";
	var strLength=str.length;
```

3. **Slicing and extracting a part of a string**
The slice method takes two arguments. The first one is the start position to slice and the second is the second position to slice. Remember that strings are counted from 0 as programmers always count from 0. So, a slice function like `bread.slice(2,4)` would slice in the 3rd and in the 5th position. And the number of characters that it would return can be found from subtracting the first argument from the second argument. Thus, it would yield 2 characters.

```js
	var str="Hello World";
	var sliceStr=str.slice(2,5);
	alert(sliceStr);
```

The resulting string would be as `llo`
4. **Changing case of a string**
The case of the string can be changed to uppercase or lowercase by using the method `toUpperCase()` and `toLowerCase()` respectively.

```js
	var str="Hello World";
	var uprStr=str.toUpperCase();
	var lwrStr=str.toLowerCase();
```

`uprStr` would have the value `HELLO WORLD`, and `lwrStr` would have the value `hello world`

## Number Operations
### Arithmetic Operations
The basic arithmetic operators remain the same in JavaScript. So operators such as **+**, **-**. **\***, **/** function the same way.

**%** or **Modulo** is an additional operator that returns the reminder of a division operation. `5%2` would return `1` as the output. 

### Increment and Decrement Operations
In programming, a variable can be declared and can be incremented or decremented as the program progresses. This can be done using the increment or decrement process. 

```js
	var a=5;
	a=a+1;
```

However, programming languages allow to shorten this expression further as given below.

```js
	var a=5;
	a++;
```

The same applies to decrement. It can also be applied to multiple operations such as +=, -=, \*=, /= to operate (increment or decrement) on numbers greater than 1.

```js
	var a=5;
	a+=5; //add 5 to a --> a=a+5
	a-=5; //subtract 5 from a --> a=a-5
	a*=5; //multiply a by 5 --> a=a*5
	a+=5; //divide a by 5 --> a=a/5
```

### Math Operations
The JavaScript Math object allows performing mathematical tasks on numbers.

```js
	var num=2;
	var sqNum=math.sqrt(num);
```

Refer the documentation for the list of math methods. Documentation from [From w3schools](https://www.w3schools.com/js/js_math.asp#:~:text=JavaScriptb%20Math%20Methods).

## Working with Functions
Functions in JavaScript are a set of instructions in a block of code that performs a specific task. A function is executed when it is called or invoked. The reason for using functions is to make the code reusable, meaning write once, run multiple times. Read more from [w3schools](https://www.w3schools.com/js/js_functions.asp). 

A JavaScript function is defined with the `function` keyword, followed by a **name**, followed by parentheses **()**. Function names can contain letters, digits, underscores, and dollar signs (same rules as variables). The parentheses may include parameter names separated by commas: **(_parameter1, parameter2, ..._)**. The code to be executed, by the function, is placed inside curly brackets: **{}**

```js
function someFunction(parameter1, parameter2) {  
 	// code to be executed 
}
```

When calling or invoking a function, it is enough to invoke with just the name of the function followed by the rounded parentheses. 

```js
	someFunction();
```

Some of the basic types to use functions are
1. **Simple Function Call** - A function is called to execute all the arguments within itself.
2. **Function Call with Arguments/Parameters** - parameter(s) are passed into the function and the code within the function is executed. 
3. **Function Call with Return** - The called function can return an value to the expression that has called it. 

## Control Statements
Control statements are a way to check conditions and alter the flow of operations. There are 4 types of conditional statements in JavaScript
- **if** - To execute a block of code if the condition is true
-  **else** - To execute a block of code if the same condition is false.
-  **else if** - To check for a different condition if a condition is false.
-  **switch** - To specify many alternative blocks of code to be executed.

## Comparators
- **\=\=\=** - Is equal to
- **!\=\=** - Is not equal to
- **>** - Is greater than
- **<** - is lesser than
- **>=** - is greater or equal to
- **<=** - is lesser or equal to

The difference between **\=\=** and **\=\=\=** is that the **\=\=** checks only the value, whereas the **\=\=\=** checks for the data type match as well. 

To combine comparators, one of the combining operators can be used.
- **&&** - AND
- **||** - OR
- **!** - NOT

## Arrays
Arrays are variables that can hold more than 1 value. They are used to store multiple items and are represented by using the square brackets **[ ]**.

### Basic array operations
The model array is denoted as
```js
var array=["Entry 1","Entry 2","Entry 3"];
```

1. **Length of an array** - Returns the length of an array. The `length` property is always one more than the highest array index.
```js
	var lengthOfArray=array.length;
```
2. **Push an element into the array** - Pushes a new entry into the array at the last position.
```js
	array.push("Entry 4");
```
3. **Pop an element out of the array** - Removes the last element from the array.
```js
	array.pop();
```
4. **Shift elements in an array** - Removes the first element and moves the remaining elements accordingly.
```js
	array.shift();
```
5. **Unshift elements in an array** - Adds an element to the start of the array and moves the existing elements accordingly
```js
	array.unshift("Entry 0");
```

## Loops
Loops are useful when a certain block of code has to be executed a based on a condition. Some of the loops in JavaScript are discussed below. To learn more, check out the [W3Schools documentation](https://www.w3schools.com/js/js_loop_for.asp).

### While
Checks a condition or a state and then loops through a code block.

```js
	while(condition){
		//block of code
	}
```

### Do While
Loops through a code block and then checks for the condition, to see if it is true.

```js
	do{
		//block of code
	}while(condition)

```

### For
Loops through a block of code a set number of times, meaning iterate a set number of times.

```js
	for (statement 1; statement 2; statement 3) {  
 		// code block to be executed
	}
```

Here,
- **Statement 1** - Executed the one time before the execution of the code block.
- **Statement 2** - Defines the condition for the loop.
- **Statement 3** - Executed every time after the code block is executed.   

### For In
Loops through the properties of a object.

```js
	for (key in object) {  
 		// code block to be executed
	}
```

### For Of
Loops through the values of an iteratable object.

```js
	for (variable of iterable) {  
 		// code block to be executed 
	}
```

# Methods vs Functions 
Refer and take notes [YT Vid](https://www.youtube.com/watch?v=zRr5wm7oUR4) Sometimes certain functions in JavaScript are referred to as methods. In simplicity, a method is a function that is associated with an object. The association of method to an object is not too rigid as in other programming languages.

```js
	calculate();
```

The example given above is a function. It may or may not have arguments (parameters) associated with it. 

```js
	rectangle.getArea();
```

The example given above is a method as it is (fluidly) attached to the `rectangle` object

---
## Injecting JavaScript into HTML files
There are 3 ways to inject JavaScript into [HTML](../../../../../../HTML.md), and these resemble the way [CSS](../../../../../../CSS.md) can be injected into a [HTML](../../../../../../HTML.md) document. Scripts can be placed in the head section or body section or both.

## Inline JavaScript
The JavaScript instructions are injected into the HTML tag for execution. Similar to the [CSS#In-Line CSS](../../../../../../CSS.md##In-Line%2520CSS) the drawbacks are the same, being tedious and limiting.

```html
	<body onload="alert('Hello');">
		<h1>Hello World</h1>
	</body>
```

**Note** 
- There are different functions that can be invoked when injecting scripts, one such example is shown here as `onload` 
- When enclosing a string with double quotes inside a text with double quotes, the best practice is to use single quotes for the one inside, as the double quotes on both sides might be conflicting when the browser reads through the code.

## Internal JavaScript
Here the script is injected in the head section by using a script tag without a source. In this case the script is executed before the HTML document is rendered. This could cause the page to load slow based on the complexity of the script. 

```html
	<head>
		<script>
			alert("Hello World");
		</script>
	</head>
```

## External JavaScript
The JavaScript is injected from an external script source using the script tag with a source. Placing scripts at the bottom of the `<body>` element improves the display speed, because script interpretation slows down the display.

```html
	<body>
		<h1>Hello World</h1>
		
		//Some Random HTML code
		
		<script src="index.js"></script>
	</body>
```

# Document Object Model
The [Document Object Model](/Document%20Object%20Model) or [DOM](/Document%20Object%20Model) is a way of accessing elements in a web page, which is constructed by the browser when a web page is loaded. In this case, the document is a [HTML](../../../../../../HTML.md) document. 

Using the HTML DOM, any element in the HTML page can be accessed, edited, deleted or created, along with their styling via CSS.

**Properties** state the nature of a HTML element and **methods** state the action (function) they can perform. Methods always come associated with an object and with a set of parentheses in the end.

An example of how a DOM is constructed is given below

![HTML DOM.png](https://patppuccin-assets.r2.cloudflare.com/HTML%20DOM.png)

## Targeting HTML with DOM
There are multiple ways of targeting HTML elements using the DOM. Some of the prominent ones are.

## Using the DOM hierarchy


## Using HTML tags 
- This returns an array


## Using the specified classes for HTML elements
-  This returns an array.
  
## Using HTML IDs
- This returns a single value.
	
```js
	document.getElementById("item");
	// Returns a single result that matches the query 
```

## Using Query Selector**
- Allows combining selectors like CSS.
- Returns a single value only.
- In case of multiple elements matching the query, the first one that matches the query is returned.
- To return all the elements matching the query, a variation of the same is used. This returns an array of results.

```js
	document.querySelector("#navbar .home");
	// Returns a single result that matches the query 
```

```js
	document.querySelectorAll("#navbar .navelement");
	// Returns all results that match the query 
```

---
## Targeting CSS with DOM
When changing the CSS properties of the HTML elements using the DOM, there are basic rules to be followed such as
- There are no dashes between the property names such as `background-color`.
- Camel casing is used while denoting the property names, like `backgroundColor`
- The attributes are supplied as strings only.
```js
	document.querySelector("#uniqueID").backgroundColor="red";
```

---
## Separation of Concerns
The ideology of  [Separation of Concern](/Separation%20of%20Concern) is applicable here as well. JavaScript must be explicitly used for functionality and the use of the same for affecting the styles directly should be minimized. The changing of styles should be reserved for [CSS](../../../../../../CSS.md) only. 

This can be accomplished by using the class list property of a [HTML](../../../../../../HTML.md) element in a [DOM](/Document%20Object%20Model). `classList` returns the class name(s) associated with that HTML element and it can be used to add, remove or toggle CSS classes on an element.

The `classList` property is read only, but changes can be made using the `add()` or `remove()` methods.

```js
	document.querySelector("#uniqueID").classList; //shows the classes associated with the HTML element
	document.querySelector("#uniqueID").classList.add("invisible"); //adds the class invisible to the HTML element
	document.querySelector("#uniqueID").classList.remove("invisible"); //removes the class invisible to the HTML element
	document.querySelector("#uniqueID").classList.toggle("invisible"); //toggles the class invisible for the HTML element
```

## Manipulation of Text
There are 2 ways of targeting the text between HTML tags.
1. **Using `innerHTML`** - Targets all content between the specified HTML element. Also consists of any tags between the specified element.
2. **Using `textContent`** - Targets only the text between the HTML element specified.

## Manipulation of HTML attributes
It is also possible to get, put and delete HTML attributes using JavaScript via accessing elements through the [DOM](/Document%20Object%20Model). The possible actions that can be done are
- List of all attributes using the `attributes` method.
- Get the attributes and value using the `getAttribute(attributeName)` method.
- Add an attribute using the `putAttribute(attributeName,value to be changed)` method.