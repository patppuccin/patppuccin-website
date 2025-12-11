---
title: Golang
description: Learning and possibly mastering the Go programming Language
tags:
aliases:
  - Go
  - Go programming Language
publish: true
---
**Go**, also referred to as **Golang** is a programming language developed by Google in 2007. It's designed for simplicity, performance, and concurrency. Go has a *built-in concurrency model* with goroutines and channels. It includes a *garbage collector* for *automatic memory management*. Go is popular for building *high-performance systems* and *network applications*. Go modules is the *built-in package manager* for dependency management. Go is a great option for developers who want to build *fast*, *efficient*, and *scalable* systems.

## History of Golang

The development of Golang started in 2007. The language was first announced publicly in November 2009 and was officially released in March 2012. Go was created by a team of three developers at Google, *Robert Griesemer*, *Rob Pike*, and *Ken Thompson*, with the goal of creating a new programming language that was more productive, efficient, and scalable than existing languages. Go was designed to address some of the limitations of other programming languages, such as slow compilation times, verbose syntax, and lack of support for concurrency. The language was also designed to be *easy to learn and use*, with a *minimalist syntax* and a *focus on simplicity*.

Go's development was heavily influenced by other programming languages, particularly C, Pascal, and the programming language Alef, which was also developed by Rob Pike and others at Bell Labs in the 1980s. Go's development has been *guided by an open source community*, with contributions from many developers around the world. The language has seen rapid adoption, particularly in the field of *cloud computing*, *distributed systems* and *DevOps*. Today, Go is used by many major companies, including Google, Uber, Dropbox, and Netflix, among others. Go continues to evolve, with new releases and updates bringing new features and improvements to the language. The language has gained a reputation for being fast, efficient, and easy to use, and is increasingly seen as a viable alternative to other popular programming languages such as Python, Ruby, and Java.

## Why Golang?

The syntax of Golang is influenced by C, but it also includes features from other programming languages, such as Pascal and Modula-2. Here are some key features of the Golang syntax:

1.  **Simple and readable** - The syntax of Golang is designed to be simple and readable, with a minimal amount of keywords and syntax. This makes it easy for developers to understand and maintain code.
2.  **Statically typed** - Golang is a statically typed language, which means that variable types are declared at compile time. This helps to catch errors early in the development process.
3.  **Package-based** - Golang organizes code into packages, which are collections of functions, types, and variables. Packages can be imported and used by other packages, making it easy to reuse code and manage dependencies.
4.  **Pointers** - Golang includes pointers, which are variables that hold the memory address of another variable. Pointers are used to create more efficient code and to allow for direct manipulation of memory.
5.  **Concurrency support** - Golang includes built-in support for concurrency through goroutines and channels. Goroutines are lightweight threads that allow for parallel execution of code, while channels provide a safe and efficient way to share data between concurrent processes.
6.  **Garbage collection** - Golang includes a garbage collector that automatically manages memory, freeing developers from having to worry about manual memory management.
7.  **Error handling** - Golang includes a built-in error handling system, which makes it easy to handle and propagate errors throughout a program.

## Getting Started with Golang

The motive of this section is to write the very first go program and run it. Unsurprisingly, the `hello world` program makes an appearance.

### Installing Golang

