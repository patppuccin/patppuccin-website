---
title: Version Control Systems
description:
aliases:
tags:
publish: true
exclude: true
---

# Version Control Systems

**Version Control Systems** or **VCS** are a system that records changes made to a file or a set of files over a period of time. These changes can be recalled at any later point and the state of the files can be restored to that state when required. This is accomplished by taking snapshots of what changes in these files at each point in time.

## Local Version Control Systems (LVCS)

- A local VCS can be something as a _database_ that _records all the changes_ made to a file _over a period of time_.
- One of the most popular VCS systems was a tool called as _RCS (Revision Control System)_ which keeps patch sets (snapshots) in a special format on disk and can recreate the state of the file at that point as needed was of this type.
- Advantages include
  - File version _recovery at any point_ in time.
- Disadvantages include
  - _Lack of collaboration_ features.
  - _No control of the local data_ by the administrators.

## Centralized Version Control Systems (CVCS)

- In a centralized Version Control System, the changes are tracked in a _central location_ on a server.
- A number of clients connect to this server and check out the files from it.
- Systems such as CVS, Subversion and Perforce are of the Centralized Version Control System type.
- For many years, this has been the standard for version control.
- Some of the advantages of Centralized VCS over the local VCS are
  - Central location where everyone's _work is monitored_.
  - _Finer grained control_ over the files by admins
- Centralized VCS inherently had one major flaw where the VCS server being a _central point of failure_.

## Distributed Version Control Systems (DVCS)

- A Distributed Version Control System or DVCS is a system where each of the clients mirror the entire snapshot of the repository, thus each of the client has a full working copy of the files along with the change history.
- If the server gets corrupted, the data can be transferred from the client to the server and vice versa.
- Systems such as [Git](/Git%20VCS), Mercurial, Bazaar or Darcs are of this DVCS type.
- Advantages of this system
  - Central server which _enables visibility_ across the clients.
  - _No single point of failure_ in both server and the client.
