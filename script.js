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
    board = document.getElementById("board");
    board.height = celkemRadku * velikostPlochy;
    board.width = celkemSloupcu * velikostPlochy;
    context = board.getContext("2d");

    jidlo();
    document.addEventListener("keyup", zmenaSmeru);
    setInterval(update, 1000 / 10);
}

function update() {
    if (konecHry) {
        return;
    }

    context.fillStyle = "gray";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "yellow";
    context.fillRect(jidloX, jidloY, velikostPlochy, velikostPlochy);

    if (hadX == jidloX && hadY == jidloY) {
        hadBody.push([jidloX, jidloY]);
        jidlo();
        jidloZvuk.play();
        score++;
        document.getElementById("score").innerText = score;
    }

    for (let i = hadBody.length - 1; i > 0; i--) {
        hadBody[i] = hadBody[i - 1];
    }
    if (hadBody.length) {
        hadBody[0] = [hadX, hadY];
    }

    context.fillStyle = "white";
    hadX += speedX * velikostPlochy;
    hadY += speedY * velikostPlochy;
    context.fillRect(hadX, hadY, velikostPlochy, velikostPlochy);
    for (let i = 0; i < hadBody.length; i++) {
        context.fillRect(hadBody[i][0], hadBody[i][1], velikostPlochy, velikostPlochy);
    }

    if (hadX < 0
        || hadX > celkemSloupcu * velikostPlochy
        || hadY < 0
        || hadY > celkemRadku * velikostPlochy) {

        konecHry = true;
        konecObraz();
    }

    for (let i = 0; i < hadBody.length; i++) {
        if (hadX == hadBody[i][0] && hadY == hadBody[i][1]) {

            konecHry = true;
            konecObraz();
        }
    }
}

function textPresPole(text, velikost, barva, poziceX, poziceY) {
    context.fillStyle = barva;
    context.font = velikost;
    context.fillText(text, poziceX, poziceY);
}

function konecObraz() {
    let img = new Image();
    img.src = 'img/konecHry.png';
    img.onload = function () {
        context.drawImage(img, 0, 0, board.width, board.height);
        textPresPole("Konec hry!", "50px Arial", "red", board.width / 2 - 140, board.height / 2);
        textPresPole(`Skóre: ${score}`, "40px Arial", "red", board.width / 2 - 80, board.height / 2 + 50);
    };
    zvukKonecHry.play();
}

function zmenaSmeru() {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
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

function jidlo() {
    jidloX = Math.floor(Math.random() * celkemSloupcu) * velikostPlochy;
    jidloY = Math.floor(Math.random() * celkemRadku) * velikostPlochy;
}
