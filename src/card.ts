import Fridge from "./fridge";
import tinymce from 'tinymce';

export default class Card {
    contents: string = "Bob the Card";
    width: number = 200;
    height: number = 200;
    zIndex: number = 1;
    x: number;
    y: number;

    constructor() {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardText = document.createElement("div");
        cardText.classList.add("card-text");
        cardText.innerHTML = this.contents;
        card.appendChild(cardText);

        card.style.width = `${this.width}px`;
        card.style.height = `${this.height}px`;

        this.x = 75 + Math.floor(Math.random()*20);     // So they don't all stack on top of each other invisibly
        this.y = 75 + Math.floor(Math.random()*20);
        card.style.top = `${this.y}px`;
        card.style.left = `${this.x}px`;

        this.addButtons(card);
        this.handleDrag(card);

        Fridge.area.appendChild(card);

        card.addEventListener("mousedown", () => {
            this.bringToFront(card);
        });
    }


    handleDrag(card: HTMLDivElement) {
        let startX = 0, startY = 0;
        let initialX = 0, initialY = 0;

        const doDrag = (event: PointerEvent) => {
            this.x = initialX + event.clientX - startX;
            this.y = initialY + event.clientY - startY;
            card.style.top = `${this.y}px`;
            card.style.left = `${this.x}px`;
            this.bringToFront(card);
        };

        const stopDrag = () => {
            document.removeEventListener("pointermove", doDrag);
            document.removeEventListener("pointerup", stopDrag);
            card.classList.remove("card-held");
        };

        card.addEventListener("pointerdown", (event: PointerEvent) => {
            event = event || window.event as PointerEvent;
            event.preventDefault();
            startX = event.clientX;
            startY = event.clientY;
            initialX = card.offsetLeft;
            initialY = card.offsetTop;

            this.bringToFront(card);

            document.addEventListener("pointermove", doDrag);
            document.addEventListener("pointerup", stopDrag);

            card.classList.add("card-held");
        });
    }

    handleResize(card: HTMLDivElement, event: PointerEvent) {
        let startX = event.clientX;
        let startY = event.clientY;

        let startWidth = card.clientWidth;
        let startHeight = card.clientHeight;

        const minWidth = 150;
        const minHeight = 150;

        const doDrag = (event: PointerEvent) => {
            const newWidth = startWidth + event.clientX - startX;
            const newHeight = startHeight + event.clientY - startY;

            if (newWidth >= minWidth) {
                card.style.width = `${newWidth}px`;
                this.width = newWidth;
            }
            if (newHeight >= minHeight) {
                card.style.height = `${newHeight}px`;
                this.height = newHeight;
            }
        };

        const stopDrag = () => {
            document.documentElement.removeEventListener('pointermove', doDrag);
            document.documentElement.removeEventListener('pointerup', stopDrag);
            card.classList.remove("card-resizing");
        };

        document.documentElement.addEventListener('pointermove', doDrag);
        document.documentElement.addEventListener('pointerup', stopDrag);

        card.classList.add("card-resizing");
    }


    showEditor(card: HTMLDivElement) {
        card.classList.add("card-editing");

        const overlay = document.createElement("div");
        overlay.classList.add("editor-overlay");
        document.body.appendChild(overlay);

        const editorContainer = document.createElement("div");
        editorContainer.classList.add("editor-container");

        const textarea = document.createElement("textarea");
        textarea.id = `editor-${Date.now()}`;       // Set a unique ID for the textarea, otherwise there will be an error when initializing TinyMCE
        textarea.value = this.contents;
        editorContainer.appendChild(textarea);

        document.body.appendChild(editorContainer);

        tinymce.init({
            selector: `#${textarea.id}`,
            plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'media', 'searchreplace', 'visualblocks', 'wordcount'],
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | spellcheckdialog a11ycheck typography | align lineheight | emoticons charmap | removeformat',
            menubar: false,
            content_style: "body { background-color: black; color: white; }",
            setup: (editor) => {
                editor.on('init', () => {
                    editor.setContent(textarea.value);
                });
                // Those custom buttons inside TinyMCE
                editor.on('PostRender', () => {
                    const footer = editor.editorContainer.querySelector('.tox-statusbar');
                    if (footer) {
                        const buttonContainer = document.createElement("div");
                        buttonContainer.classList.add("editor-button-container");

                        const saveButton = document.createElement("button");
                        saveButton.innerText = "\u2714";      // Unicode checkmark
                        saveButton.classList.add("button");
                        saveButton.classList.add("editor-button");
                        saveButton.classList.add("editor-save-button");
                        saveButton.addEventListener("click", () => {
                            const content = editor.getContent();
                            const cardText = card.querySelector(".card-text");
                            if (cardText) {
                                cardText.innerHTML = content;
                                this.contents = content;
                            }
                            document.body.removeChild(editorContainer);
                            document.body.removeChild(overlay);
                            card.classList.remove("card-editing");
                        });

                        const cancelButton = document.createElement("button");
                        cancelButton.innerText = "\u2716";    // Unicode heavy multiplication sign
                        cancelButton.classList.add("button");
                        cancelButton.classList.add("editor-button");
                        cancelButton.classList.add("editor-cancel-button");
                        cancelButton.addEventListener("click", () => {
                            document.body.removeChild(editorContainer);
                            document.body.removeChild(overlay);
                            card.classList.remove("card-editing");
                        });

                        buttonContainer.appendChild(saveButton);
                        buttonContainer.appendChild(cancelButton);
                        footer.insertBefore(buttonContainer, footer.lastChild);
                    }
                });
            }
        });
    }


    bringToFront(card: HTMLDivElement) {    // Will be funny after 2147483647 cards, but whatever
        this.zIndex = ++Fridge.maxZIndex;
        card.style.zIndex = this.zIndex.toString();
    }


    addButtons(card: HTMLDivElement) {
        const editButton = document.createElement("button");
        editButton.innerText = "\u270E";   // Unicode pencil
        editButton.classList.add("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("pointerdown", (event: PointerEvent) => {
            event.stopPropagation();    // Prevents the card from being dragged when editing, TIL this is a thing
            this.showEditor(card);
        });
        card.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "\u2716";   // Unicode heavy multiplication sign
        deleteButton.classList.add("button");
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("pointerdown", (event: PointerEvent) => {
            event.stopPropagation();
            card.style.borderColor = "red";
        });
        deleteButton.addEventListener("pointerup", (event: PointerEvent) => {
            if (event.target === deleteButton) {
                Fridge.removeCard(this);
                card.remove();
            } else {
                card.style.borderColor = "white";
            }
        });
        deleteButton.addEventListener("pointerleave", () => {
            card.style.borderColor = "white";
        });
        card.appendChild(deleteButton);

        const resizeButton = document.createElement("button");
        resizeButton.innerText = "\u21F2";   // Unicode resize arrow
        resizeButton.classList.add("button");
        resizeButton.classList.add("resize-button");
        resizeButton.addEventListener("pointerdown", (event: PointerEvent) => {
            event.stopPropagation();
            this.handleResize(card, event);
        });
        card.appendChild(resizeButton);
    }
}