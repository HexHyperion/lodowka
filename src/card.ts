import Fridge from "./fridge";
import tinymce from 'tinymce';

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


    showEditor(card: HTMLDivElement) {
        const editorContainer = document.createElement("div");
        editorContainer.classList.add("editor-container");

        const textarea = document.createElement("textarea");
        textarea.id = `editor-${Date.now()}`;       // Set a unique ID for the textarea, otherwise there will be an error when initializing TinyMCE
        textarea.value = (card.querySelector(".card-text") as HTMLElement).innerText || "";
        editorContainer.appendChild(textarea);

        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.classList.add("button");
        saveButton.style.padding = "5px";

        saveButton.addEventListener("click", () => {
            const editor = tinymce.get(textarea.id);    // I hate TinyMCE so much

            if (editor) {
                const content = editor ? editor.getContent() : textarea.value;
                const cardText = card.querySelector(".card-text");

                if (cardText) {
                    cardText.innerHTML = content;
                }
                document.body.removeChild(editorContainer);
            }
        });
        editorContainer.appendChild(saveButton);

        document.body.appendChild(editorContainer);

        tinymce.init({
            selector: `#${textarea.id}`,
            plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'visualblocks', 'wordcount'],
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            menubar: false,
            content_style: "body { background-color: black; color: white; }",
        });
    }


    bringToFront(card: HTMLDivElement) {    // So stack, so overflow, much wow
        this.zIndex = ++Fridge.maxZIndex;
        card.style.zIndex = this.zIndex.toString();
    }


    addButtons(card: HTMLDivElement) {
        const editButton = document.createElement("button");
        editButton.innerText = "\u270E";   // Unicode pencil
        editButton.classList.add("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("mousedown", () => {
            this.showEditor(card);
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