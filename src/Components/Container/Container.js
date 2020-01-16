import React, {useEffect, useState} from "react";
import uuid from "uuid";
import classes from './Container.css'
import Card from '../Card/Card'
import deepcopy from "deepcopy";

function shuffleArray(array) {
	return array.sort(() => .5 - Math.random());
}

function generateCards() {
    let arr = []
    nextPrime:
    for (let i = 2; i <= 50; i++) { 
        for (let j = 2; j < i; j++) { 
            if (i % j === 0) continue nextPrime; 
        }
        arr.push(i)
    }

	const cards = shuffleArray(arr)
		.map((e) => ({
            num:e,
			id: uuid.v4(),
			isFlipped: false,
			canFlip: true
		}))
		.flatMap(e => [e, {...deepcopy(e), id: uuid.v4()}]);

	return shuffleArray(cards);
}
export default function Game() {

	const [cards, setCards] = useState(generateCards());
	const [canFlip, setCanFlip] = useState(false);
	const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);

	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, isFlipped};
		}));
	}
	function setCardCanFlip(cardID, canFlip) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, canFlip};
		}));
	}

	useEffect(() => {
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => setCardIsFlipped(card.id, true), index++ * 50);
			}
			setTimeout(() => setCanFlip(true), cards.length * 50);
			
		}, 3000);
	}, []);


	function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

	function onSuccessGuess() {
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, false);
		setCardIsFlipped(secondCard.id, false);
		resetFirstAndSecondCards();
	}
	function onFailureGuess() {
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1000);

		resetFirstAndSecondCards();
	}

	useEffect(() => {
		if (!firstCard || !secondCard)
			return;
		(firstCard.num === secondCard.num) ? onSuccessGuess() : onFailureGuess();
	}, [firstCard, secondCard]);


	function onCardClick(card) {
		if (!canFlip)
			return;
		if (!card.canFlip)
			return;

		if (((firstCard && (card.id === firstCard.id)) || ((secondCard && (card.id === secondCard.id)))))
			return;

		setCardIsFlipped(card.id, false);

		(firstCard) ? setSecondCard(card) : setFirstCard(card);
	}

	return (
        <div className={classes.Container}>
            <h1>Mahjong-like game</h1>
            <div className={classes.CardBlock}>
                {cards.map(card => <Card onClick={() => onCardClick(card)} key={card.id} number={card.num} {...card}/>)}
            </div>
        </div>
    )
}