upslope = Array.from(new Array(255), (x,i) => i);
everything = Array.from(new Array(255), (x,i) => 255);
nothing = Array.from(new Array(255), (x,i) => 0);
downslope = Array.from(new Array(255), (x,i) => 255 - i);
color_trails = [nothing.concat(upslope), nothing.concat(nothing), everything.concat(downslope)];

const R=0;
const G=1;
const B=2;

frames = [0, 100, 200];
targets = [0, 100, 200];
homePositions = [0, 100, 200];

eventTotal = 0;
shyRobotTimeoutID = 0;

/*const TOP = 0;
const MIDDLE = 1;
const BOTTOM = 2;*/

const SENSOR_ONE_X = 350;
const SENSOR_ONE_Y = 500;
const SENSOR_TWO_X = 450;
const SENSOR_TWO_Y = 550;
const SENSOR_THREE_X = 550;
const SENSOR_THREE_Y = 550;
const SENSOR_FOUR_X = 650;
const SENSOR_FOUR_Y = 500;

function drawTower() {
    fill('blue');
    var TOP_CUBE = rect(450, 150, 100, 100);
    var MIDDLE_CUBE = rect(450, 260, 100, 100);
    var BOTTOM_CUBE = rect(450, 370, 100, 100);
}

function drawSensors() {
    fill('white');
    ellipse(SENSOR_ONE_X, SENSOR_ONE_Y, 20, 20);
    ellipse(SENSOR_TWO_X, SENSOR_TWO_Y, 20, 20);
    ellipse(SENSOR_THREE_X, SENSOR_THREE_Y, 20, 20);
    ellipse(SENSOR_FOUR_X, SENSOR_FOUR_Y, 20, 20);
}

function drawTrail() {
    fill('BLACK');
    rect(0, 600, 1000, 200);

    stroke('WHITE');
    line(50 + frames[0], 600, 50 + frames[0], 650);
    line(50 + frames[1], 600, 50 + frames[1], 650);
    line(50 + frames[2], 600, 50 + frames[2], 650);

    stroke('RED');
    color_trails[R].forEach(function (item, index, array) {
        point(50 + index, 650 - item/10);
    });

    stroke('GREEN');
    color_trails[G].forEach(function (item, index, array) {
        point(50 + index, 650 - item/10);
    });

    stroke('BLUE');
    color_trails[B].forEach(function (item, index, array) {
        point(50 + index, 650 - item/10);
    });

    for (var step in color_trails[R]) {
        stroke(color(color_trails[R][step], color_trails[G][step], color_trails[B][step]));
        point(50 + int(step), 600);
    }
}

function approachTargets(t, f) {
    f.forEach(function (item, index, array) {
        f[index] = item + (t[index] - item)/10; 
    });
    return f;
}

function decayTargets(t, h) {
    t.forEach(function (item, index, array) {
        if (item > h[index]) {
            t[index] = item - 2;
        };
    });
    return t;
}

function cubesStillChanging() {
    if (targets[0] - homePositions[0] > 1) {
        return true;
    } else {
        return false;
    }
}

function drawTargetApproach() {
    stroke('WHITE');
    for(var i=100; i>0; i--) {
        var t = [[i], [i], [i]];
        var f = [[0], [0], [0]];
        f = approachTargets(t, f);
        point(i, 100-f[0]);
    }
}

function mouseClicked() {
    var motion = false;

    if(dist(mouseX, mouseY, SENSOR_ONE_X, SENSOR_ONE_Y) < 10){
        console.log('sensor 1 triggered');
        motion = true;
    }
    if(dist(mouseX, mouseY, SENSOR_TWO_X, SENSOR_TWO_Y) < 10){
        console.log('sensor 2 triggered');
        motion = true;
    }
    if(dist(mouseX, mouseY, SENSOR_THREE_X, SENSOR_THREE_Y) < 10){
        console.log('sensor 3 triggered');
        motion = true;
    }
    if(dist(mouseX, mouseY, SENSOR_FOUR_X, SENSOR_FOUR_Y) < 10){
        console.log('sensor 4 triggered');
        motion = true;
    }
    if(motion) {
        targets.forEach(function (item, index, array) {
            targets[index] = item + 150;
        });
        eventTotal = eventTotal + 1;
    }
}

function translateToMorse(digit) {
    switch(digit) {
        case 0: return '00000';
        case 1: return '10000';
        case 2: return '11000';
        case 3: return '11100';
        case 4: return '11110';
        case 5: return '11111';
        case 6: return '01111';
        case 7: return '00111';
        case 8: return '00011';
        case 9: return '00001';
    }
}

