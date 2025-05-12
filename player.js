class Player {
    constructor(brain) {
        this.x = width / 6;
        this.y = height - 150;
        this.standingY = this.y;
        this.duckingY = this.y + 50;

        this.hitboxShrink = 0.15;

        this.width = 132;
        this.height = 144;

        this.isJumping = false;
        this.isDucking = false;
        this.isFastFalling = false;

        this.velocityY = 0;
        this.gravity = 1;
        this.jumpForce = -20;

        this.animTimer = 0;
        this.displayRun1 = true;

        this.score = 0;
        this.fitness = 0;
        this.dead = false;

        this.brain = brain ? brain.copy() : new NeuralNetwork(5, 10, 3);
    }

    think(cacti) {
        //find the closest cactus
        let closest = null;
        let closestDist = Infinity;
        for (let c of cacti) {
            let d = c.x - this.x;
            if (d > 0 && d < closestDist) {
                closest = c;
                closestDist = d;
            }
        }

        if (closest) {
            let inputs = [
                this.y / height,
                this.velocityY / 30,
                closest.x / width,
                closest.width / 200,
                closest.height / 200,
            ];

            let output = this.brain.predict(inputs);

            if (output[0] > 0.5) {
                this.jump();
            } else if (output[1] > 0.5) {
                this.duck();
            } else if (output[2] > 0.5) {
                this.smallJump();
            } else {
                this.standUp();
            }
        }
    }

    jump() {
        if (!this.isJumping && !this.isDucking) {
            this.isJumping = true;
            this.velocityY = this.jumpForce;
        }
    }

    smallJump() {
        if (!this.isJumping && !this.isDucking) {
            this.isJumping = true;
            this.velocityY = this.jumpForce / 2; //half strength jump
        }
    }

    duck() {
        if (this.isJumping) {
            //fast fall
            this.isFastFalling = true;
            this.gravity = 5; //increase gravity while fast falling
        } else {
            //regular duck
            this.isDucking = true;
            this.y = this.duckingY;
            this.height = 94;
        }
    }

    standUp() {
        this.isDucking = false;
        this.y = this.standingY;
        this.height = 144;
        this.isFastFalling = false;
        this.gravity = 1; //reset gravity
    }

    update() {
        if (this.isJumping) {
            this.y += this.velocityY;
            this.velocityY += this.gravity;
    
            //penalty for jumping too much
            this.fitness -= 0.0; // jump penalty


            if (this.y >= this.standingY) {
                this.y = this.standingY;
                this.isJumping = false;
                this.velocityY = 0;

                if (this.isFastFalling) {
                    //start ducking after fast fall finishes
                    this.isFastFalling = false;
                    this.gravity = 1;
                    this.isDucking = true;
                    this.y = this.duckingY;
                    this.height = 94;
                }
            }
        } else {
            //reward staying grounded
            this.fitness += 0.2; // ground reward
        }

        this.animTimer++;
        if (this.animTimer >= 5) {
            this.displayRun1 = !this.displayRun1;
            this.animTimer = 0;
        }
    }

    show(run1, run2, duck1, duck2) {
        let sprite;

        if (this.isDucking && !this.isJumping) {
            sprite = this.displayRun1 ? duck1 : duck2;
        } else {
            sprite = this.displayRun1 ? run1 : run2;
        }

        image(sprite, this.x, this.y, this.width, this.height);

        //draw hitbox
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height);
    }
    
    showHitbox() {
        const shrinkX = this.width * this.hitboxShrink / 2;
        const shrinkY = this.height * this.hitboxShrink / 2;
    
        const hitboxX = this.x + shrinkX;
        const hitboxY = this.y + shrinkY;
        const hitboxW = this.width * (1 - this.hitboxShrink);
        const hitboxH = this.height * (1 - this.hitboxShrink);
    
        noFill();
        stroke(255, 0, 0); //red color
        rect(hitboxX, hitboxY, hitboxW, hitboxH);
    }

    drawBrain(x, y, w, h) {
        if (this.brain && this.brain.draw) {
            this.brain.draw(x, y, w, h);
        }
    }
}