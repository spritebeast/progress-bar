import kaplay from "kaplay";
import { crew } from "@kaplayjs/crew";

const k = kaplay({
    background: [74, 48, 82],
    plugins: [ crew ],
});

k.loadCrew("font", "happy-o");

k.scene("bar-scene", () => {
    const TOTAL_TIME = 15;
    let timeLeft = TOTAL_TIME;
    let blinkTimer = 0;
    const BLINK_TIME = 0.2;
    let maxWidth = k.width() - 30;
    let currentWidth = maxWidth;

    k.add([
        k.rect(maxWidth, 40),
        k.pos(k.center().x - maxWidth / 2, 20),
        k.color(255, 255, 255),
        k.outline(6, k.rgb(255, 255, 255)),
    ]);

    const bar = k.add([
        k.rect(currentWidth, 40),
        k.pos(k.center().x - maxWidth / 2, 20),
        k.color(107, 201, 108),
    ]);

    let timeLeftTxt = k.add([
        k.text("0", {
            size: 40,
            align: "center",
            font: "happy-o",
        }),
        k.pos(k.width() / 2, bar.height / 2 + 20),
        k.color(255, 255, 255),
        k.anchor("center"),
    ]);

    bar.onUpdate(() => {
        timeLeft -= k.dt();
        timeLeft = Math.max(timeLeft, 0);
        let displayTime = Math.floor(timeLeft);
        timeLeftTxt.text = displayTime.toString();

        if (timeLeft < 11) { timeLeftTxt.color = k.rgb(255, 255, 0); }

        if (timeLeft < 6) {
            blinkTimer += k.dt();
            timeLeftTxt.color = k.rgb(255, 0, 0);

            if (blinkTimer >= BLINK_TIME) {
                blinkTimer = 0;
                timeLeftTxt.hidden = !timeLeftTxt.hidden;
            }
        } else {
            timeLeftTxt.hidden = false;
        }

        let ratio = Math.max(timeLeft / TOTAL_TIME, 0);
        bar.width = maxWidth * ratio;

        if (timeLeft <= 0) {
            timeLeft = 0;
            k.go("to-scene");
        }
    });
});

k.scene("to-scene", () => {
    k.add([
        k.text("Times Up!\nPress SPACE restart.", {
            size: 48,
            align: "center",
            font: "happy-o",
        }),
        k.pos(k.center()),
        k.anchor("center"),
    ]);

    k.onKeyPress("space", () => { k.go("bar-scene"); });
});

k.go("bar-scene");