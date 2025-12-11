---
title: Git
description:
aliases:
tags:
publish: true
---
# Git

[Secure Shell](../Secure-Shell/index.md)

Git is a _distributed version control system_ built for _speed_, _integrity_, and _collaboration_ on codebases of any scale. Designed by _Linus Torvalds_ for the Linux kernel, Git emphasizes a _snapshot-based_ model over traditional file diffs, enabling _lightweight branching_, _instantaneous commits_, and _efficient merges_. It stores the full history of a project locally, allowing _offline access_, _fast operations_, and _robust experimentation_ through isolated _branches_ and _staging areas_. Git tracks changes using a _directed acyclic graph_ (DAG) of commits, each cryptographically verified via _SHA-1 hashes_ to ensure _data integrity_ and _immutability_. Developers use Git to manage _source code_, coordinate with _teams_, and maintain _clean, traceable project histories_. With its _decentralized architecture_, Git supports _nonlinear workflows_, _collaborative development_, and _automated CI/CD pipelines_, making it the backbone of modern _software engineering_, _open-source ecosystems_, and _DevOps_ practices.

> [!SUCCESS] `jiujitsu` - the new kid in town
> There is a modern alternative to `git` written in the [Rust programming language](../../06-Programming-&-Paradigms/Rust/index.md) called [jiujitsu]() or `jj`. It is designed to be a drop in replacement to `git`, but with a modern feature-set and a more intuitive user experience.

---
## Origins & Evolution

