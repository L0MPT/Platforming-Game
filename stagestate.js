class Stage {
    constructor() {
      this.stageX = -1;
      this.stageY = 0;
    }
    //   a terrible way of doing this
    newstage(changex = 1, changey = 0) {
      this.stageX += changex;
      this.stageY += changey;
      platforms = [];
      sortedPlats = [];
      if (this.stageY == 0) {
        platforms.push(new platform(-10, 390, 420, 100,0));
      }
      potentialPlatforms.forEach((pplatform) => {
        let platformPush = false;
        let offsetX = 0;
        let offsetY = 0;
  
        if (
          pplatform.StageX >= this.stageX - 1 &&
          pplatform.StageX <= this.stageX + 1 &&
          pplatform.StageY >= this.stageY - 1 &&
          pplatform.StageY <= this.stageY + 1
        ) {
          // on screen or off by one
          platformPush = true;
          offsetX = (pplatform.StageX - this.stageX) * 400;
          offsetY = (pplatform.StageY - this.stageY) * -400;
        }
        if (platformPush) {
          if (pplatform.Platform.type == 0 || pplatform.Platform.type ==1) {
            // I think this is a memory leak
            platforms.push(
              new platform(
                pplatform.Platform.x + offsetX,
                pplatform.Platform.y + offsetY,
                pplatform.Platform.mWidth,
                pplatform.Platform.mHeight,
                pplatform.Platform.type
              )
            );
          }
          if (pplatform.Platform.type == 2) {
            platforms.push(
              new platform(
                pplatform.Platform.x + offsetX,
                pplatform.Platform.y + offsetY,
                pplatform.Platform.mWidth,
                pplatform.Platform.mHeight,
                pplatform.Platform.type,
                pplatform.Platform.vectorX,
                pplatform.Platform.vectorY
              )
            );
          }
        }
      });
      sortPlats();
      // if (this.stage == 0){
      //   platforms.push(new platform(200, 300, 100, 20));
      // }
      // if (this.stage == 1){
      //   platforms.push(new platform(300,195,20,200));
      // }
    }
  }
  