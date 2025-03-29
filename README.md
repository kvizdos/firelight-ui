# Firelight UI

![Firelight Bar Chart](https://github.com/kvizdos/firelight-ui/blob/main/readme_assets/chart.png?raw=true)

A beautiful Web Component (Lit) library

## Key Features
- Accessible Charts: Only bar charts currently.
- Buttons: Loading states out of the box. (icon support coming soon!)
- Better `prompt()`, `alert()`, and `confirm()` dialogues
  - Prompt also has types (text, number, decimal, tel, etc) & pattern checking.
- Accessible Modal Component
- Animations: Tween between numbers
- A variety of utility + base stylesheets (e.g. make inputs look better)
- Full Customizability: CSS variables w/ default fallbacks are used to ensure everything can look how you want it to.

## Feedback Prompts

![Firelight Confirmation Prompts](https://github.com/kvizdos/firelight-ui/blob/main/readme_assets/confirmations.png?raw=true)

Confirmation prompts can be triggered easily, anywhere from your code base:

```js
import { Confirm } from "/dist/feedback/confirm.component.js";

document.getElementById("openbtn").onclick = function () {
    Confirm({
        title: "This is a Confirmation",
        description: "You can even specify a description",
    });
};
document.getElementById("openbtnCustom").onclick = function () {
    Confirm({
        title: "This is a Confirmation",
        description: "With custom Buttons",
        proceedButton: "Proceed",
        cancelButton: "Go Back",
    });
};
```

## Download

```
npm i firelight-ui
```