Git was created in **2005** by **Linus Torvalds**, the creator of the Linux kernel. The catalyst? A heated fallout with [BitKeeper](https://www.bitkeeper.org/), the proprietary version control system then used by kernel developers. Faced with the need for a *fast*, *distributed*, and *open-source* replacement, Linus built Git from scratch in just **days**, driven by three key goals

- **Performance** for massive codebases like the Linux kernel
- **Integrity** through cryptographic commit hashing
- **Decentralization** for offline workflows and resilient collaboration

Git’s core model centered on **snapshots** rather than diffs. Every commit is a complete state of the project, hashed using **SHA-1**, enabling tamper-proof history tracking. This design choice was pivotal, giving Git an edge in speed, robustness, and data integrity.

Shortly after its creation, **Junio Hamano** took over as the project’s maintainer. Under his leadership, Git’s usability and extensibility improved drastically by making the following changes

- Added **branches** and **tags** as first-class citizens
- Introduced powerful commands like `rebase`, `bisect`, and `stash`
- Built a robust **plumbing/porcelain** architecture for scripting and tooling

By **2008**, Git had become the de facto VCS for Linux development. Soon, it crossed over into general software engineering as projects like [Rails](https://rubyonrails.org/), [Android](https://www.android.com/), and [Node.js](https://nodejs.org/en) adopted it. Git's ecosystem expanded rapidly, fueled by platforms like

- [GitHub](https://github.com/) - Social coding with pull requests, forks, and issues
- [GitLab](https://about.gitlab.com/) and [Bitbucket](https://bitbucket.org/) - Open-source and enterprise-focused alternatives
- [Gitea](https://about.gitea.com/) - Lightweight, FOSS alternative to platforms like GitHub

Git also became the backbone of **DevOps workflows**, enabling concepts such as

- **Feature branching** and **code reviews**
- **CI/CD pipelines**
- **Trunk-based development** and **release tagging**

Today, Git is ubiquitous available cross-platform on *Linux*, *BSD*, *macOS*, and *Windows* used by both **open-source** and **Fortune 500** companies alike. It's taught in schools and bootcamps as an essential developer skill for this day & age. 

Despite its CLI-first nature and steep learning curve, Git has remained relevant by embracing

- **Graphical frontends** like GitKraken and Sourcetree
- **Integrations** in IDEs like VS Code, IntelliJ, and Neovim
- **Protocol support** beyond SSH and HTTPS, such as Git over Tor or IPFS

The Git project continues to evolve, with regular releases and contributions from developers across the globe. Now-a-days git primarily focusses on enhancements such as

- **Performance** (e.g., partial clones, sparse checkouts)
- **Security** (e.g., SHA-256 migration)
- **Usability** (e.g., `git switch`, `git restore`)

Despite being 20+ years old, Git remains at the heart of modern software engineering, not just as a tool, but as an ecosystem, a workflow philosophy, and a universal standard for versioning code.

---
## Fundamentals

Git is a version control system that classifies and manages files through a set of defined states and internal areas. Understanding these fundamentals is essential for reasoning about how Git tracks changes, both to individual files and to the entire codebase.

Files in a Git repository fall into two primary categories, based on whether Git is monitoring them:

- **Untracked Files** - These files exist in the working directory but are not part of version control. They are not included in any commit until explicitly added using `git add`. They appear under the “*Untracked files*” section in `git status` command.
- **Tracked Files** - These files exist in the working directory & are known to Git and included in the repository history.

Each of the git tracked files, follows a predictable state cycle with 4 distinct states:

- **Unmodified**
    - The file matches the content from the latest commit.
    - No changes detected.
- **Modified**
    - The file has changed compared to the last committed version.
    - The change is not yet staged.
- **Staged**
    - The file has been added to the staging area using `git add`.
    - It is marked for inclusion in the next commit.
- **Committed**
    - The staged changes have been recorded in the repository.
    - The file returns to the unmodified state.

This state transition is cyclic in nature starting from **unmodified** to **committed**, where each change to the file restarts the cycle.

Summary of git states and what they mean

| Classification | State      | Description                         |
| -------------- | ---------- | ----------------------------------- |
| Untracked      | N/A        | File exists, but not tracked by Git |
| Tracked        | Unmodified | No changes since last commit        |
| Tracked        | Modified   | Changes made but not staged         |
| Tracked        | Staged     | Changes staged for commit           |
| Tracked        | Committed  | Changes recorded in the repository  |

A git repository consists of three primary areas that manage file states and version history, namely 

1. **Working Directory/Tree** - This is the location that contains the actual project files visible to the user. This includes both *tracked* and *untracked* files. File editing and development occur here.
2. **Staging Area (Index)** - This section stores a snapshot of changes intended for the next commit. the changes exists as a data structure inside the `.git` directory. All changes must be staged via `git add` command before committing.
3. **Git Directory (`.git`)** - this is a hidden folder at the root of every Git repository. It stores all historical data (blobs, trees, commits), the staging area (index), configuration files, references to branches and tags, logs and optional hooks.

> [!INFO] What are repos/repositories?
> In Git, a **repository** (or _repo_) is a directory where Git tracks and manages files, subdirectories, and their history. It serves as the core structure for version control, enabling Git to monitor changes, compare versions, and support rollbacks.
> 
> Repositories can be local on your machine or hosted remotely on platforms like GitHub, GitLab, Bitbucket, or self-hosted servers.
> 
> Git’s ability to track file changes within a repository is what enables features like version history, diffs, and restoration of previous states.

---
## Syntax & Constructs

Git is primarily a command-line tool that exposes a set of commands to operate on files, branches, history, and remotes. These commands are grouped by function and reflect Git's internal model, including the working directory, staging area, repository, and the transitions between them.

> [!important] Operating Systems and Syntax Differences
>
> Path and shell behavior varies slightly across operating systems:
>
> - Linux and macOS use forward slashes (`/`) for file paths and support standard Unix-like shell commands.
> - Windows uses backslashes (`\`) for file paths in Command Prompt and PowerShell environments.
> - Git Bash on Windows emulates a Unix-like shell and expects forward slashes (`/`) in paths.
>
> Git commands remain consistent across platforms. Path separators and shell-specific conventions should be adjusted based on the environment in which Git is executed.

This section organizes commonly used Git commands into categories that align with typical development workflows. Each command performs an explicit action, enabling fine-grained control over version history and collaboration.

- **Initialization & Configuration** - Commands to create and configure a git repository
	- [Installing Git on the local machine](../../../../../../Git%20-%20Install.md)
	- [Getting Help](../../../../../../Git%20-%20Get%20Help.md)
	- [Initializing a Repository](../../../../../../Git%20-%20Init%20Repository.md)
	- [Configuring User & Repository](../../../../../../Git%20-%20Config%20User%20&%20Repo.md)
- **File Structure & Inspection** - Commands to inspect the current state of the working directory & repository
	- [Getting the Status of a Repo](../../../../../../Git%20-%20Status.md)
	- [Viewing Commit History](../../../../../../Git%20-%20Log%20History.md)
	- [Inspecting Branches and Tags](../../../../../../Git%20-%20Inspect%20Branches%20&%20Tags.md)
- **File Tracking & Staging** - Commands to move files between untracked, modified & staged states
	- [Starting to Track Files](/Git%20-%20Add)
	- [Stopping File Tracking](/Git%20-%20RM%20&%20Clean)
	- [Restoring File Content](/Git%20-%20Restore)
	- [Viewing Diffs](/Git%20-%20Diff)
- **Committing Changes** - Commands to persist changes in the repository
	- [Committing Staged Changes](/Git%20-%20Commit)
	- [Amending Previous Commits](/Git%20-%20Commit%20Amend)
	- [Signing Commits](/Git%20-%20Commit%20Sign)
- **Branching & Merging** - Managing workflows for development and isolating changes
	- [Creating & Switching Branches](/Git%20-%20Branch%20&%20Switch)
	- [Merging Branches](/Git%20-%20Merge)
	- [Rebasing Changes](/Git%20-%20Rebase)
	- [Tagging Versions](/Git%20-%20Tag)
- **Working with Remote Repos** - Commands to sync local changes to remote repositories
	- [Adding & Removing Remotes](/Git%20-%20Remote)
	- [Pushing to Remote](/Git%20-%20Push)
	- [Pulling from Remote](/Git%20-%20Pull)
	- [Setting Upstream Branch](/Git%20-%20Set%20Upstream)
- **Undoing Changes & Recovering** - Commands to revert, reset or restore repository state and changes
	- [Unstaging Changes](/Git%20-%20Unstage)
	- [Reverting Commits](/Git%20-%20Revert)
	- [Resetting to Previous State](/Git%20-%20Reset)
	- [Inspecting Reference History](/Git%20-%20Reflog)
	- [Recovering Lost Commits](/Git%20-%20Recover%20Lost)
- **Temporary Storage** - Commands to temporarily save or discard changes
	- [Saving Changes with Stash](/Git%20-%20Stash)
	- [Dropping Stashed Changes](/Git%20-%20Stash%20Drop)
- **Maintenance & Optimization** - Commands to clean up, optimize, or inspect the internal state of a Git repository
	- [Running Garbage Collection](/Git%20-%20GC)
	- [Checking Repository Integrity](/Git%20-%20FSCK)
	- [Pruning Unreachable Objects](/Git%20-%20Prune)
	- [Checking Disk Usage](/Git%20-%20Disk%20Usage)
- **Advanced Tools** - Commands for advanced workflows and internal mechanics
	- [Low-Level Repository Operations](/Git%20-%20Cat%20File%20&%20Rev%20Parse)
	- [Applying Commits Across Branches](/Git%20-%20Cherry%20Pick)
	- [Bisecting for Bugs](/Git%20-%20Bisect)
	- [Managing Submodules](/Git%20-%20Submodule)

## Resources

### Book Recommendations

- **Beginner-Friendly**
	- Git Pocket Guide – *Richard E. Silverman*
	- Version Control with Git – *Jon Loeliger* & *Matthew McCullough*
	- Git Essentials – *Ferdinando Santacroce*
- **Visual & Hands-On**
	- Learn Git in a Month of Lunches – *Rick Umali*
	- Git for Teams – *Emma Jane Hogbin Westby*
- **Intermediate to Advanced**
	- Pro Git – *Scott Chacon* & *Ben Straub*
	- Mastering Git – *Jakub Narebski*
-  **Honorable Mentions**
	- Git Recipes – *Wlodzimierz Gajda*
	- Pragmatic Version Control Using Git – *Travis Swicegood*

### Courses


### Communities


### Deep Dives


---

### Saving changes to a repo
Saving changes to a repository is done in two steps, each with a specific purpose.

1. **Staging** - Move the changes to be committed to the staging area.
2. **Committing** - Actually writing the state to the version history

### Staging changes in a repo
Staging in the context of git refers to the process of preparing changes made to a file or files for commit. Staging facilitates the users to selectively choose which changes must be committed, allowing the commits to be focused and organized.

> [!info] Keeping the commits atomic
> Care must be taken to make sure that a commit should encompass a single change or feature or a fix. In simpler terms, each commit must be focussed on one things only. This is done to facilitate easier undo and rollbacks and makes the code easier to follow and review.

To stage changes in a git repository, the `git add`  command is used.

```bash title="Staging changes in a git repository"
# Staging a specific file
git add myfile.txt

# Staging multiple files
git add myfile.txt README.md 

# Staging all changes
git add .
```

### Committing changes
Committing in the context of git means to save a snapshot of the state of a file or multiple files in the version history. Commits are like save points to which the code base can be reverted to. The command `git commit`  can be used to commit changes.

```bash title="Committing changes to a repository"
# Commit message provided via the command
git commit -m "Commit Title" -m "Commit description"

# Commit message provided via the default git text editor*
git commit 
```

Upon running the command, git saves the changes to the version history and produces a message similar to the one showcased below. However, this can also be silenced with the `-q` flag or make it more detailed with the `-v` flag.

**Note:** During the installation of git or via the global config options, it is possible to set the default text editor for git. This text editor is used when input from the user is required such as in case of supplying a commit message.

> [!info] Writing good commit messages
> Committing is at the core of the git workflow, and good commit messages are very important in communicating the changes made by the code to the existing project. This makes it easier to follow the changes for future reference or to aid in troubleshooting or bug hunting.
> 
> The following are some of the guidelines for writing a good commit message
> 
> 1. **Keep it short and concise** - A good commit message should be short and to the point. It should describe the changes made in the commit in a clear and concise manner.
> 2. **Use the imperative mood** - A commit message should be written in the imperative mood. This means using command-like language, such as "Fix bug" or "Add new feature".
> 3. **Provide context** - A commit message should provide context for the changes made in the commit. It should answer questions such as "Why was this change made?" and "What problem does it solve?"
> 4. **Use the body for more detail** - If necessary, provide more detail in the body of the commit message. This can include a description of the changes made, any relevant information about the code or files modified, and any necessary instructions for other developers.
> 5. **Follow any guidelines set by the project** - Some projects may have specific guidelines or conventions for writing commit messages. Make sure to follow any guidelines set by the project to ensure consistency and clarity.
> 

> [!info] Fixing (or) amending the last commit
> Sometimes, a change needs to be done on the last commit. This could be due to accidentally missing file(s) or typos in the commit messages and so on. The amend flag to the `git commit` command performs the redo of the previous commit. Before running a commit with the `amend` flag, changes can be made to the codebase to correct the mistakes performed in the previous commit if required.
> 
> After the changes are made, when ready to perform the commit, the command, `git commit` is run with `amend` flag as `git commit --amend`. Now git opens the commit message for the commit in the default text editor configured. By default, git uses `vim` as the text editor of choice. Now, the necessary changes can be made to the commit messages. By default, the previous commit messages are taken as the base, allowing changes to be made when committing.

### Getting the history (log) of previous commits
To know the commit history of a git repository, the `git log` command can be used. By default, a git log command returns the following 4 pieces of information.

1. **Commit hash and branch information** - Hash (digital uniquely identifying string of characters) uniquely identifies the commit and the branch information lets the user know which repository, branch and location the commit was made to.
2. **Author** - Shows the author who made the commit.
3. **Timestamp** - Shows when the commit was performed.
4. **Commit Message** - Shows the message provided by the commit author when performing the commit.

**Command:**

```bash
git log
```

**Command Output (Example)**

```txt
commit e5a5f55a235c5d2f9a4e4de4d41fa71a1a07c51f (HEAD -> master, origin/master)
Author: John Doe <johndoe@example.com>
Date:   Fri May 7 14:30:15 2021 -0400

    Add new feature

commit 0123456789abcdef0123456789abcdef01234567
Author: Jane Smith <janesmith@example.com>
Date:   Wed May 5 10:45:32 2021 -0400

    Update documentation

commit 9876543210fedcba9876543210fedcba98765432
Author: John Doe <johndoe@example.com>
Date:   Mon May 3 16:20:49 2021 -0400

    Initial commit

```

### Ignoring files and directories
A `gitignore` is a configuration file used to specify git to ignore files and folder when tracking changes in a repository. 

This is useful in cases where these files and folders are log files, secrets, build artifacts, lock files or binary files. These files might be changing frequently or can be generated by the end-user whenever required, and hence hold no value to be tracked by git.

Setting up an appropriate `gitignore` file aids in maintenance of a cleaner, more manageable and less cluttered. 

Following are some of the important questions and their corresponding workflows to keep in mind when working with `.gitignore` files. 

1. **What file and file format is the `.gitignore` file** - `gitignore` files are created as `.gitignore` (without extension) files.
2. **Where to place the file?** - `gitignore` files are usually created at the root of the repository.
3. **What if I place the `.gitignore` file in a sub-directory?** - If a `.gitignore` file is placed in a child directory to the root directory of the git repository, git uses that `.gitignore` file to ignore files in that particular directory specifically. Tt is to be noted that a `gitignore` file at a directory is applicable only to that directory and its children and not to its parents or siblings.
4. **Okay, so what is the best practice for `.gitignore` files?** - It is recommended to not have multiple `.gitignore` files per repository to avoid conflicts and complexity. Also, when a repository is collaboratively maintained, it is important that all the collaborators  have the same `.gitignore` file, to avoid ignore conflicts.
5. **Is the `.gitignore` file tracked by git?** - Yes, `.gitignore` files must be tracked by git in order for git to ignore files and folders as per the instructions stated.
6. **What if a new file/folder to be ignored is added to the `.gitignore` file after it is being tracked by git?** - Once git starts tracking a particular file/folder, git will continue tracking the file even after the `.gitignore` file is modified to ignore the file/folder. In order to remove the file from git actively tracking the file/folder, there are two options
	- *Remove the file/folder from the repository* - This process completely deletes the file or folder that needs to be stopped being tracked. This can be done using `git rm <file>` command. Post this command, the file will be removed from git's tracking as well from the repository.
	- *Remove the file/folder from git tracking only* - This removes the file/folder that needs to be stopped being tracked from git's tracking. This can be done using `git rm --cached <file>` command. Post this command, the file will be removed from git's tracking, but will remain in the repository.
7. **How to specify files/folders for ignoring?** - `.gitignore` accepts files and folders as individual entities as well as with wildcard characters. The following snippet captures some of the common formats and sequences followed when ignoring files and folders in git repositories. 

```txt title="Commonly used gitignore formats"
# ignore a specific file
some-file.txt

# ignore all files with a specific extension
*.log 

# ignore a specific directory
my-directory/

# ignore directories with a certain name
**/log-files

# ignore all files and sub-directories in a directory
logs/**

# ignore specific files in a directory and its sub-directories
logs/*.log

# ignore files that match a pattern (rule negation)
*.log
!important.log
```

### Branching
In git, branching refers to the creation of a new line of development from the existing line. Here, the line of development is referred to as branch, so called because it resembles the branches of a tree. 

Essentially, a branch is a pointer to a specific commit made in history, pointing to the state of the codebase at that point in time. Any file or folder in each branch, once created, can be changed, deleted, modified or added without affecting the parent branch it was created from as long as the author of those commits wishes to keep them separate. Essentially, commits in each branch are independent of other branches.

Once the author decides to carry over the changes to the parent branch, an operation called as merging can be done.

Git always operates in a branch. Unless changed, git creates a default branch by the name `master` or `main` whenever a new repository is created with `git init`. 

> [!info] What is the HEAD?
> In git, **HEAD** is a reference to the current commit in a repository, pointing to the tip of the current branch where the most recent commit was made on that branch. In simpler terms, HEAD is a pointer to the last commit of the current branch.  
> 

The `git branch` command is extensively used to manipulate branches. Following are some of the most common implementations of the `git branch` command.

```bash title="git branch command implementations"
# list all local branches
git branch

# list all remote branches
git branch -r

# list both local and remote branches
git branch -a

# show SHA-1 commit ID 
git branch -v

# rename a branch (HEAD on the branch)
git branch -m bug-fixes

# rename a branch - forcefully (HEAD on the branch)
git branch -M bug-fixes

# delete a branch (HEAD on another branch)
git branch -d bug-fixed

# delete a branch - Forcefully (HEAD on another branch)
git branch -D bug-fixed
```

### Switching branches
The command `git switch` can be used to switch from one branch to another. Both `git switch` and `git checkout` are commands that can be used to switch to new branches. 

`git checkout` used to be the only way to change branches in older versions of git (prior to version 2.23). In newer versions of git (since version 2.23), the command `git switch` was introduced. 

`git switch` is aimed at providing an intuitive and streamlined way of changing branches in git repositories in branching and committing.

Following are some of the differences between `git checkout` and `git switch` commands.

1. **Simplistic** - `git switch` command is simpler as it takes only one argument, where `git checkout`, being able to do more complex things, is inherently more complex.
2. **Less error prone** - Due to its complex nature, `git checkout` command is more error-prone to the simplistic git switch command
3. **Data loss protection** - The `git switch` command has built-in checks to prevent data loss, when trying to switch to a different branch with uncommitted changes in the working branch, which git checkout lacks, which may lead to data loss. When trying to switch branches with uncommitted changes, the `git switch` command prompts to `commit` or `stash` the changes.

**Commands:**

```bash title="git switch and git checkout to change branches"
# switching to a new branch with git switch
git switch bugfix

# create and switch to a new branch
git switch -c bugfix

# switching to a new branch with git checkout
git checkout bugfix
```

### Merging branches
In git, merging is the process of combining changes from different branches and integrating them into a single branch. When two branches are merged, git makes a new commit that combines the changes from both the branches. 

By default, git manages conflicts when merging two branches and performs a new commit if necessary. To merge branches, first switch to the branch into which the changes need to be recorded (target branch) using `git switch` or `git checkout` commands. Next, merge the source branch using the git merge command.

```bash title="merging branches"
# merging a branch to the main branch (HEAD not on bug-fixed)
git merge bug-fixed
```

The following are some of the most commonly used types of merges in git.

1. **Fast-forward merge** - A fast-forward merge occurs when the branch you are merging into has not diverged from the branch you are merging in any way. In this case, Git can simply move the pointer of the branch you are on to the latest commit on the other branch. This type of merge is fast because it does not create a new merge commit.
2. **Recursive merge** - A recursive merge is the default merge strategy used by Git. It is used when the branches you are merging have diverged and cannot be fast-forwarded. Git creates a new merge commit that combines the changes from both branches. In this case, git prompts the merge author for a commit message for the new commit that arises from merging the two branches.
3. **Octopus merge** - An octopus merge is a type of recursive merge that allows you to merge multiple branches into a single branch at the same time. This is useful when you have several branches that you want to integrate into a single codebase.
4. **Squash merge** - A squash merge allows you to merge changes from a feature branch into another branch as a single commit. This can be useful if you want to keep the commit history of your main branch clean and concise.
5. **Rebase merge** - A rebase merge is a way of integrating changes from one branch into another by replaying the changes made in the source branch on top of the target branch. This can be useful when you want to keep the commit history linear and avoid creating merge commits.

**Merge Conflicts** occur in git when two branches are merged and have changes in the same file(s), that git cannot automatically merge them. This is because, git might not know which changes to keep and which changes to discard. Merge conflicts typically occur, when the same section of a file is modified in both the branches.

Merge conflicts need to be manually resolved before a commit can be made. Changes in both the branches are reviewed and the appropriate content is kept, discarding the one that is not required.

The following snippet shows how a merge conflict is presented to the merge author to be manually resolved.

```txt
<<<<<<< HEAD (Current Change) 
Some changes  in the existing branch
=======
Some changes that are incoming to the existing branch
>>>>>>> NEW-BRANCH (Incoming Change)
```

The following are the steps to resolve a merge conflict

1. Make the essential changes on the file.
2. Remove the conflict markers
3. Stage the file with `git add` 
4. Commit the file with `git commit`

It is important to note that merge conflicts are very time-consuming and complex especially when a lot of changes are conflicting or when multiple files are in conflict.

Here are some steps to take to avoid merge conflicts

1. **Keep the branches small** - One of the main causes of merge conflicts is when multiple developers are working on the same file or section of code. To minimize the risk of conflicts, it's a good idea to break up the work into small, focused branches that only modify a few files or lines of code.
2. **Pull frequently** - Before starting to work on a branch, make sure to pull the latest changes from the remote repository (if applicable) to ensure that the branch is up-to-date with the latest changes made by other developers. This can help prevent conflicts that arise from changes made by other developers.
3. **Communicate with the team** - If changes to the same section is required and known, it's a good idea to communicate with the other developers beforehand to coordinate your efforts and avoid conflicts.
4. **Use descriptive commit messages** - When making a commit, make sure to use a descriptive commit message that explains what changes were made. This can help other developers understand the changes and can help prevent conflicts that arise from misunderstandings.
5. **Test the changes** - Before merging branches, make sure to test the changes thoroughly to ensure that they work as expected. This can help prevent conflicts that arise from bugs or errors in the code.
6. **Use merge tools** - There are several merge tools available that can help resolve conflicts more easily. These tools can highlight conflicting changes and allow comparing and merging the changes more easily.

> [!info] Conflict Resolution - IDE Tools
> Most IDEs come with built-in tools to handle and resolve merge conflicts. These could include, but limited to accepting the current change (from the target branch), accepting changes from the incoming branch, accepting both changes and so on. 
> 
> It is important to learn to use these tools that are built into these IDEs to make the process easier.

### Finding the difference
The `git diff` command displays the differences between the two versions of a file using a unified diff format, which shows the added and removed lines in the file. The output of the command can be customized using various options and flags to change the format, scope, and level of detail of the output. `git diff` just provides information and does not alter the repository in any form (similar to `git log` and `git status`).

Following section explains the general output of the git diff command and how to make sense of what each part means.

```txt
diff --git a/Shopping-List.md b/Shopping-List.md
index 47e4552..08c9a76 100644
--- a/Shopping-List.md
+++ b/Shopping-List.md
@@ -5,3 +5,10 @@ Store: David's Store
 ### Monthly Shopping Items
 Get the following things each month
+Corn Flour
+Jam
+Chocolate Spread
+Noodles
+Rice
+Carrots
+Tomatoes
 Do not forget to take a bag to carry the grocery items. 
```


Some of the most common implementations of git diff are given below for reference

```bash
# Differences between working directory and staging area
# These are changes not staged for commit
git diff

# Differences between staging area and last commit
# These are changes that staged and are yet to be committed
git diff --staged
git diff --cached

# Differences between working directory and a particular commit
# This shows the changes since a particular commit
git diff <commit>
git diff HEAD~2
git diff 4a23590..2c63590

# Differences between the current branch and another branch
# This shows what changes have been made across files
git diff <branch>
git diff bugfix # diff between current branch and bugfix branch
git diff bigfix..main
git diff bigfix main

# NOTE: All these changes can be directed towards a specific file
git diff HEAD feature.js
git diff HEAD feature.js app.js
```

### Stashing the changes
Stashing is the process of temporarily saving changes in a repository into a stash, without committing those changes. This returns a clean working directory, where the it leaves room for other operations such as branch switching, committing other changes and so on. 

The `git stash` command is used to perform stashing. Following are some of the most commonly used stashing operations.

1. **Stash Changes** - To stash current changes, run `git stash save` or simply `git stash`. This will save both the modified and staged files in a new stash.
2. **View Stashes** - To view a list of all available stashes, run `git stash list`. It will display the stash index number, description, and the branch where the stash was created.
3. **Apply Stash** - To apply the most recent stash and restore the changes to the working directory, run `git stash apply`. This will merge the changes from the stash into the current branch.
4. **Apply Specific Stash** - If multiple stashes exist, a specific stash can be applied by specifying its index number, such as `git stash apply stash@{2}`. The stash number can be obtained via the `git stash list` command.
5. **Drop Stash** - When a stash is no longer needed, it can be removed from the stash stack using `git stash drop stash@{1}`. This action cannot be undone.
6. **Pop Stash** - To apply the most recent stash and remove it from the stash stack in one step, run `git stash pop`.
7. **Clear the stash** - To clear out the entire stash, run `git stash clear`.

```bash
# Save a stash with description
git stash save "Boss asked me to switch branches"

# View all stashes
git stash list

# Apply the most recent stash to the working directory
git stash apply

# Apply a specific stash to the working directory
git stash apply stash@{2}

# Remove/delete a specific stash
git stash drop stash@{3}

# Apply and remove the most recent stash
git stash pop

# Apply and remove a specific stash
git stash pop stash@{2}


```

**Note** - It is possible to save a stash in one branch and then `git stash apply` or `git stash pop`  them in another branch. This is done by making changes in a branch, stashing them, switching to another branch with `git switch <branch>`, then running `git stash apply` or `git stash pop` .

### Checking out an old commit
To checkout the state of the repository at a specific commit's point in time, the `git checkout` command can be used along with the commit identifier such as the commit hash.

When an older commit is checked out, git enters what is called as a **detached HEAD** state. In this state, git allows the user to explore the codebase of the repository at that point in time and facilitates making changes if needed. This basically moves the HEAD to that specific commit, where usually HEAD refers to a branch and not a specific commit.

The following outline specifies the workflow for working with older commits.

1. **Checking out an old commit** - To checkout an older commit, a commit identifier such as the commit hash (at least first 7 characters) must be known. With the identifier information, use the `git checkout <commit_identifier>` command. Now, git moves the HEAD to that specific commit and enters the detached HEAD state.
2. **Detached HEAD state** - The state so called, as HEAD usually refers to an entire branch and not a single commit is when the HEAD points to the commit of interest. Any changes made in this state will not be associated with a branch.
3. **Inspecting commit and making changes** - Any changes made at this point will not be associated to a branch and will be lost unless saved specifically. To save the changes, a new branch can be created at the current commit level.
4. **Returning to a branch** - To return to a branch or create a new branch, the `git checkout` command can be used with the reference to the branch name.
5. **Re-attaching the HEAD** - Once the HEAD moves to a specific branch, the HEAD is said to be in attached state once again as it goes back to referencing a branch rather than a commit when it first detached while checking out an older commit.

```bash
# Checking out an older commit
git checkout 4e237h5

# Detached HEAD state

# Inspecting commit and making changes

# Attaching HEAD / Returning to a branch
git checkout main
```

### Discarding changes
If changes made after a commit is to be discarded, the command `git checkout` can be used. This reverts the state of the repository to the commit specified in the command. Doing this will remove all the changes that were made after the last commit.

```bash
# Discarding changes from a specific file (Method 1)
git checkout HEAD fruits.txt

# Discarding changes from all files (Method 1)
git checkout HEAD .

# Discarding changes from a specific file (Method 2)
git checkout -- fruits.txt veggies.txt

# Discarding changes from all files (Method 2)
git checkout -- .
```

Another command that can be used to perform the discarding of the changes since a commit is `git restore`

```bash
# Discarding changes from a specific file
git restore fruits.txt

# Discarding changes from all files
git restore .

# Reverting state to a specific commit for specific files
git restore --source HEAD~2 fruits.txt

# Reverting state to a specific commit for all files
git restore --source HEAD~2 .
```

Note that following the `git checkout` and `git restore` commands to discard changes removes the uncommitted changes from the repository, thus using them with caution is recommended.

### Un-staging changes
If the aim is just to un-stage the changes made in a repository, there-by keeping all the files in which the changes were made, again the `git restore` command can be used with the `--staged` flag.

```bash
# Unstaging changes to a specific file
git restore --staged fruits.txt

# Unstaging changes to all files
git restore --staged .
```

The same functionality, of removing the staged files can be done with the command `git reset` as well. The `git reset` command with the flag `--` un-stages the changes made to the repository that is not committed. 

```bash
# Un-staging all changes and revert to the previous commit
git reset --
```

It is to be notes that the git reset command works at the scope of a commit history, and thus will not allow to reset only one file. To un-stage the changes in one single file, use the `git restore` command. 

Note that running the git reset command without the -- flag behaves differently, and performs an undo on the last commit.

### Undoing commits
Sometimes, the commits made to a branch might have to be undone for various reasons. For this purpose, the `git reset` command can be used.

The `git reset`  command is commonly specified with one of 3 flags, namely

1. **Soft Reset with `--soft`** - Reverts back the branch pointer to a commit, but preserves the changes in the staging area. Changes in the working directory and staging area are preserved. 
2. **Mixed Reset with `--mixed`** - This is the default option, when no flag is specified. Reverts back the branch pointer to a commit, and matches the staging area to the commit. Changes in the working directory are preserved.
3. **Hard Reset with `--hard`** - Reverts back the branch pointer to a commit. This discards any and all changes to the working directory and the staging area. Needless to say, care must be taken before performing this action, as all changes will be lost.

```bash
# Soft Reset - Preserve changes in working directory & staging area
git reset --soft 423a145

# Mixed Reset - Preserve changes in working directory
git reset --mixed 423a145

# Mixed Reset - DOES NOT PRESERVE CHANGES
git reset --hard 423a145

# NOTE: Also accepts dynamic HEAD pointers
git reset 423a145 HEAD~2
```

### Reverting commits
The command `git revert` is used to create a new commit that sets the state of the repository as per a previous commit. This allows to safely revert/undo a commit while preserving the commit history.

Here, a new commit is made that reverses the changes made in the specified commit. This ensures that the commit history remains intact and that the original commit is not removed or modified. 

Here are some key pointers when it comes to git revert

- It creates a new commit, so the commit history is preserved.
- It's a safe way to undo changes, especially in shared repositories where you don't want to modify the existing history.
- It can revert a single commit or a range of commits

```bash
# Revert to a previous commit
git revert 423a145
```

It is important to note that the command `git revert` functions at the commit level and will not be able to revert a specific file. To revert specific changes within a commit, other git commands such as `git cherry-pick`, `git reset` or interactive rebase via `git rebase -i` shall be used.

However it is to be noted that, `git revert` can introduce conflicts if the changes being reverted conflict with the subsequent changes. Thus, it is recommended to review the changes and test the reverted state before sharing the code to a shared repository. 

---
## Git under the hood

---
## Git Reference

> [!info] Git Cheatsheets
> - [GitHub Training Kit - GitHub Cheatsheets](https://training.github.com/)
> - [Visual Git Cheatsheet - NDP Software](https://ndpsoftware.com/git-cheatsheet.html#loc=index;)

---

> [!important] Operating Systems and Syntax differences
> Please note that Linux/Unix based operating systems such as Linux Distros and MacOS use slightly different set of commands to navigate the command line while Windows uses a different one.
> 
> Also Windows works with a backward slash (`\`) while Linux/Unix based operating systems work with a forward slash (`/`). This is accounted when moving directories while working with git. However git is built on bash, so when using git-bash, a forward slash (`/`) is to be used in windows.
> 
> That being said, in Windows [PowerShell](../../06-Programming-&-Paradigms/PowerShell/index.md) is the preferred Shell of choice. All of these commands work on PowerShell as well. Just being mindful on the slash type (`/`or`\`) is required nonetheless.

Clone an existing repository
In order to get a local copy of a pre-existing repository from a server or other location, the `git clone` command can be used. The source for this repository can be from a remote server or another location on the local machine. There are different transfer protocols on which an existing directory can be cloned. Two of the most common ones are showcased below.

```PowerShell
# Clone an existing repository in the current directory (https)
git clone https://github.com/UniqueUser/RealRepo.git

# Clone an existing repository in the current directory (https)
git clone https://github.com/UniqueUser/RealRepo.git "C:\Users\UniqueUser\Learning Git"

# Clone an existing repository in the current directory (ssh)
git@github.com:UniqueUser/RealRepo.git

```

> [!caution] Cloning via SSH
> In order to clone a repository via SSH, appropriate SSH access has to be set up with the source machine and the local machine.
