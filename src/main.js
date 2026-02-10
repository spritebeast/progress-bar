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
    let blinking = false;
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
        k.scale(1),
    ]);

    k.onUpdate(() => {
        timeLeft -= k.dt();
        timeLeft = Math.max(timeLeft, 0);
        let displayTime = Math.ceil(timeLeft);
        timeLeftTxt.text = displayTime.toString();

        if (timeLeft < 10 && !blinking) timeLeftTxt.color = k.rgb(255, 255, 0);

        if (timeLeft < 5 && !blinking && timeLeft > 0) {
            blinking = true;
            timeLeftTxt.color = k.rgb(255, 0, 0);
            
            k.loop(1.0, () => {
                if (timeLeft <= 0) return;
                
                k.tween(
                    1,
                    2.25,
                    0.5,
                    (val) => {
                        timeLeftTxt.scale = k.vec2(val, val);
                    },
                    k.easings.easeOutQuad,
                );

                k.wait(0.5, () => {
                    k.tween(
                        2.25,
                        1,
                        0.5,
                        (val) => {
                            timeLeftTxt.scale = k.vec2(val, val);
                        },
                        k.easings.easeInQuad,
                    );
                });
            });
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