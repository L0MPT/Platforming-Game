// p5.disableFriendlyErrors = true; // disables FES, this imprves performance vastly, but disable when testing

let frames = [60]
const average = array => array.reduce((a, b) => a + b) / array.length;

let stage = 0;
let player1;
let stagestate;
let platforms = [];
let sortedPlats = [];
let platformCreate = false;
let newPlatform;
let potentialPlatforms = [];
let creationMode = false;
let enteredMv = [50, 260, 0, 0];
let platType = "0";

let colors = [];
let playerColor;

let platformIndexs = [];
let platformColors = [];

function preload() {
  importData = loadJSON("/l0mp/Platforming-Game/levels/stage.json");
}

function setup() {
  // frameRate(10);
  createCanvas(400, 400);
  stagestate = new Stage();
  player1 = new Player(50, 260, 20, 2);

  //   colors
  playerColor = color("green")
  platformColors = [
    color("white"),
    color("red"),
    color("teal"),
  ];

  potentialPlatforms = Object.values(importData);
  potentialPlatforms.forEach((potent) => {
    let object = potent.Platform;
    if (potent.Platform.type == 0 || potent.Platform.type == 1) {
      potent.Platform = new platform(
        object.x,
        object.y,
        object.mWidth,
        object.mHeight,
        object.type
      );
    } else if (potent.Platform.type == 2) {
      potent.Platform = new platform(
        object.x,
        object.y,
        object.mWidth,
        object.mHeight,
        2,
        object.vectorX,
        object.vectorY
      );
    }
  });

  //   if the load failed, create some defauts
  if (potentialPlatforms.length < 1) {
    potentialPlatforms = [
      { StageX: 0, StageY: 0, Platform: new platform(200, 300, 100, 20) },
      { StageX: 1, StageY: 0, Platform: new platform(300, 195, 20, 200) },
    ];
  }
  new platform(300, 195, 20, 200);
  stagestate.newstage();
}
function draw() {
  background(220);
  fill('black')
  text(frameRate(), width - 30, 20);
  text(average(frames), width-30, 40)
//   average framerate from past n frames
  frames.push(frameRate())
  if(frames.length>100){
    frames.splice(0, 1);
  }
    
    
    
  //   this allows for playerless creation of stages.
  if (!creationMode) {
    player1.move();
    //     reduces the player's coyote time, allowing for some limited error when jumping
    player1.coyote -= deltaTime;

    if (player1.x > width - player1.xWidth) {
      player1.x = 0;
      stagestate.newstage(1, 0);
      enteredMv = [0, player1.y, player1.xv, player1.yv];
    }
    if (player1.x < 0) {
      player1.x = 380;
      stagestate.newstage(-1, 0);
      enteredMv = [380, player1.y, player1.xv, player1.yv];
    }
    if (player1.y > height - player1.xWidth) {
      player1.y = 0;
      stagestate.newstage(0, -1);
      enteredMv = [player1.x, 0, player1.xv, player1.yv];
    }
    if (player1.y < 0) {
      player1.y = 380;
      stagestate.newstage(0, 1);
      enteredMv = [player1.x, 380, player1.xv, player1.yv];
    }

    player1.show();
  } else {
    textSize(20);
    textAlign(LEFT, TOP);
    text(stagestate.stageX, 10, 10);
    text(stagestate.stageY, 10, 30);
  }
  // push();
  // fill("teal");
  // boosters.forEach((booster) => {
  //   booster.show();
  // });
  // pop();
  for (let i = 0; i < platformIndexs.length; i++) {
    //     this fill finds the index that the platform index show's type
    fill(platformColors[platformIndexs[i][1]]);
    for (
      let index = platformIndexs[i][0];
      index < sortedPlats.length || sortedPlats[index] == platformIndexs[i][1];
      index++
    ) {
      sortedPlats[index].show();
    }
  }
  // push();
  // fill("red");
  // deathZones.forEach((deathZone) => {
  //   deathZone.show();
  // });
  // pop();
  if (platformCreate) {
    if (platType != "boosterVec") {
      newPlatform.mWidth = round((mouseX - newPlatform.x) / 10) * 10;
      newPlatform.mHeight = round((mouseY - newPlatform.y) / 10) * 10;
      push();
      fill(platformColors[platType]);
      newPlatform.show();
      pop();
    } else {
      circle(mouseX, mouseY, 5);
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player1.left = true;
  } else if (keyCode === RIGHT_ARROW) {
    player1.right = true;
  } else if (keyCode === 13) {
    saveJSON(potentialPlatforms);
  } else if (keyCode === 90) {
    potentialPlatforms.splice(potentialPlatforms.length - 1, 1);
    sortedPlats.splice(sortedPlats.indexOf(platforms[platforms.length - 1]), 1);
    platforms.splice(platforms.length - 1, 1);
  } else if (keyCode === 87 && creationMode) {
    stagestate.newstage(0, 1);
  } else if (keyCode === 83 && creationMode) {
    stagestate.newstage(0, -1);
  } else if (keyCode === 65 && creationMode) {
    stagestate.newstage(-1, 0);
  } else if (keyCode === 68 && creationMode) {
    stagestate.newstage(1, 0);
  } else if (keyCode === 49) {
    //     changes the platform type to normal platforms if one is pressed
    platType = 0;
  } else if (keyCode === 50) {
    //     changes to death zone if two is pressed
    platType = 1;
  } else if (keyCode === 51) {
    //     changes to booster
    platType = 2;
  } else if (keyCode === 32) {
    //     sets creation mode
    if (creationMode) {
      creationMode = false;
    } else {
      creationMode = true;
    }
  }
  // else if (keyCode === 32){
  //   platforms.push(
  //     new platform(mouseX,mouseY,100,40)
  //     );
  // }
  if (keyCode === UP_ARROW && player1.jumps > 0) {
    //yv was -15, is lower for variable jump testing.
    // to change the amount of variance, increase the effect of jumping and decrese the yv here.
    // console.log(player1.yv,player1.y)
    player1.yv = -1;
    player1.jumps -= 1;
    player1.jumping = true;
  }
  return false;
}
function mousePressed() {
  platformCreate = true;
  if (platType == "boosterVec") {
    newVecX = mouseX;
    newVecY = mouseY;
  } else {
    newPlatform = new platform(
      round(mouseX / 10) * 10,
      round(mouseY / 10) * 10,
      0,
      0,
      platType,
      0,
      0
    );
  }
}
function mouseReleased() {
  platformCreate = false;
  if (platType != "boosterVec") {
    //   flips the platform to the right orientation
    if (newPlatform.mHeight < 0) {
      newPlatform.y += newPlatform.mHeight;
      newPlatform.mHeight *= -1;
    }
    if (newPlatform.mWidth < 0) {
      newPlatform.x += newPlatform.mWidth;
      newPlatform.mWidth *= -1;
    }
    if (newPlatform.mWidth >= 0.1 && newPlatform.mHeight >= 0.1) {
      potentialPlatforms.push({
        StageX: stagestate.stageX,
        StageY: stagestate.stageY,
        Platform: newPlatform,
      });
      platforms.push(newPlatform);
      sortPlats();
      if (platType == 2) {
        platType = "boosterVec";
      }
    }
  } else {
    // let tempPlat
    tempPlat =
      sortedPlats[sortedPlats.indexOf(platforms[platforms.length - 1])];
    tempPlat.vectorX = newVecX - (tempPlat.x + tempPlat.mWidth / 2);
    tempPlat.vectorY = newVecY - (tempPlat.y + tempPlat.mHeight / 2);
    platType = 2;
  }
}
function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    player1.left = false;
  } else if (keyCode === RIGHT_ARROW) {
    player1.right = false;
  }
  if (keyCode === UP_ARROW) {
    player1.jumping = false;
  }
  return false;
}

function test() {
  potentialPlatforms.push({
    StageX: 1,
    StageY: 0,
    Booster: new booster(180, 240, 60, 40, 10, -10),
  });
}
function sortPlats() {
  //   this sorts the platforoms by their type so that the different collored shows are optimized
  sortedPlats = [...platforms].sort((a, b) => {
    if (a.type < b.type) {
      return -1;
    } else {
      return 1;
    }
  });
  //  this finds the index of each type of platform
  for (let i = 0; i < sortedPlats.length; i++) {
    if (i == 0) {
      platformIndexs.push([i, sortedPlats[i].type]);
    } else if (sortedPlats[i].type != sortedPlats[i - 1].type) {
      platformIndexs.push([i, sortedPlats[i].type]);
    }
  }
}
