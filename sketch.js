let logger;

let ground;
let groundImg;
let dinoRun1, dinoRun2, dinoDuck1, dinoDuck2;
let cactusImgs = [];
let cacti = [];

let cactusTimer = 0;
let cactusSpawnInterval;

let population = [];
let TOTAL = 500;
let savedPlayers = [];

let generation = 1;

let lastGenerationScore = 0;
let topScore = 0;

function preload() {
    groundImg = loadImage("./assets/Ground.png", () => {
        console.log("Ground image loaded successfully!");
        console.log("Ground image dimensions:", groundImg.width, groundImg.height);
    });

    dinoRun1 = loadImage("./assets/DinoRun1.png");
    dinoRun2 = loadImage("./assets/DinoRun2.png");
    dinoDuck1 = loadImage("./assets/DinoDuck1.png");
    dinoDuck2 = loadImage("./assets/DinoDuck2.png");

    cactusImgs[0] = loadImage("./assets/CactusSmall1.png");
    cactusImgs[1] = loadImage("./assets/CactusSmall2.png");
}

function setup() {
    createCanvas(2350, 1080);
    ground = new Ground();
    logger = new TrainingLogger();

    for (let i = 0; i < TOTAL; i++) {
        population[i] = new Player();
    }

    cactusSpawnInterval = Math.floor(random(60, 120));
    cacti = [];
}

function draw() {
    background(240);
    ground.update();
    ground.show();

    //cactus spawning
    cactusTimer++;
    if (cactusTimer > cactusSpawnInterval) {
        cacti.push(new Cactus());
        cactusTimer = 0;
        cactusSpawnInterval = Math.floor(random(60, 120));
    }

    for (let c of cacti) {
        c.update();
        c.show();
    }

    for (let i = population.length - 1; i >= 0; i--) {
        let p = population[i];

        p.think(cacti);
        p.update();
        p.show(dinoRun1, dinoRun2, dinoDuck1, dinoDuck2);

        if (cacti.some(c => c.hits(p))) {
            savedPlayers.push(population.splice(i, 1)[0]);
        }

        p.score++;
    }

    if (population.length === 0) {
        lastGenerationScore = getBestScore();
        console.log("Best Score:" + getBestScore());

        logger.logGeneration(generation, topScore, lastGenerationScore, savedPlayers);

        if (lastGenerationScore > topScore) {
            topScore = lastGenerationScore;
        }
        

        nextGeneration();
        cacti = [];
        cactusTimer = 0;
    }
    

    //display debug info
    fill(0);
    noStroke();
    textSize(40);
    text("Generation: " + generation, 50, 70);
    text("Alive: " + population.length, 50, 120);
    text("Best Current Score: " + getBestScore(), 50, 170);
    text("Last Generation Score: " + lastGenerationScore, 50, 220);
    text("Top Score: " + topScore, 50, 270);

    if (population.length > 0) {
        //visualize brain of first alive player
        population[0].drawBrain(width - 400, 50, 350, 300);
    }
}


function getBestScore() {
    return Math.max(...savedPlayers.map(p => p.score), 0);
}

function keyPressed() {
    if (key === 'S' || key === 's') {
        //save the log when the s is pressed
        logger.saveLog();
        console.log("Training log saved!");
    }
}