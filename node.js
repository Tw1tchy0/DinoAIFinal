class Node{
    constructor(idNumber){
        this.id = idNumber;
        this.layer = 0;
        this.inputValue = 0;
        this.outputValue = 0;
        this.outputConnections = [];
    }

    //processes the input value and returns the output value
    engage(){
        if(this.layer !== 0){
            this.outputValue = this.sigmoid(this.inputValue);
        }

        //loop through all output connections and update the input value of the connected nodes
        for(let i = 0; i < this.outputConnections.length; i++){
            if(this.outputConnections[i].enabled){
                this.outputConnections[i].toNode.inputValue += this.outputConnections[i].weight * this.outputValue;
            }
        }
    }

    sigmoid(x){
        return 1 / (1 + pow(Math.E, -4.9 * x));
    }

    clone(){
        let clone = new Node(this.id);
        clone.layer = this.layer;
        return clone;
    }

    isConnectedTo(node){
        if(node.layer === this.layer){
            return false;
        }

        if(node.layer < this.layer)
            for(let i = 0; i < this.outputConnections.length; i++){
                if(node.outputConnections[i].toNode === this){
                    return true;
                }
            } else{
                for(let i = 0; i < node.outputConnections.length; i++){
                    if(this.outputConnections[i].toNode === node){
                        return true;
                    }
                }
            }
    }
}