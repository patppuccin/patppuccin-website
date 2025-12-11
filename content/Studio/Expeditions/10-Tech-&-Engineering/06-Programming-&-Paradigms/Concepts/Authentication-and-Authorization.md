---
title: Authentication and Authorization
description: About authentication and authorization
publish: true
aliases:
---
- **Authentication:** Verifies **who you are** using credentials like usernames, passwords, or biometrics. It's the first step in security.
- **Authorization:** Determines **what you can access** based on roles, permissions, or policies. It happens after authentication.

> [!INFO] Real-World Analogy (Authentication vs Authorization)
> - **Authentication:** Showing your ID at the entrance to prove who you are.
> - **Authorization:** Being granted access to specific areas of a building based on your role (e.g., employee vs. visitor)
Both processes are critical for securing systems and are often used together to ensure robust security.

##  Comparison and Contrast: Authorization vs. Authentication

| **Aspect**              | **Authentication**                                                     | **Authorization**                                                    |
| ----------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Definition**          | Verifies the identity of a user.                                       | Determines what actions or resources a user is allowed to access.    |
| **Purpose**             | Ensures the user is who they claim to be.                              | Grants or denies permission to resources based on policies or roles. |
| **Process**             | Involves validating credentials like passwords, biometrics, or tokens. | Involves checking permissions against roles, policies, or rules.     |
| **Focus**               | Answers "Who are you?"                                                 | Answers "What can you do?"                                           |
| **Data Used**           | User credentials (username, password, etc.).                           | User roles, permissions, access control lists (ACLs).                |
| **When It Happens**     | The first step in security; occurs before authorization.               | Happens after authentication to enforce access controls.             |
| **Example**             | Logging in with a username and password.                               | Allowing access to a specific file, feature, or API endpoint.        |
| **Technology Examples** | OAuth, OpenID Connect, Multi-Factor Authentication (MFA).              | Role-Based Access Control (RBAC), Access Control Lists (ACLs).       |

## Key Differences:

1. **Order of Operation:** Authentication happens **before** authorization. You must verify identity before deciding permissions.
2. **Identity vs. Access:** Authentication is about proving identity, while authorization is about granting or denying access to resources.
3. **Use Cases:** Authentication handles **who gets in**, while authorization handles **what they can do once inside**.
