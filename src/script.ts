import Fridge from "./fridge";

document.getElementById("add-button")?.addEventListener("click", () => {
    Fridge.addCard();
    console.log(Fridge.cards);
});