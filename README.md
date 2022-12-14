# Logic Gate Playground
![alt text](./public/screenshot.png "screenshot of a flip flop")

This is an example of an app developed with tauri and svelte. It is a logic gate playground IDE. A user can add gates, connect them and simulate with inputs their behaviour. The editor is draggable, pannable and zoomable. Documents can be saved and loaded again.

## Features

- [x] SR latch
- [x] RS latch
- [ ] clock
- [x] And, Not
- [x] Or, Xor, Nor
- [ ] comment node
- [x] file save and load
- [x] simulation of changing inputs

Try load an example flip flop file from [here](https://github.com/camperking/logic-play/raw/master/examples/flipflop.lp).

## Live Demo

You can try logic-play online

https://xdb.ovh/logic-play/

## Download

logic-play is available for Windows and Linux

https://github.com/camperking/logic-play/releases/tag/0.0.1

### Notice

This application is allowed to read and write on your `$DOCUMENTS` folder only.

## Development

logic-play is built with tauri & Svelte and TypeScript with `"noImplicitAny": true`

Prerequisites: https://tauri.app/v1/guides/getting-started/prerequisites

``` 
npm install
npm run tauri dev
 ```