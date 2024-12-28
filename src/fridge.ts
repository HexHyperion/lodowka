import Card from "./card";

export default class Fridge {
    static area: HTMLDivElement = document.getElementById("fridge") as HTMLDivElement;
    static cards: Card[] = [];
    static maxZIndex: number = 0;

    static countCounter: HTMLSpanElement = document.getElementById("count") as HTMLSpanElement;
    static mileageCounter: HTMLSpanElement = document.getElementById("mileage") as HTMLSpanElement;

    static cardCount = 0;
    static cardMileage = 0;

    static addCard() {
        this.cardCount++;
        this.cardMileage++;
        this.updateCounters();
        this.cards.push(new Card());
    }

    static removeCard(deletedCard: Card) {
        this.cardCount--;
        this.updateCounters();
        this.cards = this.cards.filter(card => card != deletedCard);
    }

    static updateCounters() {
        this.countCounter.innerText = this.cardCount.toString();
        this.mileageCounter.innerText = this.cardMileage.toString();
    }
}