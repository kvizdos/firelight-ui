# Firelight UI

![Firelight Bar Chart](https://github.com/kvizdos/firelight-ui/blob/main/readme_assets/chart.png?raw=true)

A beautiful Web Component (Lit) library

## Download

```
npm i firelight-ui
```

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

Every so often, the urge to use `alert()`, `confirm()`, or `prompt()` strikes. With Firelight UI, you can use the following replacements to have the same ease, without the strange UX:

![Firelight Confirmation Prompts](https://github.com/kvizdos/firelight-ui/blob/main/readme_assets/confirmations.png?raw=true)

Confirmation prompts can be triggered easily, anywhere from your code base:

```js
import { Confirm } from "firelight-ui/feedback/confirm.component.js";

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

![Firelight Alerts](https://github.com/kvizdos/firelight-ui/blob/main/readme_assets/Alerts.png?raw=true)

Drop in replacement for `alert()`:

```js
import { Alert } from "firelight-ui/feedback/alert.component.js";


document.getElementById("openbtn").onclick = function () {
    Alert({
        title: "This is an alert",
        description: "You can even have a description woooot",
    });
};

document.getElementById("openbtnCustom").onclick = function () {
    Alert({
        title: "This is an alert",
        description: "With custom acknowledgeText set",
        acknowledgeText: "I understand",
    });
};
```

![Firelight Prompts](https://github.com/kvizdos/firelight-ui/blob/main/readme_assets/Prompts.png?raw=true)

Drop in replacement for `prompt()`, with pattern-based validation out of the box. Check out /dev/feedback/prompt.html for more info:

```js
import { Prompt } from "firelight-ui/feedback/prompt.component.js";


document.getElementById("openbtn").onclick = async function () {
    const resp = await Prompt({
        title: "Enter some text!",
        description: "This is a Text prompt",
        type: "text",
    });

    if (resp.canceled) {
        console.log("You canceled.");
        return;
    }

    console.log("You typed: " + resp.value);
};

document.getElementById("openbtnTel").onclick = async function () {
    const resp = await Prompt({
        title: "Enter a Phone Number!",
        description: "This is a Tel prompt",
        type: "tel",
        pattern: "\\d{3}-\\d{3}-\\d{4}",
        patternError: "Please type a valid phone number.",
    });

    if (resp.canceled) {
        console.log("You canceled.");
        return;
    }

    console.log("You typed: " + resp.value);
};
```
