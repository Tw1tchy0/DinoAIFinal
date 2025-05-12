class Ground {
    constructor() {
        this.img = groundImg;
        this.segments = [];

        this.y = height - this.img.height; // aligned to bottom
        this.gameSpeed = 15;

        //Initialize enough segments to fill the screen plus one extra
        let numSegments = Math.ceil(width / this.img.width) + 1;
        for (let i = 0; i < numSegments; i++) {
            this.segments.push(i * this.img.width);
        }
    }

    move() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i] -= this.gameSpeed;
        }

        //recycle ground segments that move off screen
        if (this.segments[0] + this.img.width < 0) {
            let removed = this.segments.shift();
            this.segments.push(this.segments[this.segments.length - 1] + this.img.width);
        }
    }

    update() {
        this.move();
    }

    show() {
        for (let x of this.segments) {
            image(this.img, x, this.y);
        }
    }
}