Golang is available on all major operating systems as [compiled binaries](https://go.dev/dl/). Golang can also be installed on the respective operating system via the package managers. It can also be built from the source with the instructions available [here](https://go.dev/doc/install/source). 

> [!INFO]- Install Golang on Linux
> 
> **Step 1: Remove previous Go installations** - remove any remnant installations of golang by deleting the `/usr/local/go` folder (if it exists) and then extract the archive just downloaded onto the folder `/usr/local/go`.
> 
> ```shell
> rm -rf /usr/local/go && tar -C /usr/local -xzf \<downloaded-file>
> ```
> This may require to run as `root` or with `sudo` privileges 
>
> Do not untar directly onto the existing `/usr/local/go` . This is known to produce broken installations
> 
> **Step 2: Add Go to PATH** - To add golang commands to path, add the file to the shell profile config file at `$HOME/.bashrc` (or similar for the shell of preference) or at `/etc/.bashrc` (or similar for the shell of preference).
> 
> ```shell
> export PATH=$PATH:/usr/local/go/bin
> ```
> 
> After adding to path, login to the terminal session once again to let the profile changes take effect
> 
> **Step 3: Check Installation** - To check if golang has been properly installed on the system, run the following command which should print the version of go that has been installed
> 
> ```shell
> go version
> ```

> [!INFO]- Install Golang on a Mac
> 
> **Step 1: Just follow the prompts** - The package downloaded automatically installs golang on `usr/local/go` and then automatically add it to PATH. Restart terminal sessions for these updates to take effect.
> 
> **Step 2: Check Installation** - To check if golang has been properly installed on the system, run the following command which should print the version of go that has been installed
> 
> ```shell
> go version
> ```

> [!INFO]- Install Golang on Windows
> 
> **Option 1: MSI Installer**
> 
> **Step 1: Just follow the prompts** - The package downloaded automatically installs golang onto `Program Files (x86)` and then automatically add it to PATH. Restart terminal sessions for these updates to take effect.
> 
> **Step 2: Check Installation** - To check if golang has been properly installed on the system, run the following command which should print the version of go that has been installed
> 
> ```shell
> go version
> ```
> 
> **Option 2: Using Package Managers**
> 
> **Step 1: Choose what suits you** - Select between [Scoop](https://scoop.sh) or [Chocolatey](https://chocolatey.org/) as the package manager and search the respective repositories to download the latest binary release.
> 
> Using the Scoop Package Manager
>
> ```shell
> scoop install main/go
> ```
>
> Using the Chocolatey Package Manager
>
> ```shell
> choco install golang
> ```

It is recommended to use an IDE or a code editor when working with golang to make use of the linting, syntax highlighting and error prompting. [VS Code](https://code.visualstudio.com/) is a solid recommend for everyone and [neovim](https://neovim.io/) is a beautiful option if you are a masochist.

### Initializing a Go Project

Most golang projects start with a `go mod init` command run at the command line. This leads to the creation of a file called `go.mod`. 

`go.mod` is a file that is used to track dependencies for the current go project. the following are some of the reasons why initializing a go module is considered best practice.

1. **Dependency Management** - `go mod init` is essential for managing dependencies in a Golang project. The `go.mod` file created by `go mod init` command tracks the versions of dependencies used in the project and ensures that they are compatible with each other.
2. **Versioning** - `go.mod` file assists in versioning of the code and its dependencies. This assists in easy sharing and reuse of the same code across teams and projects.
3. **Portability** - `go.mod` file is self-contained, meaning that it can be moved to different environments and build systems.
4. **Compatibility** - `go mod init` is designed to be backwards-compatible, meaning that it can be run on older Golang projects and it would still work without any issues.

```go
# General Syntax
go mod init <project-name>
```

```go
# Example init command
go mod init hello-world
```

```go
# Example init command with shared repo url
go mod init github.com/org-name/project-name
```
### Running the first Go Program

For the classic hello world program, in golang, it is written as follows

```go hello-world.go
package main

import fmt

func main() {

	fmt.Println("Hello World. Shall we 'GO'?")

}
```

Let's break this code down.
- **What is `package main`?**
	- `package main` is a declaration usually found in files named `main.go`.
	- These are declarations that the go compiler uses to compile the files to an executable.
	- It tells the compiler that this is intended to be an executable program and not a package that is intended to be imported into other programs.
	- `package main` must be the first line of the code and the file must contain a `main` function.
- **What are we importing?**
	- The import statement is used to include code from other packages in the current program.
	- When a package is imported, all the functions, types and variables exposed by the package will be available to use by the importing program.
	- In the example provided above, the standard `fmt` package (part of golang standard library) is imported. `fmt` provides functions for formatting input and output.
	- By best practice standards, it is not recommended to import packages that are not used by the program.
- **The `main()` function**
	- The go compiler begins to execute code at the main function (provided the program has a package main statement).
	- This function is the entry point for code execution, where the code/program logic begins evaluation. 

Once the code is all written up, the next step is running the code. The execution of golang code is done via the Go runtime, as it compiles and runs the code. This is done via the `go run` and `go build` commands.

```go
# Builds and runs the code
go run hello-world.go
```

```go
# Builds the code to an exe
go build hello-world.go
```
## The Basics of Golang

The motive of this section is to go through all the basic necessary concepts in golang by covering the following topics.

1. Getting help in golang
2. Understanding the Go runtime
3. Commenting Code
4. Data Types and Variables
5. Basic IO operations
6. String Manipulation
7. Operators
8. Control Structures
9. Data Structures
10. Error Handling
11. Modules and Packages
12. Concurrency
13. Packaging and Deployment
14. Version Control
15. Testing and Debugging
### Getting Help



### Understanding the Go runtime

### Commenting Code

### Data Types and Variables

### Basic IO Operations

### String Manipulation

### Operators

### Control Structures

### Data Structures

### Error Handling

### Modules & Packages

### Concurrency

### Packaging and Deployment

### Version Control

### Testing and Debugging

## Continuous Learning

## Projects

## Learning Resources

