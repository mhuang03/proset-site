function addDots(card) {
    let id = card.getAttribute('card-id');
    let idArr = [...id]; //.reverse();
    let horizontal = ['left', 'right'];
    let vertical = ['top', 'middle', 'bottom'];
    let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

    for (let h = 0; h < 2; h++) {
        for (let v = 0; v < 3; v++) {
            let dot = document.createElement('div');
            let index = 2*v + h;
            dot.className = 'proset-dot ' + vertical[v] + ' ' + horizontal[h];
            dot.style.backgroundColor = colors[index];
            if (idArr[index] == '0') {
                dot.style.display = 'none';
                dot.style.visibility = 'hidden';
            }
            card.appendChild(dot);
        }
    }
}

function newCard(cardid) {
    let card = document.createElement('div');
    card.className = 'proset-card';
    card.setAttribute('card-id', cardid);
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

let cardids = ['111110', '110010', '001101', '110011', '000110', '100010', '111010'];
let cardids2 = ['111110', '110010', '001101', '110011', '000110', '100010', '111010'];
renderCards(cardids);
renderCards(cardids2.reverse());