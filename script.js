const cardText = document.getElementById('card-text');
const option1Btn = document.getElementById('option1');
const option2Btn = document.getElementById('option2');

option1Btn.addEventListener('click', chooseOption);
option2Btn.addEventListener('click', chooseOption);

function chooseOption(event) {
    // Örnek bir seçenekler dizisi
    const options = [
        { text: "Seçenek 1'e tıklandı. Yeni kart metni buraya gelecek.", result: "Sonuç 1" },
        { text: "Seçenek 2'ye tıklandı. Yeni kart metni buraya gelecek.", result: "Sonuç 2" }
    ];

    // Rasgele bir seçenek al
    const randomIndex = Math.floor(Math.random() * options.length);
    const chosenOption = options[randomIndex];

    // Kart metnini güncelle
    cardText.textContent = chosenOption.text;

    // Sonucu konsola yazdır (şu anda)
    console.log(chosenOption.result);
}
