function addDots(card) {
    let wrapper = document.createElement('div');
    wrapper.className = 'proset-dots';

    let empty = document.createElement('div');
    empty.className = 'proset-empty-dot';
    wrapper.appendChild(empty);

    let id = card.getAttribute('card-id');
    let idArr = [...id];
    let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

    for (let n = 0; n < 6; n++) {
        let dot = document.createElement('div');
        dot.className = 'proset-dot';
        dot.style.backgroundColor = colors[n];
        if (idArr[n] == '0') {
            dot.style.visibility = 'hidden';
        }
        wrapper.appendChild(dot);
    }

    card.appendChild(wrapper);
}

function newCard(cardid) {
    let card = document.createElement('div');
    card.className = 'proset-card';
    card.setAttribute('card-id', cardid);
    card.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
    return card;
}

function renderCards(cardids) {
    let rows = [
        document.querySelector('#proset-row-0'),
        document.querySelector('#proset-row-1'),
        document.querySelector('#proset-row-2'),
    ];
    let counts = [2, 3, 2];

    for (let r = 0; r < 3; r++) {
        let row = rows[r];
        let count = counts[r];
        let cards = row.children;
        for (let n = 0; n < count; n++) {
            let cardid = cardids.shift();
            let card = newCard(cardid);
            if (n < cards.length) {
                row.replaceChild(card, cards[n]);
            } else {
                row.appendChild(card);
            }
            addDots(card);
        }
    }
}

function getSelectedCards() {
    return document.querySelectorAll('.proset-card.selected')
}

function selectionIsValid() {
    let cards = Array.from(getSelectedCards());
    if (cards.length == 0) {
        return false;
    }

    let ttl = 0
    for (let i = 0; i < cards.length; i++) {
        let binString = cards[i].getAttribute('card-id');
        ttl ^= parseInt(binString, 2);
    }

    if (ttl == 0) {
        return true;
    }
    return false;
}

function addToScore(num) {
    let scoreNum = document.getElementById('score-num');
    let currentScore = parseInt(scoreNum.innerText);
    scoreNum.innerText = currentScore + num;
}

function replaceSelected() {
    
}

function enterGuess() {
    if (selectionIsValid()) {
        console.log('yay');
        addToScore(getSelectedCards().length);
        replaceSelected();
    } else {
        console.log('no');
    }
}

function addEnterKeyHandler() {
    document.body.addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.key === 'Enter') {
            enterGuess();
        }
    });
}

addEnterKeyHandler();

let cardids = ['111110', '110010', '001101', '110011', '000110', '100010', '111010'];
let cardids2 = ['111110', '110010', '001101', '110011', '000110', '100010', '111010'];
renderCards(cardids);
//renderCards(cardids2.reverse());