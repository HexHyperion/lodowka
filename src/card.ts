import Fridge from "./fridge"

export default class Card {
    constructor() {
        const card = document.createElement("div")
        card.classList.add("card")

        card.innerText = "Bob the Card"
        card.style.width = "200px"
        card.style.height = "200px"

        this.addButtons(card)
        this.handleDrag(card)

        Fridge.area.appendChild(card)
        card.style.top = `${Math.random() * (Fridge.area.clientHeight - card.clientHeight)}px`  // Randomize card position
        card.style.left = `${Math.random() * (Fridge.area.clientWidth - card.clientWidth)}px`
    }


    handleDrag(card: HTMLDivElement) {
        let startX = 0, startY = 0
        let initialX = 0, initialY = 0

        const doDrag = (event: MouseEvent) => {
            card.style.top = `${initialY + event.clientY - startY}px`
            card.style.left = `${initialX + event.clientX - startX}px`
        }

        const stopDrag = () => {
            document.removeEventListener("mousemove", doDrag)
            document.removeEventListener("mouseup", stopDrag)
            card.classList.remove("card-held")
        }

        card.addEventListener("mousedown", (event) => {
            event = event || window.event
            event.preventDefault()
            startX = event.clientX
            startY = event.clientY
            initialX = card.offsetLeft
            initialY = card.offsetTop

            document.addEventListener("mousemove", doDrag)
            document.addEventListener("mouseup", stopDrag)

            card.classList.add("card-held")
        })
    }


    handleResize(card: HTMLDivElement, event: MouseEvent) {
        let startX = event.clientX
        let startY = event.clientY

        let startWidth = card.clientWidth
        let startHeight = card.clientHeight

        const doDrag = (event: MouseEvent) => {
            card.style.width = `${startWidth + event.clientX - startX}px`
            card.style.height = `${startHeight + event.clientY - startY}px`
        };

        const stopDrag = () => {
            document.documentElement.removeEventListener('mousemove', doDrag)
            document.documentElement.removeEventListener('mouseup', stopDrag)
            card.classList.remove("card-resizing")
        };

        document.documentElement.addEventListener('mousemove', doDrag)
        document.documentElement.addEventListener('mouseup', stopDrag)

        card.classList.add("card-resizing")
    }


    addButtons(card: HTMLDivElement) {
        const deleteButton = document.createElement("button")
        deleteButton.innerText = "\u00D7"   // Unicode multiplication sign
        deleteButton.classList.add("button")
        deleteButton.classList.add("delete-button")
        deleteButton.addEventListener("mousedown", () => {
            Fridge.removeCard()
            card.remove()
        })
        card.appendChild(deleteButton)

        const resizeButton = document.createElement("button")
        resizeButton.innerText = "\u21F2"   // Unicode resize arrow
        resizeButton.classList.add("button")
        resizeButton.classList.add("resize-button")
        resizeButton.addEventListener("mousedown", (event) => {
            event.stopPropagation();    // Prevents the card from being dragged when resizing, TIL this is a thing
            this.handleResize(card, event);
        });
        card.appendChild(resizeButton)
    }
}