# Angul-It

Angul-It is a small interactive CAPTCHA experience built with Angular. Complete five verification challenges, including a math problem, general-knowledge questions, and image-selection puzzles, to reach the verification result.

## Getting started

You need [Node.js](https://nodejs.org/) and npm installed.

```bash
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The development server reloads when source files change.

## Available commands

| Command | Description |
| --- | --- |
| `ng serve` | Start the Angular development server. |

## How it works

- Start at `/home`, then complete the challenges at `/captcha` in order.
- Use the previous button to return to the preceding completed stage.
- Progress is saved in the browser's `localStorage`, so it remains available after a refresh in the same browser.
- The `/result` route is available after all five challenges are complete. Choose **Retry Challenge** to start again.
- Challenge images are served from `public/assets/`.

Progress is stored locally in the browser; the app does not send challenge answers or progress to a server.

## Built with

- Angular 22
- TypeScript
- RxJS
- Vitest
