function addDots(card) {
    let wrapper = document.createElement("div");
    wrapper.className = "proset-dots";

    let empty = document.createElement("div");
    empty.className = "proset-empty-dot";
    wrapper.appendChild(empty);

    let id = card.getAttribute("card-id");
    let idArr = [...id];
    let colors = ["red", "orange", "yellow", "green", "blue", "purple"];

    for (let n = 0; n < 6; n++) {
        let dot = document.createElement("div");
        dot.className = "proset-dot";
        dot.style.backgroundColor = colors[n];
        if (idArr[n] == "0") {
            dot.style.visibility = "hidden";
        }
        wrapper.appendChild(dot);
    }

    card.appendChild(wrapper);
}

function handleCardClick(card, e) {
    e.preventDefault();
    e.stopPropagation();

    card.classList.toggle("selected");
}

function newCard(cardid) {
    let card = document.createElement("div");
    card.className = "proset-card";
    card.setAttribute("card-id", cardid);

    card.addEventListener("click", function (e) {
        handleCardClick(this, e);
    });
    return card;
}

function renderCards(cardids) {
    localStorage.setItem("currentCards", JSON.stringify(cardids));
    let rows = [
        document.querySelector("#proset-row-0"),
        document.querySelector("#proset-row-1"),
        document.querySelector("#proset-row-2"),
    ];
    let counts = [2, 3, 2];

    let changedCards = [];

    for (let r = 0; r < 3; r++) {
        let row = rows[r];
        let count = counts[r];
        let cards = row.children;
        for (let n = 0; n < count; n++) {
            let cardid = cardids.shift();
            let card = newCard(cardid);
            card.classList.add('eliminated');
            if (n < cards.length) {
                if (cards[n].getAttribute("card-id") != cardid) {
                    cards[n].classList.add('eliminated');
                    setTimeout(function (row, card, newCard) {
                        row.replaceChild(card, newCard);
                    }.bind(null, row, card, cards[n]), 200);
                    changedCards.push(card);
                }
            } else {
                row.appendChild(card);
                changedCards.push(card);
            }

            if (
                typeof cardid == "undefined" ||
                cardid == "undefined" ||
                cardid == "null" ||
                cardid === null
            ) {
                card.style.visibility = "hidden";
            } else {
                addDots(card);
            }
        }
    }

    setTimeout(function(cards) {
        cards.forEach(function(card) {
            card.classList.remove('eliminated');
        });
        localStorage.setItem("actionAvailable", "true");
    }.bind(null, changedCards), 400);
}

function getAllCards() {
    return document.querySelectorAll(".proset-card:not(.example)");
}

function getSelectedCards() {
    return document.querySelectorAll(".proset-card.selected:not(.example)");
}

function selectionIsValid() {
    let cards = Array.from(getSelectedCards());
    if (cards.length == 0) {
        return false;
    }

    let ttl = 0;
    for (let i = 0; i < cards.length; i++) {
        let binString = cards[i].getAttribute("card-id");
        ttl ^= parseInt(binString, 2);
    }

    if (ttl == 0) {
        return true;
    }
    return false;
}

function addToScore(num) {
    let scoreNum = document.getElementById("score-num");
    let currentScore = parseInt(scoreNum.innerText);
    scoreNum.innerText = currentScore + num;
    localStorage.setItem("score", scoreNum.innerText);
}

function checkWin() {
    let cards = Array.from(getAllCards());
    let ids = [];
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let id = card.getAttribute("card-id");
        if (
            id != "undefined" &&
            id != "null" &&
            id !== null &&
            typeof id != "undefined"
        ) {
            ids.push(id);
        }
    }

    if (ids.length == 0) {
        handleWin();
    }
}

function handleWin() {
    localStorage.removeItem("currentCards");
    createDeck();
    populateCards();
}

