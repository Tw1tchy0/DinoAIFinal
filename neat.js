function nextGeneration() {
    calculateFitness();

    for (let i = 0; i < TOTAL; i++) {
        population[i] = pickOne();
    }

    savedPlayers = [];
    generation++;
}

function calculateFitness() {
    let sum = savedPlayers.reduce((acc, p) => acc + p.score, 0);
    for (let p of savedPlayers) {
        p.fitness = sum > 0 ? p.score / sum : 0;
    }
}

function pickOne() {
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r -= savedPlayers[index].fitness;
        index++;
    }
    index--;

    let parent = savedPlayers[index];
    let child = new Player(parent.brain);
    child.brain.mutate(0.1); // 10% mutation rate
    return child;
}