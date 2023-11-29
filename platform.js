class platform {
    constructor(x, y, mWidth, mHeight, type, vectorX, vectorY) {
      this.x = x;
      this.y = y;
      this.mWidth = mWidth;
      this.mHeight = mHeight;
      this.type = type;
      this.vectorX = vectorX;
      this.vectorY = vectorY;
    }
    show() {
      rect(this.x, this.y, this.mWidth, this.mHeight);
    }
  }
  // class deathZone {
  //   constructor(x, y, width, height) {
  //     this.x = x;
  //     this.y = y;
  //     this.width = width;
  //     this.height = height;
  //   }
  //   show() {
  //     rect(this.x, this.y, this.width, this.height);
  //   }
  // }
  // class booster {
  //   constructor(x, y, width, height, vectorX, vectorY) {
  //     this.x = x;
  //     this.y = y;
  //     this.width = width;
  //     this.height = height;
  //     this.vectorX = vectorX;
  //     this.vectorY = vectorY;
  //     // this.vector = createVector(
  //     //   vectorX - (x + width / 2),
  //     //   vectorY - (y + height / 2)
  //     // );
  //     // console.log(this.vector);
  //   }
  //   show() {
  //     rect(this.x, this.y, this.width, this.height);
  //   }
  // }
  