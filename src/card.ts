import Fridge from "./fridge"

export default class Card {
    constructor() {
        const card = document.createElement("div")
        card.classList.add("card")
        card.innerText = "zigga"
        card.style.width = "100px"
        card.style.height = "100px"
        Card.handleDrag(card)
        Fridge.area.appendChild(card)
    }

    static handleDrag(card: HTMLDivElement) {
        let xCoord = 0, yCoord = 0, xCoordNew = 0, yCoordNew = 0

        const handleDragMove = (event: MouseEvent) => {
            xCoordNew = xCoord - event.clientX
            yCoordNew = yCoord - event.clientY

            xCoord = event.clientX
            yCoord = event.clientY

            card.style.top = `${card.offsetTop - yCoordNew}px`
            card.style.left = `${card.offsetLeft - xCoordNew}px`
        }

        const handleDragMouseUp = () => {
            document.removeEventListener("mousemove", handleDragMove)
            document.removeEventListener("mouseup", handleDragMouseUp)
        }

        card.addEventListener("mousedown", (event) => {
            event = event || window.event
            event.preventDefault()            
            xCoord = event.clientX
            yCoord = event.clientY

            document.addEventListener("mousemove", handleDragMove)

            document.addEventListener("mouseup", handleDragMouseUp)
        })
    }
}