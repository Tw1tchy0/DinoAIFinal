class Genome{
    constructor(inputs, outputs, crossover){
        this.connections = []; //list of connections to represent the network
        this.nodes = []; //list of nodes to represent the network

        this.inputs = inputs; 
        this.outputs = outputs; 
        this.layers = 2;
        this.nextNode = 0;
        this.biasNode = null;

        this.network = []; // lis tof nodes in the order that they need to be

        if(crossover) return;

        this.createNodes();
    }

    //create nodes
    createNodes(){
        //create input nodes
        for(let i = 0; i < this.inputs; i++){
            this.nodes.push(new Node(i));
            this.nextNode++;
            this.nodes[i].layer = 0;
        }

        //create output nodes
        for(let i = 0; i < this.outputs; i++){
            this.nodes.push(new Node(i + this.inputs));
            this.nodes[i + this.inputs].layer = 1;
            this.nextNode++;
        }

        //create bias node
        this.nodes.push(new Node(this.nextNode));
        this.biasNode = this.nextNode;
        this.nextNode++;
        this.nodes[this.biasNode].layer = 0; // Bias node is in the input layer
    }

    getNode(id){
        for(let i = 0; i < this.nodes.length; i++){
            let node = this.nodes[i];
            if(node.id === id){
                return node;
            }
        }
        return null;
    }

    //adds a connection to the genome
    connectNodes(){
        for (let i = 0; i < this.nodes.length; i++){
            this.nodes[i].outputConnections = [];
        }

        for(let i = 0; i < this.connections.length; i++){
            this.connections[i].fromNode.outputConnections.push(this.connections[i]);
        }
    }

    //process inputs
    feedForward(vision){
        for(let i = 0; i < this.inputs; i++){
            this.nodes[i].outputValue = vision[i];
        }

        //set output of bias node
        this.nodes[this.biasNode].outputValue = 1; // Bias node always outputs 1

        //engage each node in the network sequentially
        for(let i = 0; i < this.network.length; i++){
            this.network[i].engage();
        }  

        //collect the outputs from the output nodes
        let outputs = [];
        for(let i = 0; i < this.outputs; i++){
            outputs[i] = this.nodes[this.inputs + i].outputValue;
        }

        //reset all the input values of all nodes so that no left over values affect the next frame
        for(let i = 0; i < this.nodes.length; i++){
            this.nodes[i].inputValue = 0;
        }

        return outputs;
    }

    //sets up full NN as a list if nodes in order
    generateNetwork(){
        this.connectNodes();
        this.network = [];

        for(let j = 0; j < this.layers; j++){
            for(let i = 0; i < this.nodes.length; i++){
                if(this.nodes[i].layer === j){
                    this.network.push(this.nodes[i]);
                }
            }
        }
    }

    //mutates the network by adding a new node by disabling a random connection creating a new one
    addNode(innovationHistory){
        //ensure there is at least one connection to mutate
        if(this.connections.length === 0){
            this.addConnection(innovationHistory);
            return;
        }

        //select a valid connection that does not involve the bias node
        let randomConnection;
        do{
            randomConnection = floor(random(this.connections.length));
        } while (
            this.connections[randomConnection].fromNode === this.nodes[this.biasNode] &&
            this.connections.length !== 1
        );

        //disable the selected connection
        let connection = this.connections[randomConnection];
        connection.enabled = false;

        //create a new node and adjust the node number 
        let newNode = new Node(this.nextNode++);
        this.nodes.push(newNode);
        newNode.layer = connection.fromNode.layer + 1; // New node is one layer ahead of the fromNode

        //add connections to and from new node
        this.connections.push(
            new Connection(
                connection.fromNode,
                newNode,
                1, // Default weight for new connections
                this.getInnovationNumber(innovationHistory, connection.fromNode, newNode)
            )
        );
        this.connections.push(
            new Connection(
                newNode,
                connection.toNode,
                connection.weight, // Weight from the original connection
                this.getInnovationNumber(innovationHistory, newNode, connection.toNode)
            )
        );

        //connect the bias to the new node with a weight of 0
        this.connections.push(
            new Connection(
                this.nodes[this.biasNode],
                newNode,
                0, // Bias connection weight
                this.getInnovationNumber(innovationHistory, this.nodes[this.biasNode], newNode)
            )
        );

        //adjust layers if necessary 
        if(newNode.layer === connection.toNode.layer){
            this.nodes.forEach((node) => {
                if(node.layer >= newNode.layer && node !== newNode) {
                    node.layer++;
                }
            });
            this.layers++;
        }

        //reconnect nodes to update connections 
        this.connectNodes();
    }

    //adds a new connection between two nodes which arent already connected 
    addConnection(innovationHistory) {
        if(this.fullyConnected()){
            return;
        }
    
        //get a random node
        let randomNode1 = floor(random(this.nodes.length));
        let randomNode2 = floor(random(this.nodes.length));

        //make sure the nodes arent in the same layer or are already connected
        while (this.randomConnectionNodesFailed(randomNode1, randomNode2)) {
            randomNode1 = floor(random(this.nodes.length));
            randomNode2 = floor(random(this.nodes.length));
        }

        //if the first random node is after the second random node, swap them (bc u want it to go from node1 to node 2)
        let temp;
        if(this.nodes[randomNode1].layer > this.nodes[randomNode2].layer){
            temp = randomNode2;
            randomNode2 = randomNode1;
            randomNode1 = temp;
        }

        //get innovation number of the connection 
        //new number if no identical genome mutated the same way 
        let connectionInnovationNumber = this.getInnovationNumber(
            innovationHistory, 
            this.nodes[randomNode1], 
            this.nodes[randomNode2]
        );

        //add connection with a random weight 
        this.connections.push(
            new Connection(
                this.nodes[randomNode1],
                this.nodes[randomNode2],
                random(-1, 1),
                connectionInnovationNumber
            )
        );
        this.connectNodes();
    }

    //checks if 2 nodes are in the same layer or are already cionnected
    randomConnectionNodesFailed(r1, r2) {
        if (this.nodes[r1].layer === this.nodes[r2].layer) {
            return true; // Nodes are in the same layer
        }
        if (this.nodes[r1].isConnectedTo(this.nodes[r2])){
            return true; // Nodes are already connected
        }
        return false; // Nodes are valid for connection
    }

    //returns the innovation number for the new mutation 
    getInnovationNumber(innovationHistory, fromNode, toNode) {
        let isNew = true;
        let connectionInnovationNumber = nextConnectionNumber;

        for(let i = 0; i < innovationHistory.length; i++) {
            if(innovationHistory[i].matches(this, fromNode, toNode)) {
                isNew = false;
                connectionInnovationNumber = innovationHistory[i].innovationNumber;
                break;
            }
        }

        //if the mutation is new, add it to the history
        if (isNew) {
            let innovationNumbers = [];

            for(let i = 0; i < this.connections.length; i++){
                innovationNumbers.push(this.connections[i].innovationNumber);
            }

            // add this mutation to the innovation history
            innovationHistory.push(
                new ConnectionHistory(fromNode.id, toNode.id, connectionInnovationNumber, innovationNumbers)
            );
            nextConnectionNumber++;
        }
        return connectionInnovationNumber;
    }

    //returns whether a network is fully connected or not
    fullyConnected() {
        let maxConnections = 0
        let nodesInLayers = [];
        for(let i = 0; i < this.layers; i++){
            nodesInLayers[i] = 0;
        }

        //populate array 
        for (let i = 0; i < this.nodes.length; i++) {
            nodesInLayers[this.nodes[i].layer]++;
        }

        //for each layer the max amnt of connections is the number of nodes in the layer times the number of nodes in the next layer
        for(let i = 0; i < this.layers - 1; i++){
           let nodesInFront = 0;
           for(let j = i + 1; j < this.layers; j++){
                nodesInFront += nodesInLayers[j]; //adds up nodes
            }
            maxConnections += nodesInLayers[i] * nodesInFront; //multiplies the number of nodes in the layer by the number of nodes in the next layer
        }

        if (maxConnections <= this.connections.length) {
            return true; // Network is fully connected
        }
        return false; // Network is not fully connected
    }

    mutate(innovationHistory){
        if(this.connections.length === 0){
            this.addConnection(innovationHistory);
        }

        //80% of the time mutate the weights 
        if (random(1) < 0.8) {
            for(let i = 0; i < this.connections.length; i++){
                this.connections[i].mutateWeight();
            }
        }

        // 5% of the time add a new connection
        if (random(1) < 0.05) {
            this.addConnection(innovationHistory);
        }

        //1% of the time add a new node
        if (random(1) < 0.01) {
            this.addNode(innovationHistory);
        }
    }

    crossover(parent2){
        let child = new Genome(this.inputs, this.outputs, true);
        child.connections = [];
        child.nodes = [];
        child.layers = this.layers;
        child.biasNode = this.biasNode;

        let childConnections = [];
        let isEnabled = true;

        //combine the connections of both parents
        for(let i = 0; i < this.connections.length; i++){
            let setEnabled = true;

            //find a matching connection in parent 2 by innovation number 
            let parent2Connection = this.matchingConnection(parent2, this.connections[i].innovationNumber);

            //if a connection is found
            if(parent2Connection != "no connections"){
                //if either connection is disabled, possibly disable in child
                if(!this.connections[i].enabled || !parent2.connections[parent2Connection].enabled){
                    if(random(1) < 0.75){
                        setEnabled = false;
                    }
                }

                //randomly inherity the connection from either parent
                if(random(1) < 0.5){
                    childConnections.push(this.connections[i]);
                } else{
                    childConnections.push(parent2.connections[parent2Connection]);
                }
            } else {
                //if no matching connection is found, inherit from parent 1
                childConnections.push(this.connections[i]);
                setEnabled = this.connections[i].enabled;
            }
            isEnabled.push(setEnabled);
        }

        //clone all nodes from this genome to the child
        for(let i = 0; i < this.nodes.length; i++){
            child.nodes.push(this.nodes[i].clone());
        }

        //add clones connections to the child
        for(let i = 0; i < childConnections.length; i++){
            child.connections.push(
                child.connections.clone(
                    child.getNode(childConnections[i].fromNode.id),
                    child.getNode(childConnections[i].toNode.id)
                )
            );
            child.connections[i].enabled = isEnabled[i];
    }

    child.connectNodes();

    return child;
    }

    //search for a matching connection in parent 2 by innovation number
    matchingConnection(parent2, innovationNumber){
        for(let i = 0; i < parent2.connections.length; i++){
            if(parent2.connections[i].innovationNumber === innovationNumber){
                return i;
            }
        }
        return "no connections"; // No matching connection found
    }

    //no explanation needed
    clone(){
        let clone = new Genome(this.inputs, this.outputs, true);

        for(let i = 0; i < this.nodes.length; i++){
            clone.nodes.push(this.nodes[i].clone());
        }

        //Clone connections with proper node references
        for(let i = 0; i < this.connections.length; i++){
            clone.connections.push(
                this.connections[i].clone(
                    clone.getNode(this.connections[i].fromNode.id),
                    clone.getNode(this.connections[i].toNode.id)
                )
            );
        }

        clone.layers = this.layers;
        clone.nextNode = this.nextNode;
        clone.biasNode = this.biasNode;
        clone.connectNodes();

    }
}