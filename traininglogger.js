class TrainingLogger {
    constructor() {
      this.generations = [];
    }
  
    logGeneration(generation, topScore, lastGenScore, players) {
      const genData = {
        generation,
        topScore,
        lastGenerationScore: lastGenScore,
        averageScore: players.reduce((a, b) => a + b.score, 0) / players.length,
      };
      this.generations.push(genData);
    }
  
    saveLog(filename = "training_log.json") {
      const json = JSON.stringify(this.generations, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
  
      URL.revokeObjectURL(url);
    }
  }