class Player {
    constructor(x, y, xWidth, midair_jumps) {
      this.x = x;
      this.y = y;
      this.xWidth = xWidth;
      this.corner = 2;
      this.speed = 0.15;
      this.jumpaccel = 0.05;
      this.Hdecel = 0.98;
      this.Vdecel = 0.9975;
      this.gravity = 0.08;
      this.xv = 0;
      this.yv = 0;
      this.jumps = 0;
      this.midair_jumps = midair_jumps;
      this.left = false;
      this.right = false;
      this.coyote = 100;
      this.coyoteTotal = 100;
      this.collidedType = 0;
      this.collidedPlat = {};
      this.shortLine = [];
    }
  
    move() {
      //eww
  
      //variable jumping
      if (this.jumping === true) {
        this.yv -= this.jumpaccel;
      }
      //movement
      if (this.left === true) {
        this.xv -= this.speed;
      }
      if (this.right === true) {
        this.xv += this.speed;
      }
  
      this.yv += this.gravity;
      this.yv *= pow(this.Vdecel, deltaTime);
      this.xv *= pow(this.Hdecel, deltaTime);
  
      // collision.
      this.collision();
  
      //death zone collision
      if (this.collidedType === 1) {
        this.x = enteredMv[0];
        this.y = enteredMv[1];
        this.xv = enteredMv[2];
        this.yv = enteredMv[3];
      }
  
      // boosterCollision
      if (this.collidedType === 2) {
        this.xv = this.collidedPlat.vectorX;
        this.yv = this.collidedPlat.vectorY;
      }
  
      //collision done
  
      //sets a top speed for better control feeling
      this.xv = constrain(this.xv, -0.4, 0.4);
      this.yv = constrain(this.yv, -1, 1);
      //applies velocity
      this.x += this.xv * deltaTime;
      this.y += this.yv * deltaTime;
      //     coyote time
      if (
        this.coyote <= 0 &&
        this.coyote >= -200 &&
        this.jumps == this.midair_jumps
      ) {
        this.jumps -= 1;
        this.coyote = -1000;
      }
    }
    show() {
      fill(playerColor);
      square(this.x, this.y, this.xWidth, this.corner);
    }
  
    collision() {
      this.collidedType = 0;
      this.collidedPlat = {};
      for (let i = 0; i < 3; i++) {
        this.shortLine = [];
  
        for (let index = 0; index < sortedPlats.length; index++) {
          this.collisionStep(index);
        }
      }
    }
  
    collisionStep(index) {
      // finds the first point on each line
      let lines = [];
  
      //     This checks all possible areas the square could go, to prevent entirly useless steps.
      if (
        !rectRect(
          this.x - abs(this.xv) * deltaTime,
          this.y - (abs(this.yv) * deltaTime),
          3 * abs(this.xv) * deltaTime + this.xWidth,
          3 * abs(this.yv) * deltaTime + this.xWidth,
          sortedPlats[index].x,
          sortedPlats[index].y,
          sortedPlats[index].mWidth,
          sortedPlats[index].mHeight
        )
      ) {
        return;
      }
      // returns the collision of this platform, sorted
      lines = partCollision(
        this.x,
        this.y,
        this.xv,
        this.yv,
        this.xWidth,
        this.xWidth,
        sortedPlats[index]
      );
  
      if (lines.length) {
        lines[0].wall = index;
        this.shortLine.push(lines[0]);
      }
      //end of for each rect
  
      //sorts lines by thier uA. uA is the proportion along the line that it collides with something
      this.shortLine.sort((a, b) => {
        if (a.uA < b.uA) {
          return -1;
        } else {
          return 1;
        }
      });
      //check if the array Lines has any 0th value and
      if (this.shortLine.length && this.shortLine[0].uA <= 1) {
        //   this.x = this.shortLine[0].intersectionX - this.shortLine[0].transformX;
        //   this.y = this.shortLine[0].intersectionY - this.shortLine[0].transformY;
        //         define collided type so it knows if it is a booster
        this.collidedPlat = sortedPlats[this.shortLine[0].wall];
        this.collidedType = this.collidedPlat.type;
        //
        let vectorMag = Math.sqrt(this.xv * this.xv + this.yv * this.yv);
        let antiMag =
          cos(atan2(this.yv, this.xv) - (TWO_PI - this.shortLine[0].angle)) *
          (1 - this.shortLine[0].uA) *
          vectorMag;
        this.xv -= cos(this.shortLine[0].angle) * antiMag;
        this.yv += sin(this.shortLine[0].angle) * antiMag;
        if (
          this.shortLine[0].side == "top" ||
          this.shortLine[0].side == "bottom"
        ) {
          if (this.shortLine[0].side == "top") {
            this.jumps = this.midair_jumps;
            //             sets the coyote time to its maximum
            this.coyote = this.coyoteTotal;
          }
          this.jumping = false;
          // this.yv = 0;
          // this.xv =
          //   (this.xv * deltaTime +
          //     this.x -
          //     (this.shortLine[0].intersectionX - this.shortLine[0].transformX)) /
          //   deltaTime;
        } else if (
          this.shortLine[0].side == "left" ||
          this.shortLine[0].side == "right"
        ) {
          // this.xv = 0;
          // this.yv =
          //   (this.yv * deltaTime +
          //     this.y -
          //     (this.shortLine[0].intersectionY - this.shortLine[0].transformY)) /
          //   deltaTime;
        }
        //repeats all collision again, to account for edge cases
      }
    }
  }
  