function enterGuess() {
    if (localStorage.getItem("actionAvailable") != "true") {
        return;
    }

    let revealed = localStorage.getItem("revealed");
    if (selectionIsValid()) {
        if (revealed != "true") {
            addToScore(getSelectedCards().length);
        }
        replaceSelected();
        setTimeout(checkWin, 200);
        localStorage.setItem("actionAvailable", "false");
    }

    localStorage.setItem("revealed", "false");
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createDeck() {
    let deck = localStorage.getItem("deck");
    let currentCards = localStorage.getItem("currentCards");
    if (deck !== null) {
        if (JSON.parse(deck).length != 0) {
            return;
        }
    }
    if (currentCards !== null) {
        let currentCardArr = JSON.parse(currentCards);
        let nonEmpty = [];
        for (let i = 0; i < currentCardArr.length; i++) {
            let thisCard = currentCardArr[i];
            if (thisCard != "undefined" && thisCard != "null" && thisCard !== null) {
                nonEmpty.push(thisCard);
            }
        }
        if (nonEmpty.length != 0) {
            return;
        }
    }

    let newDeck = [];
    for (let i = 1; i < 2 ** 6; i++) {
        newDeck.push(i.toString(2).padStart(6, "0"));
    }
    shuffle(newDeck);
    localStorage.setItem("deck", JSON.stringify(newDeck));
}

function populateCards() {
    let currentCards = localStorage.getItem("currentCards");

    if (currentCards !== null) {
        let currentCardArr = JSON.parse(currentCards);
        let nonEmpty = [];
        for (let i = 0; i < currentCardArr.length; i++) {
            let thisCard = currentCardArr[i];
            if (thisCard != "undefined" && thisCard != "null" && thisCard !== null) {
                nonEmpty.push(thisCard);
            }
        }
        if (nonEmpty.length != 0) {
            renderCards(currentCardArr);
            return;
        }
    }

    let cards = [];
    let deck = JSON.parse(localStorage.getItem("deck"));
    for (let i = 0; i < 7; i++) {
        cards.push(deck.pop());
    }
    renderCards(cards);
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("actionAvailable", "true");
}

function replaceSelected() {
    localStorage.setItem("actionAvailable", "false");
    let allCards = getAllCards();
    let selectedCards = getSelectedCards();
    let selectedIDs = [];
    for (let i = 0; i < selectedCards.length; i++) {
        selectedIDs.push(selectedCards[i].getAttribute("card-id"));
    }

    let cardIDs = [];
    let deck = JSON.parse(localStorage.getItem("deck"));
    for (let i = 0; i < allCards.length; i++) {
        let currentID = allCards[i].getAttribute("card-id");
        if (selectedIDs.includes(currentID)) {
            currentID = deck.pop();
        }
        cardIDs.push(currentID);
    }

    renderCards(cardIDs);
    localStorage.setItem("deck", JSON.stringify(deck));
}

function clearSelected() {
    let selectedCards = getSelectedCards();
    for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.toggle("selected");
    }
}

function revealSolution() {
    if (localStorage.getItem("actionAvailable") != "true") {
        return;
    }
    let cards = Array.from(getAllCards());
    let ids = [];
    for (let i = 0; i < cards.length; i++) {
        let id = cards[i].getAttribute("card-id");
        if (id != "undefined" && id != "null") {
            ids.push(id);
        }
    }

    let solution = [];
    for (let i = 1; i <= 2 ** ids.length; i++) {
        let binString = i.toString(2).padStart(ids.length, "0");
        let binArr = [...binString];
        let total = 0;
        for (let j = 0; j < ids.length; j++) {
            if (binArr[j] == "1") {
                total ^= parseInt(ids[j], 2);
            }
        }
        if (total == 0) {
            for (let j = 0; j < ids.length; j++) {
                if (binArr[j] == "1") {
                    solution.push(ids[j]);
                }
            }
            break;
        }
    }

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let id = card.getAttribute("card-id");
        if (solution.includes(id)) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    }

    localStorage.setItem("revealed", "true");
}

function addEventListeners() {
    document.body.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.key === "Enter") {
            enterGuess();
        } else if (event.key === "Escape") {
            clearSelected();
        } else if (event.key === "R" || event.key === "r") {
            revealSolution();
        }
    });
}

function addButtons() {
    let buttonWrapper = document.getElementById("proset-buttons");
    let values = ["Reveal", "Clear", "Enter"];
    let funcs = [revealSolution, clearSelected, enterGuess];

    for (let i = 0; i < 3; i++) {
        let button = document.createElement("a");
        button.className = "proset-button";
        let text = document.createElement("span");
        text.innerText = values[i];
        button.appendChild(text);
        button.addEventListener("click", function () {
            funcs[i]();
            this.classList.add("clicked");
            setTimeout(
                function (button) {
                    button.classList.remove("clicked");
                },
                200,
                button
            );
        });
        buttonWrapper.appendChild(button);
    }

    let title = document.getElementById("proset-title");
    title.addEventListener("click", function () {
        displayAboutModal();
        this.classList.add("clicked");
        setTimeout(
            function (title) {
                title.classList.remove("clicked");
            },
            200,
            title
        );
    });

    let modal = document.getElementById("about-modal");
    document.addEventListener("click", function (modal, e) {
        if (e.target == modal) {
            modal.classList.remove("show");
        }
    }.bind(null, modal));

    let closeAbout = document.getElementById("about-close");
    closeAbout.addEventListener("click", function () {
        hideAboutModal();
    });
}

function displayAboutModal() {
    let modal = document.getElementById("about-modal");
    modal.classList.add("show");
}

function hideAboutModal() {
    let modal = document.getElementById("about-modal");
    modal.classList.remove("show");
}

function initializeScore() {
    let storedScore = localStorage.getItem("score");
    let scoreNum = document.getElementById("score-num");
    if (storedScore !== null) {
        scoreNum.innerText = storedScore;
    } else {
        scoreNum.innerText = 0;
    }
}

function iosTouchListeners() {
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    });
}

function initialize() {
    createDeck();
    populateCards();
    addButtons();
    initializeScore();
    addEventListeners();
    //iosTouchListeners();
}

initialize();
