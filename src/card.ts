import Fridge from "./fridge";

export default class Card {
    zIndex: number = 0;

    constructor() {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardText = document.createElement("div");
        cardText.classList.add("card-text");
        cardText.innerText = "Bob the Card lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        card.appendChild(cardText);

        card.style.width = "200px";
        card.style.height = "200px";

        this.addButtons(card);
        this.handleDrag(card);

        Fridge.area.appendChild(card);
        card.style.top = `${Math.random() * (Fridge.area.clientHeight - card.clientHeight)}px`;  // Randomize card position
        card.style.left = `${Math.random() * (Fridge.area.clientWidth - card.clientWidth)}px`;

        card.addEventListener("mousedown", () => {
            this.bringToFront(card);
        });
    }


    handleDrag(card: HTMLDivElement) {
        let startX = 0, startY = 0;
        let initialX = 0, initialY = 0;

        const doDrag = (event: MouseEvent) => {
            card.style.top = `${initialY + event.clientY - startY}px`;
            card.style.left = `${initialX + event.clientX - startX}px`;
        };

        const stopDrag = () => {
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
            card.classList.remove("card-held");
        };

        card.addEventListener("mousedown", (event) => {
            event = event || window.event;
            event.preventDefault();
            startX = event.clientX;
            startY = event.clientY;
            initialX = card.offsetLeft;
            initialY = card.offsetTop;

            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);

            card.classList.add("card-held");
        });
    }

    handleResize(card: HTMLDivElement, event: MouseEvent) {
        let startX = event.clientX;
        let startY = event.clientY;

        let startWidth = card.clientWidth;
        let startHeight = card.clientHeight;

        const minWidth = 150;
        const minHeight = 150;

        const doDrag = (event: MouseEvent) => {
            const newWidth = startWidth + event.clientX - startX;
            const newHeight = startHeight + event.clientY - startY;

            if (newWidth >= minWidth) {
                card.style.width = `${newWidth}px`;
            }
            if (newHeight >= minHeight) {
                card.style.height = `${newHeight}px`;
            }
        };

        const stopDrag = () => {
            document.documentElement.removeEventListener('mousemove', doDrag);
            document.documentElement.removeEventListener('mouseup', stopDrag);
            card.classList.remove("card-resizing");
        };

        document.documentElement.addEventListener('mousemove', doDrag);
        document.documentElement.addEventListener('mouseup', stopDrag);

        card.classList.add("card-resizing");
    }


    bringToFront(card: HTMLDivElement) {
        this.zIndex = ++Fridge.maxZIndex;
        card.style.zIndex = this.zIndex.toString();
    }


    addButtons(card: HTMLDivElement) {
        const editButton = document.createElement("button");
        editButton.innerText = "\u270E";   // Unicode pencil
        editButton.classList.add("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("mousedown", () => {
            // to do with WYSIWYG editor
        });
        card.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "\u00D7";   // Unicode multiplication sign
        deleteButton.classList.add("button");
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("mousedown", () => {
            Fridge.removeCard();
            card.remove();
        });
        card.appendChild(deleteButton);

        const resizeButton = document.createElement("button");
        resizeButton.innerText = "\u21F2";   // Unicode resize arrow
        resizeButton.classList.add("button");
        resizeButton.classList.add("resize-button");
        resizeButton.addEventListener("mousedown", (event) => {
            event.stopPropagation();    // Prevents the card from being dragged when resizing, TIL this is a thing
            this.handleResize(card, event);
        });
        card.appendChild(resizeButton);
    }
}