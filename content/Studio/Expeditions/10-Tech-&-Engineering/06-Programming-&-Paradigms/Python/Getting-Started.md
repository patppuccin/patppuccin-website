---
description: Installing Python and running the mandatory 'Hello World' code
tags:
aliases:
publish: true
---
# Getting Started with Python
Python can be run in 3 different ways and their features and who might consider using them are tabulated below. 

| Environment                              | Description                                                                                                                                                                                                      | Examples                                                                                     | Use Cases                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Text Editors                             | Platforms to write any form of textual data (of many file types) that can be customized with plugins to add functionality.                                                                                       | [Sublime Text](http://www.sublimetext.com/), [Atom](https://atom-editor.cc/)                 | Useful for lightweight python programming or scripting without the need to install any heavy software.               |
| Integrated Development Environment (IDE) | Development environment designed specifically to run python code. These are mostly larger programs with additional functionality geared towards python development. They are often offered as a Freemium option. | [PyCharm IDE](https://www.jetbrains.com/pycharm/), [Spyder IDE](https://www.spyder-ide.org/) | Useful for hardcore python development and when additional features are required to ease the process of development. |
| Notebook Environment                     | Platforms that are well suited for learning python that support in-line markdown notes. These are not regular `.py` files. But they support input and output one after the other.                                | [Jupyter](https://jupyter.org/)                                                              | Useful in visualizing and learning python in the same environment. It supports sharing of these notebooks with ease. |

Once python is installed, check if python is properly configured by checking the python version with the following command.
:::code-group
```python [Python Version]
python -V
```

```txt [Output]
Python 3.11.3
```
:::
Now, Python is up and running and ready to change the world. But before changing the world, here's a customary `Hello World` example in python.

Hello World Example

::: code-group
```python [Code]
print("Hello World")
```

```txt [Output]
Hello World
```
:::
