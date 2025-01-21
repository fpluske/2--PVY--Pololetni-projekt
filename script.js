let velikostPlochy = 25;
let celkemRadku = 17;
let celkemSloupcu = 17;
let board;
let context;

let hadX = velikostPlochy * 5;
let hadY = velikostPlochy * 5;

let speedX = 0;
let speedY = 0;
let pohybNahoru = new Audio('zvuky/pohybNahoru.wav');
let pohybDolu = new Audio('zvuky/pohybDolu.wav');
let pohybDoprava = new Audio('zvuky/pohybDoprava.wav');
let pohybDoleva = new Audio('zvuky/pohybDoleva.wav');

let hadBody = [];

let jidloX;
let jidloY;
let jidloZvuk = new Audio('zvuky/ham.wav');

let konecHry = false;
let score = 0;
let zvukKonecHry = new Audio('zvuky/konecHry.wav');

window.onload = function () {
    // Získání prvku board a nastavení jeho rozměrů
    board = document.getElementById("board");
    board.height = celkemRadku * velikostPlochy;
    board.width = celkemSloupcu * velikostPlochy;
    context = board.getContext("2d");

    // Generování prvního jídla
    jidlo();

    // Detekce změny klávesy
    document.addEventListener("keyup", zmenaSmeru);

    // Spuštění herní smyčky
    setInterval(update, 1000 / 10);
}

function update() {
    // Pokud je konec hry, ukonči funkci
    if (konecHry) {
        return;
    }

    // Vyplnění herní plochy šedou barvou
    context.fillStyle = "gray";
    context.fillRect(0, 0, board.width, board.height);

    // Vykreslení jídla žlutou barvou
    context.fillStyle = "yellow";
    context.fillRect(jidloX, jidloY, velikostPlochy, velikostPlochy);

    // Kontrola, zda had snědl jídlo
    if (hadX == jidloX && hadY == jidloY) {
        // Přidání nové části těla hada
        hadBody.push([jidloX, jidloY]);
        // Generování nového jídla
        jidlo();
        // Přehrání zvuku snězení jídla
        jidloZvuk.play();
        // Zvýšení skóre
        score++;
        // Aktualizace skóre na obrazovce
        document.getElementById("score").innerText = score;
    }

    // Pohyb těla hada
    for (let i = hadBody.length - 1; i > 0; i--) {
        hadBody[i] = hadBody[i - 1];
    }
    if (hadBody.length) {
        hadBody[0] = [hadX, hadY];
    }

    // Vykreslení hada bílou barvou
    context.fillStyle = "white";
    hadX += speedX * velikostPlochy;
    hadY += speedY * velikostPlochy;
    context.fillRect(hadX, hadY, velikostPlochy, velikostPlochy);
    for (let i = 0; i < hadBody.length; i++) {
        context.fillRect(hadBody[i][0], hadBody[i][1], velikostPlochy, velikostPlochy);
    }

    // Kontrola, zda had narazil do stěny
    if (hadX < 0
        || hadX > celkemSloupcu * velikostPlochy
        || hadY < 0
        || hadY > celkemRadku * velikostPlochy) {

        konecHry = true;
        konecObraz();
    }

    // Kontrola, zda had narazil do svého těla
    for (let i = 0; i < hadBody.length; i++) {
        if (hadX == hadBody[i][0] && hadY == hadBody[i][1]) {

            konecHry = true;
            konecObraz();
        }
    }
}

// Funkce pro výpis textu
function textPresPole(text, velikost, barva, poziceX, poziceY) {
    context.fillStyle = barva;
    context.font = velikost;
    context.fillText(text, poziceX, poziceY);
}

// Funkce pro výpis závěrečného textu přes hrací pole
function konecObraz() {
    let img = new Image();
    img.src = 'img/konecHry.png'; // Získání obrázku
    img.onload = function () {
        context.drawImage(img, 0, 0, board.width, board.height); // Vykreslení obrázku
        textPresPole("Konec hry!", "50px Arial", "red", board.width / 2 - 140, board.height / 2); // Výpis textu pomocí funkce textPresPole
        textPresPole(`Skóre: ${score}`, "40px Arial", "red", board.width / 2 - 80, board.height / 2 + 50); // Výpis textu pomocí funkce textPresPole
    };
    zvukKonecHry.play();
    // Detekce jakékoliv klávesy a restartování hry
    document.addEventListener('keydown', function () {
        location.reload();
    });
}

// Funkce pro změnu směru hada
function zmenaSmeru() {
    document.addEventListener('keydown', (event) => { 
        const key = event.key.toLowerCase(); // "Předělání" velkých písmen na malé
        // Detekce jednotlivých klávěs (šipky, malé a velké W,S,A,D)
        switch (key) {
            case 'w':
            case 'arrowup':
                if (speedY == 0) {
                    speedX = 0;
                    speedY = -1;
                    pohybNahoru.play();
                }
                break;
            case 's':
            case 'arrowdown':
                if (speedY == 0) {
                    speedX = 0;
                    speedY = 1;
                    pohybDolu.play();
                }
                break;
            case 'a':
            case 'arrowleft':
                if (speedX == 0) {
                    speedX = -1;
                    speedY = 0;
                    pohybDoleva.play();
                }
                break;
            case 'd':
            case 'arrowright':
                if (speedX == 0) {
                    speedX = 1;
                    speedY = 0;
                    pohybDoprava.play();
                }
                break;
            default:
                break;
        }
    });
}

// Vykreslení jídla do hry
function jidlo() {
    jidloX = Math.floor(Math.random() * celkemSloupcu) * velikostPlochy;
    jidloY = Math.floor(Math.random() * celkemRadku) * velikostPlochy;
}
