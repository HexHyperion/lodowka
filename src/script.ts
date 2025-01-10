import Fridge from "./fridge";

document.addEventListener("DOMContentLoaded", () => {
    Fridge.initialize();
    Fridge.loadState();

    document.getElementById("add-button")?.addEventListener("click", () => {
        Fridge.addCard();
        console.log(Fridge.cards);
    });
});