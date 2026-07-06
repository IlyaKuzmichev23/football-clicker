export class Effects {

    constructor(container) {
        this.container = container;
    }

    createFloatingText(text, x, y) {

        const floatingText = document.createElement("div");

        floatingText.className = "floating-text";
        floatingText.textContent = text;

        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 30;

        floatingText.style.left = `${x + offsetX}px`;
        floatingText.style.top = `${y + offsetY}px`;

        const scale = 0.9 + Math.random() * 0.4;
        floatingText.style.scale = scale;

        const rotation = (Math.random() - 0.5) * 20;
        floatingText.style.rotate = `${rotation}deg`;

        this.container.appendChild(floatingText);

        floatingText.addEventListener("animationend", () => {
            floatingText.remove();
        });
    }
}