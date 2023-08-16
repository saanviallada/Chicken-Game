var PLAY = 1;
var END = 0;
var gameState = PLAY;

var BackgroundImage
var GroundImage, ground, noGround
var chicken, chicken_running, chicken_collided;
var ObstacleImage, obstacle
var score = 0

var gameOver, restart;
var gameOverImg, restartImg

function preload(){
  BackgroundImage = loadImage("background.png")
  GroundImage = loadImage("ground.png")
  chicken_running = loadImage("chicken_2.png")
  chicken_collided = loadImage("chicken_3.png")
  GroundImage = loadImage("ground.png")
  ObstacleImage = loadImage("obstacle.png")
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  chicken = createSprite(50,height-70,20,50);
  chicken.addImage("running", chicken_running);
  chicken.addImage("collided", chicken_collided);
  chicken.setCollider('circle',0,0,150)
  chicken.scale = 0.5

  noGround = createSprite(width/2,height-10,width,125);  
  noGround.shapeColor = "#f4cbaa";

  obstacle = new Group()

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",GroundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  score = 0;
}

function draw(){
  background(BackgroundImage) 
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",GroundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && chicken.y  >= height-200) {
      chicken.velocityY = -15;
       touches = [];
    }

    chicken.velocityY = chicken.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    chicken.collide(noGround);
    spawnObstacles();
    
    if(obstacle.isTouching(chicken)){
      gameState = END;
  }
}
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  
  ground.velocityX = 0;
  chicken.velocityY = 0;
  obstacle.velocityX = 0;

 chicken.changeImage("collided",chicken_collided);

 obstacle.setLifetime = -1;

 if(touches.length>0 || keyDown("UP_ARROW")) {      
  reset();
  touches = []
}
}

drawSprites()
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var egg = createSprite(600,height-95,20,30);
    egg.setCollider('circle',0,0,45)  
    egg.velocityX = -(6 + 3*score/100);

    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: egg.addImage(ObstacleImage);
              break;
      case 2: egg.addImage(ObstacleImage);
              break;
      default: break;
    }
    
    egg.scale = 0.3;
    egg.lifetime = 300;
    egg.depth = chicken.depth;
    chicken.depth +=1;
    obstacle.add(egg);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstacle.destroyEach();
  
  chicken.changeImage("running",chicken_running);
  
  score = 0;
  
}


