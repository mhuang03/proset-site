function makeDots(card) {
    let horizontal = ['left', 'right'];
    let vertical = ['top', 'middle', 'bottom'];

    for (let h=0; h < 2; h++) {
        for (let v=0; v < 3; v++) {
            let dot = document.createElement('div');
            dot.className = 'proset-dot ' + vertical[v] + ' ' + horizontal[h];
            card.appendChild(dot);
        }
    }

}

function renderCard(card) {
    let id = card.getAttribute('card-id');
    let idArr = [...id]; //.reverse();
    let horizontal = ['left', 'right'];
    let vertical = ['top', 'middle', 'bottom'];
    let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

    for (let h=0; h < 2; h++) {
        for (let v=0; v < 3; v++) {
            let dot = document.createElement('div');
            let index = 2*v + h;
            dot.className = 'proset-dot ' + vertical[v] + ' ' + horizontal[h];
            dot.style.backgroundColor = colors[index];
            if (idArr[index] == '0') {
                dot.style.display = 'none';
            }
            card.appendChild(dot);
        }
    }
}

let cards = document.getElementsByClassName('proset-card');
let cardArr = Array.from(cards)
cardArr.forEach(makeDots);
cardArr.forEach(renderCard);