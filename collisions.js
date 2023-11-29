function partCollision(x, y, xv, yv, pWidth, pHeight, platform) {
    let lines = [];
    let topL;
    if (xv < 0.00001 || yv < 0.00001) {
      topL = fpl(
        x,
        y,
        x + xv * deltaTime,
        y + yv * deltaTime,
        platform.x,
        platform.y,
        platform.mWidth,
        platform.mHeight,
        0,
        0
      );
      lines.push(topL);
    }
    let topR;
    if (xv > 0.00001 || yv < 0.00001) {
      topR = fpl(
        x + pWidth,
        y,
        x + xv * deltaTime + pWidth,
        y + yv * deltaTime,
        platform.x,
        platform.y,
        platform.mWidth,
        platform.mHeight,
        pWidth,
        0
      );
      lines.push(topR);
    }
    let bottomL;
    if (xv < 0.00001 || yv > 0.00001) {
      bottomL = fpl(
        x,
        y + pHeight,
        x + xv * deltaTime,
        y + yv * deltaTime + pHeight,
        platform.x,
        platform.y,
        platform.mWidth,
        platform.mHeight,
        0,
        pHeight
      );
      lines.push(bottomL);
    }
    let bottomR;
    if (xv > 0.00001 || yv > 0.00001) {
      bottomR = fpl(
        x + pWidth,
        y + pHeight,
        x + xv * deltaTime + pWidth,
        y + yv * deltaTime + pHeight,
        platform.x,
        platform.y,
        platform.mWidth,
        platform.mHeight,
        pWidth,
        pHeight
      );
      lines.push(bottomR);
    }
    //sorts all of the lines of this box
    lines.sort((a, b) => {
      if (a.uA < b.uA) {
        return -1;
      } else {
        return 1;
      }
    });
    if (lines[0] != false) {
      return lines;
    } else return false;
  }
  
  function projCollision(pr, platform) {
    let lines = [];
    let topL;
    topL = fpl(
      pr.x,
      pr.y,
      pr.x + pr.xv * deltaTime,
      pr.y + pr.yv * deltaTime,
      platform.x,
      platform.y,
      platform.mWidth,
      platform.mHeight,
      0,
      0
    );
    lines.push(topL);
    let topR;
    bottomR = fpl(
      pr.x + projW,
      pr.y,
      pr.x + pr.xv * deltaTime + projW,
      pr.y + pr.yv * deltaTime,
      platform.x,
      platform.y,
      platform.mWidth,
      platform.mHeight,
      projW,
      0
    );
    lines.push(topR);
    if (lines[0] != false) {
      return lines;
    }
  }
  
  function rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    // are the sides of one rectangle touching the other?
  
    if (
      r1x + r1w >= r2x && // r1 right edge past r2 left
      r1x <= r2x + r2w && // r1 left edge past r2 right
      r1y + r1h >= r2y && // r1 top edge past r2 bottom
      r1y <= r2y + r2h
    ) {
      // r1 bottom edge past r2 top
      return true;
    }
    return false;
  }
  
  //first point on line.
  function fpl(x1, y1, x2, y2, rx, ry, rw, rh, transformX, transformY) {
    intersects = [];
    lineRectTest = lineRect(x1, y1, x2, y2, rx, ry, rw, rh);
    if (lineRectTest) {
      intersectP = { uA: 3 };
      intersects.forEach((point, index) => {
        if (point.uA < intersectP.uA) {
          intersectP = point;
        }
      });
      intersectP.transformX = transformX;
      intersectP.transformY = transformY;
      return intersectP;
    } else return false;
  }
  
  // LINE/RECTANGLE
  function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    let returning = false;
    if (x2 >= rx) {
      left = lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh, "left");
      if (left) {
        returning = true;
      }
    }
    if (x2 <= rx + rw) {
      right = lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, "right");
      if (right) {
        returning = true;
      }
    }
    if (y2 >= ry) {
      top = lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry, "top");
      if (top) {
        returning = true;
      }
    }
    if (y2 <= ry + rh) {
      bottom = lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, "bottom");
      if (bottom) {
        returning = true;
      }
    }
    // if ANY of the above are true, the line
    // has hit the rectangle
    // if (returning) {
      return true;
    // }
    // return false;
  }
  
  // LINE/LINE
  function lineLine(x1, y1, x2, y2, x3, y3, x4, y4, mside) {
    // calculate the direction of the lines
    uA =
      ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
      ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    uB =
      ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
      ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    //   this would fid the angle precisly if I want to do angled things
    // angle = atan2((y4-y3)/(x4-x3))
    if (mside == "top") {
      angle = PI / 2;
    }
    if (mside == "bottom") {
      angle = (3 * PI) / 2;
    }
    if (mside == "left") {
      angle = PI;
    }
    if (mside == "right") {
      angle = 0;
    }
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA < 1 && uB > 0 && uB < 1) {
      // uA-=0.0001
      intersects.push({
        intersectionX: x1 + uA * (x2 - x1),
        intersectionY: y1 + uA * (y2 - y1),
        uA: uA,
        side: mside,
        angle: angle,
      });
      return true;
    }
    return false;
  }
  function pointRect(px, py, rx, ry, rw, rh) {
    // is the point inside the rectangle's bounds?
    if (
      px >= rx && // right of the left edge AND
      px <= rx + rw && // left of the right edge AND
      py >= ry && // below the top AND
      py <= ry + rh
    ) {
      // above the bottom
      return true;
    }
    return false;
  }
  