function constructMorseString() {
    var morse = '';
    morse = morse.concat(translateToMorse(eventTotal % 10));
    if(eventTotal > 10) {
        morse = 'L'.concat(morse);
        morse = translateToMorse(int(eventTotal/10)).concat(morse);
    }
    morse = morse.concat('W');
    return morse;
}

function drawShyRobotData() {
    fill('white');
    textSize(20);
    text(eventTotal, 10, 750);
    text(constructMorseString(), 10, 775);
}

function shyRobot() {
    console.log("Shy robot emerging.");
    var morse = constructMorseString();
    if ( typeof shyRobot.MorseIndex == 'undefined' ) {
        shyRobot.MorseIndex = 0;
    }
    if(morse[shyRobot.MorseIndex] == '1') {
        dit();
    } else {
        dah();
    }
    shyRobot.MorseIndex++;
    if(shyRobot.MorseIndex == morse.length) {
        shyRobot.MorseIndex = 0;
    }
}

function dit() {
    console.log('dit');
    if ( typeof dit.nextColor == 'undefined' ) {
        dit.nextColor = color('blue');
    }
    setIntervalX(function () {
        drawTopCube(dit.nextColor);
        dit.nextColor = lerpColor(dit.nextColor, color('white'), 0.5);
    }, 100, 5);
    setTimeout(function () {
        setIntervalX(function () {
            drawTopCube(dit.nextColor);
            dit.nextColor = lerpColor(dit.nextColor, color('blue'), 0.5);
        }, 100, 5);
    }, 700);
    shyRobotTimeoutID = setTimeout(shyRobot, 2200); // call shyRobot again after dit ends: 700 + 500 + 1000 = 2200 
}

function dah() {
    console.log('dah');
    if ( typeof dah.nextColor == 'undefined' ) {
        dah.nextColor = color('blue');
    }
    setIntervalX(function () {
        drawTopCube(dah.nextColor);
        dah.nextColor = lerpColor(dah.nextColor, color('white'), 0.5);
    }, 100, 5);
    setTimeout(function () {
        setIntervalX(function () {
            drawTopCube(dah.nextColor);
            dah.nextColor = lerpColor(dah.nextColor, color('blue'), 0.5);
        }, 100, 5);
    }, 2000);
    shyRobotTimeoutID = setTimeout(shyRobot, 3000); // call shyRobot again after dah ends: 2000 + 500 + 1000 = 3500
}

function drawTopCube(color) {
    noStroke();
    fill(color);
    rect(400, 100, 200, 160);
}

function drawMiddleCube(color) {
    noStroke();
    fill(color);
    rect(400, 260, 200, 160);
}

function drawBottomCube(color) {
    noStroke();
    fill(color);
    rect(400, 420, 200, 160);
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function () {
       callback();
       if (++x === repetitions) {
           clearInterval(intervalID);
       }
    }, delay);
}

function setup() {
    createCanvas(1000, 800);
    background(0);
    frameRate(10);
    noStroke(); 
    drawSensors();
    drawTower();
    drawTopCube(color(color_trails[R][int(frames[0])], color_trails[G][int(frames[0])], color_trails[B][int(frames[0])]));
    drawMiddleCube(color(color_trails[R][int(frames[1])], color_trails[G][int(frames[1])], color_trails[B][int(frames[1])]));
    drawBottomCube(color(color_trails[R][int(frames[2])], color_trails[G][int(frames[2])], color_trails[B][int(frames[2])]));
    shyRobotTimeoutID = setTimeout(shyRobot, 5000);
}

function draw() {
    drawTrail();
    targets = decayTargets(targets, homePositions);
    frames = approachTargets(targets, frames);
    drawTargetApproach();
    if(cubesStillChanging()) {
        clearTimeout(shyRobotTimeoutID); // shy robot hides when cubes are changing
        shyRobotTimeoutID = setTimeout(shyRobot, 5000); // motion stopped, so prepare shy robot
        console.log("Delay shy robot");
        drawTopCube(color(color_trails[R][int(frames[0])], color_trails[G][int(frames[0])], color_trails[B][int(frames[0])]));
        drawMiddleCube(color(color_trails[R][int(frames[1])], color_trails[G][int(frames[1])], color_trails[B][int(frames[1])]));
        drawBottomCube(color(color_trails[R][int(frames[2])], color_trails[G][int(frames[2])], color_trails[B][int(frames[2])]));           
    }
    drawShyRobotData();
}