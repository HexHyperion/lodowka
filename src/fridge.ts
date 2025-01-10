import Card from "./card";
import { CardData } from "./types";

export default class Fridge {
    static area: HTMLDivElement;
    static cards: Card[] = [];
    static maxZIndex: number = 0;

    static countCounter: HTMLSpanElement;
    static mileageCounter: HTMLSpanElement;

    static cardCount = 0;
    static cardMileage = 0;

    static initialize() {
        this.area = document.getElementById("fridge") as HTMLDivElement;
        this.countCounter = document.getElementById("count") as HTMLSpanElement;
        this.mileageCounter = document.getElementById("mileage") as HTMLSpanElement;
    }

    static addCard(data?: CardData) {
        if (!data) {
            this.cardCount++;
            this.cardMileage++;
        }
        this.updateCounters();
        const card = new Card(data);
        this.cards.push(card);
        if (data) {
            card.contents = data.contents;
            card.x = data.x;
            card.y = data.y;
            card.zIndex = data.zIndex;
            card.width = data.width;
            card.height = data.height;
        }
        this.saveState();
    }

    static removeCard(deletedCard: Card) {
        this.cardCount--;
        this.updateCounters();
        this.cards = this.cards.filter(card => card != deletedCard);
        this.saveState();
    }

    static updateCounters() {
        this.countCounter.innerText = this.cardCount.toString();
        this.mileageCounter.innerText = this.cardMileage.toString();
    }


    static saveState() {
        const state = {
            cards: this.cards.map(card => card.jsonify()),
            cardCount: this.cardCount,
            cardMileage: this.cardMileage
        };
        localStorage.setItem("fridgeState", JSON.stringify(state));
    }

    static loadState() {
        const state = localStorage.getItem("fridgeState");
        if (state) {
            const { cards, cardCount, cardMileage } = JSON.parse(state);
            this.cardCount = cardCount;
            this.cardMileage = cardMileage;
            this.updateCounters();
            cards.forEach((cardData: CardData) => this.addCard(cardData));
        }
    }
}