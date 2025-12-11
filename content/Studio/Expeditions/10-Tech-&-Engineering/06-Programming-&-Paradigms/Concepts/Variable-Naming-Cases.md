---
title: Variable Naming Cases
description:
publish: true
aliases:
  - case
---
# Variable Naming Cases in Programming

Naming conventions are essential in programming to ensure code is clean, readable, and consistent. By using specific naming styles for variables, functions, classes, and constants, developers create code that is easier to understand and maintain.

This guide highlights the most commonly used naming cases, their formats, and their applications in different programming languages. From the widely adopted **camel case** in JavaScript to **snake case** in Python and **Pascal case** for class names, each naming style serves a specific purpose.

The table below provides a concise overview of these naming conventions, followed by detailed examples.

| **Case**         | **Format**             | **Languages**               | **Example**                    |
| ---------------- | ---------------------- | --------------------------- | ------------------------------ |
| Camel Case       | `lowerCamelCase`       | JavaScript, Java, Go, Swift | `userName`, `calculateTotal`   |
| Snake Case       | `lower_snake_case`     | Python, Ruby, SQL           | `user_name`, `calculate_total` |
| Pascal Case      | `UpperCamelCase`       | C#, Java, Go, Swift         | `UserName`, `CalculateTotal`   |
| Upper Snake Case | `UPPER_SNAKE_CASE`     | Python, Java, C, Ruby       | `MAX_LIMIT`, `DEFAULT_TIMEOUT` |
| Kebab Case       | `lower-kebab-case`     | CSS, HTML, JavaScript       | `user-profile`, `data-entry`   |
| Dot Case         | `lower.case.with.dots` | JSON, YAML, Config files    | `user.name`, `file.version`    |

### Camel Case

- **Format:** `lowerCamelCase`
- **Description:** The first word is lowercase, and subsequent words are capitalized. Widely used for variables, functions, and method names.
- **Languages:** JavaScript, Java, TypeScript, Go (private variables/methods), Swift.
- **Example:**

```javascript
let userName = "JohnDoe";
function calculateTotal(price, tax) {
    return price + tax;
}
```

### Snake Case

- **Format:** `lower_snake_case`
- **Description:** All words are lowercase and separated by underscores. Common in Python and databases for readability.
- **Languages:** Python, Ruby, SQL, C.
- **Example:**

```python
user_name = "JohnDoe"
def calculate_total(price, tax):
    return price + tax
```

### Pascal Case

- **Format:** `UpperCamelCase`
- **Description:** Similar to camel case, but the first letter of every word is capitalized. Frequently used for class names, enums, and constructor functions.
- **Languages:** C#, Java, Go (exported variables/functions), Swift.
- **Example:**

```java
public class UserAccount {
    private String UserName;

    public UserAccount(String userName) {
        this.UserName = userName;
    }
}
```

### Upper Snake Case

- **Format:** `UPPER_SNAKE_CASE`
- **Description:** All words are uppercase, separated by underscores. Standard for defining constants.
- **Languages:** Python, Java, C, Ruby.
- **Example:**

```python
MAX_LIMIT = 1000
DEFAULT_TIMEOUT = 30
```

### Kebab Case

- **Format:** `lower-kebab-case`
- **Description:** Words are lowercase and separated by hyphens. Popular in CSS class names and URLs.
- **Languages:** CSS, HTML, JavaScript (for file names or configs).
- **Example:**

```css
.user-profile {
    font-size: 16px;
    color: #333;
}
```

### Dot Case

- **Format:** `lower.case.with.dots`
- **Description:** Words are lowercase and separated by dots. Primarily used in configurations or keys in data formats.
- **Languages:** JSON, YAML, Configurations.
- **Example:**

```json
{
  "user.name": "JohnDoe",
  "user.age": 25
}
```
