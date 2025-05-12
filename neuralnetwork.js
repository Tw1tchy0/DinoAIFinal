class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
        this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);
        this.bias_h = new Matrix(this.hiddenNodes, 1);
        this.bias_o = new Matrix(this.outputNodes, 1);

        this.weights_ih.randomize();
        this.weights_ho.randomize();
        this.bias_h.randomize();
        this.bias_o.randomize();
    }

    predict(inputArray) {
        let inputs = Matrix.fromArray(inputArray);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(sigmoid);

        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(sigmoid);

        return outputs.toArray();
    }

    copy() {
        let nn = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
        nn.weights_ih = this.weights_ih.copy();
        nn.weights_ho = this.weights_ho.copy();
        nn.bias_h = this.bias_h.copy();
        nn.bias_o = this.bias_o.copy();
        return nn;
    }

    mutate(rate = 0.1) {
        function mutateFn(val) {
            if (Math.random() < rate) {
                return val + randomGaussian() * 0.1;
            }
            return val;
        }

        this.weights_ih.map(mutateFn);
        this.weights_ho.map(mutateFn);
        this.bias_h.map(mutateFn);
        this.bias_o.map(mutateFn);
    }

    draw(x, y, width, height) {
        const levels = [this.inputNodes, this.hiddenNodes, this.outputNodes]; //corrected to match constructor properties
        const nodeRadius = 16;
        const layerSpacing = width / (levels.length - 1);
    
        const maxNodes = Math.max(...levels);
        const verticalSpacing = height / (maxNodes + 1);
    
        let positions = [];
    
        for (let l = 0; l < levels.length; l++) {
            positions[l] = [];
            for (let i = 0; i < levels[l]; i++) {
                const xpos = x + l * layerSpacing;
                const ypos = y + (i + 1) * verticalSpacing;
                positions[l][i] = { x: xpos, y: ypos };
            }
        }
    
        //draw connections from input -> hidden
        for (let i = 0; i < this.inputNodes; i++) { //corrected to match constructor properties
            for (let j = 0; j < this.hiddenNodes; j++) { //corrected to match constructor properties
                const weight = this.weights_ih.data[j][i];
                stroke(weight > 0 ? 'green' : 'red');
                strokeWeight(map(abs(weight), 0, 1, 0.5, 3));
                line(positions[0][i].x, positions[0][i].y, positions[1][j].x, positions[1][j].y);
            }
        }
    
        //draw connections from hidden -> output
        for (let i = 0; i < this.hiddenNodes; i++) { //corrected to match constructor properties
            for (let j = 0; j < this.outputNodes; j++) { //corrected to match constructor properties
                const weight = this.weights_ho.data[j][i];
                stroke(weight > 0 ? 'green' : 'red');
                strokeWeight(map(abs(weight), 0, 1, 0.5, 3));
                line(positions[1][i].x, positions[1][i].y, positions[2][j].x, positions[2][j].y);
            }
        }
    
        //draw nodes
        noStroke();
        fill(255);
        for (let l = 0; l < positions.length; l++) {
            for (let i = 0; i < positions[l].length; i++) {
                ellipse(positions[l][i].x, positions[l][i].y, nodeRadius * 2);
            }
        }
    }

}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

