# Rock Paper Scissors

A small browser game of Rock Paper Scissors against the computer. It is built with plain HTML, CSS and JavaScript, with no build step, server or external dependency.

## Features

- Rock, paper and scissors buttons
- Random computer moves
- Win, lose and draw results with explanations
- Scoreboard for player, computer and draws
- Round history showing the last ten rounds
- Keyboard shortcuts (R, P, S)
- Scores and history saved in browser local storage
- Reset button to clear scores
- Responsive desktop and mobile layout

## Files

- `index.html` - page structure, scoreboard, arena and controls
- `styles.css` - dark theme, responsive layout and result styling
- `script.js` - game logic, scoring, history, shortcuts and saved state

## How to run

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Click a move or press R, P or S to play.

No account, package install or server is required.

## How it works

Each round compares your choice with a random computer choice. Rock beats scissors, scissors beat paper and paper beats rock. Scores and the last ten rounds are stored in local storage so they survive a reload in the same browser.

## Testing

The project was checked in a browser with functional tests for all nine choice combinations, scoring, draw handling, history, keyboard shortcuts, reset behavior, saved state and reload persistence. Desktop and mobile layouts were visually inspected.

## Note

This project was built with the help of an AI assistant (Instinct) as a learning project.
