const cardTitle = document.getElementById('card-title');
const cardText = document.getElementById('card-text');
const optionButtons = document.querySelectorAll('#options button');
const cardContainer = document.getElementById('card');

let variables = {
    gold: 100,
    army: 50,
    people: 100,
    reputation: 50
};

let cards = [
    { 
        title: "Kart 1", 
        text: "Bu bir karttır. Kart 1'in açıklaması buraya gelecek.", 
        options: [
            { text: "Seçenek 1", effects: { gold: -10, army: 5, people: -5, reputation: 10 } },
            { text: "Seçenek 2", effects: { gold: 20, army: -10, people: -10, reputation: -5 } }
        ]
    },
    { 
        title: "Kart 2", 
        text: "Bu bir karttır. Kart 2'nin açıklaması buraya gelecek.", 
        options: [
            { text: "Seçenek 3", effects: { gold: -5, army: 10, people: 5, reputation: -10 } },
            { text: "Seçenek 4", effects: { gold: -15, army: -5, people: 15, reputation: 5 } }
        ]
    }
];

let currentCardIndex = 0;

updateCard();

optionButtons.forEach(button => {
    button.addEventListener('click', () => chooseOption(button));
});

cardContainer.addEventListener('mousedown', startSwipe);
cardContainer.addEventListener('mouseup', endSwipe);
cardContainer.addEventListener('mouseleave', endSwipe);

let startX = 0;
let endX = 0;

function startSwipe(event) {
    startX = event.clientX;
}

function endSwipe(event) {
    endX = event.clientX;
    if (endX - startX > 50 && currentCardIndex > 0) {
        currentCardIndex--;
        updateCard();
    } else if (startX - endX > 50 && currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        updateCard();
    }
}

function chooseOption(button) {
    const optionIndex = parseInt(button.dataset.optionIndex);
    const currentCard = cards[currentCardIndex];
    const selectedOption = currentCard.options[optionIndex];

    // Değişkenleri güncelle
    for (let variable in selectedOption.effects) {
        variables[variable] += selectedOption.effects[variable];
    }

    console.log(variables); // Güncellenmiş değişkenleri konsola yazdır

    // Bir sonraki kartı göster
    currentCardIndex++;
    if (currentCardIndex >= cards.length) {
        currentCardIndex = 0; // Kartlar bittiğinde başa dön
    }
    updateCard();
}

function updateCard() {
    const currentCard = cards[currentCardIndex];
    cardTitle.textContent = currentCard.title;
    cardText.textContent = currentCard.text;

    // Seçenekleri güncelle
    for (let i = 0; i < optionButtons.length; i++) {
        if (i < currentCard.options.length) {
            optionButtons[i].textContent = currentCard.options[i].text;
            optionButtons[i].style.display = 'block';
            optionButtons[i].dataset.optionIndex = i;
        } else {
            optionButtons[i].style.display = 'none';
        }
    }
}
