---
title: Introduction to HLS
description: A brief introduction to HTTP Live Streaming.
cover: https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&h=900&fit=crop&auto=format&q=80
tags:
aliases:
publish: true
publishDate: 2023-03-01
---
HTTP Live Streaming, or HLS, is a media streaming protocol created by Apple. It delivers video over standard HTTP. That single design choice is why it won.

Instead of sending one continuous video file, HLS chops media into small chunks. Clients fetch these chunks one by one. Playback adapts as network conditions change. Simple idea. Big consequences.

## The Core Idea

HLS works on three moving parts.

- A **playlist** file. Plain text. Ends with `.m3u8`.
- **Media segments**. Usually `.ts` or `.mp4` chunks.
- A **client player** that understands both.
  
The playlist acts like a table of contents. The player reads it. Downloads the next segment. Plays while buffering the next one. Streaming without a dedicated streaming server. Just HTTP doing HTTP things.

## Why HLS Exists

Early streaming protocols struggled with firewalls, proxies, and NAT. HTTP did not. HLS piggybacks on existing web infrastructure.

- Works over ports 80 and 443.
- Plays nicely with CDNs.
- Scales horizontally with almost zero effort.

Caching becomes trivial. Distribution becomes cheap. Reliability goes up.

## Adaptive Bitrate Streaming

This is the killer feature. HLS supports multiple renditions of the same video. 

- 240p for weak networks.
- 720p for decent connections.
- 1080p or higher when bandwidth allows.

Each rendition has its own playlist. A master playlist points to all of them. The client switches streams mid-playback. No reload. No user intervention.

Ever seen video quality jump up or down on YouTube? 

That’s adaptive bitrate in action.

## A Minimal Mental Model

Think of HLS as:

- Markdown for video structure.
- Tiny video files instead of one big blob.
- A smart downloader pretending to be a video player.

Once you see it that way, debugging becomes easier. Playlists are readable. Segments are inspectable. Nothing is opaque magic.

## Where HLS Is Used

HLS is everywhere.

- Live sports.
- Video platforms.
- Internal dashboards.
- Surveillance systems.
- Training portals.
  
If video plays reliably on bad networks, HLS is usually involved.

## Tradeoffs Worth Knowing

HLS is not perfect.

- Latency is higher by default.
- Segment size affects responsiveness.
- Live streaming needs tuning.

Low-latency HLS exists.

But it adds complexity.

Nothing comes free.

## Why You Should Care

If you build platforms, not just pages, HLS matters.

- You control storage.
- You control delivery.
- You avoid vendor lock-in.

It turns video into infrastructure. And infrastructure is where leverage lives.