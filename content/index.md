---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Patppuccin
  text: Musings & Beyond
  tagline: A home for my thoughts, my work, and the continuous journey of learning and creating.
  image:
    src: /hero.png
    alt: Logo
  actions:
    - theme: brand
      text: Start Exploring
      link: /Expeditions
    - theme: alt
      text: About Me
      link: /about

features:
  - icon: 📘
    title: Expeditions
    details: Concepts, learnings, and structured knowledge I’m building.
    link: /Expeditions/

  - icon: ✒️
    title: Ruminations
    details: Reflections, essays, and thoughts from my day-to-day thinking.
    link: /Ruminations/

  - icon: 🛠️
    title: Workshop
    details: Experiments, research and challenges I'm exploring.
    link: /Workshop/

  - icon: ✨
    title: About Me
    details: A little bit about me, my background, and my journey.
    link: /Atlas/
---

## Patppuccin?

Patppuccin is a play on words that combines "Patrick", which is my name and "Catppuccin", which is my favorite color palette available at [Catppuccin](https://github.com/catppuccin/catppuccin). It offers a unique blend of my personality, my work, and the continuous journey of learning and creating.

Patppuccin serves as a platform to share my work, exploration, and thoughts. It is a place where I can document my learnings, reflect on my experiences, and share my insights with others. Whether you are a developer, a designer, or simply someone who enjoys learning and creating, Patppuccin has something for everyone.

## Getting Started

You can get started using VitePress right away using `npx`!

```sh
npm init
npx vitepress init
```

```go [main.go ~vscode-icons:file-type-go~]
package main

import "fmt"

func main() {
	fmt.Println("Hello VitePress!")
}
```

::: code-group

```sh [npm]
$ npm add -D vitepress@next
```

```sh [pnpm]
$ pnpm add -D vitepress@next
```

```sh [yarn]
$ yarn add -D vitepress@next vue
```

```sh [bun]
$ bun add -D vitepress@next
```

:::
