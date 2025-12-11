---
title: Version Control Systems
description:
aliases:
tags:
publish: true
---
# Version Control Systems

**Version Control Systems** or **VCS** are a system that records changes made to a file or a set of files over a period of time. These changes can be recalled at any later point and the state of the files can be restored to that state when required. This is accomplished by taking snapshots of what changes in these files at each point in time.

## Local Version Control Systems (LVCS)

- A local VCS can be something as a *database* that *records all the changes* made to a file *over a period of time*.
- One of the most popular VCS systems was a tool called as *RCS (Revision Control System)* which keeps patch sets (snapshots) in a special format on disk and can recreate the state of the file at that point as needed was of this type.
- Advantages include
	- File version *recovery at any point* in time.
- Disadvantages include
	- *Lack of collaboration* features.
	- *No control of the local data* by the administrators.

## Centralized Version Control Systems (CVCS)
- In a centralized Version Control System, the changes are tracked in a *central location* on a server.
- A number of clients connect to this server and check out the files from it.
- Systems such as CVS, Subversion and Perforce are of the Centralized Version Control System type.
- For many years, this has been the standard for version control.
- Some of the advantages of Centralized VCS over the local VCS are
	- Central location where everyone's *work is monitored*.
	- *Finer grained control* over the files by admins
- Centralized VCS inherently had one major flaw where the VCS server being a *central point of failure*.

## Distributed Version Control Systems (DVCS)
- A Distributed Version Control System or DVCS is a system where each of the clients mirror the entire snapshot of the repository, thus each of the client has a full working copy of the files along with the change history.
- If the server gets corrupted, the data can be transferred from the client to the server and vice versa.
- Systems such as [Git](/Git%20VCS), Mercurial, Bazaar or Darcs are of this DVCS type.
- Advantages of this system
	- Central server which *enables visibility* across the clients.
	- *No single point of failure* in both server and the client.