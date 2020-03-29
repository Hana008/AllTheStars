import "phaser";

export class GameScene extends Phaser.Scene {
  //declare properties and objects to use further down
  delta: number;
  lastStarTime: number;
  starsCaught: number;
  starsFallen: number;
  sand: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
constructor() {
    super({
      key: "GameScene" //other scenes can use this value to call this scene
    });
  }
init(/*params*/): void { //called when the scene starts, params can be from other scenes or game
  this.delta = 1000;
  this.lastStarTime = 0;
  this.starsCaught = 0;
  this.starsFallen = 0;
  }
preload(): void { //called before the scene objects are created, loading assets(the specific code the website needs to display, colour, formatting etc) are cached(stored) so if game is restarted it assets don't need to reload

//load images:
this.load.setBaseURL("https://raw.githubusercontent.com/mariyadavydova/" +
"starfall-phaser3-typescript/master/");
this.load.image("star", "assets/star.png");
this.load.image("sand", "assets/sand.jpg");
  }
  
  create(): void { //called when assets are loaded, contains main game objects(background, player, enemies, points etc)

    //create static(won't move, phaser 3 has static or dynamic objects)object for sand
    this.sand = this.physics.add.staticGroup({ 
      key: 'sand',
      frameQuantity: 20
    }); //staticGroup will allow you to simultaneously control multiple objects
    Phaser.Actions.PlaceOnLine(this.sand.getChildren(),
      new Phaser.Geom.Line(20, 580, 820, 580));//method defines a lines (sands) geometry, params are co-ordinates
    this.sand.refresh();//updates the bounding box(sand) which was originally default to top left corner, so now collisions will be checked against this new bounding box(the sand)

//the score text
this.info = this.add.text(10, 10, '',
      { font: '24px Arial Bold', fill: '#FBFBAC' });
  }

  //where the stars fall
update(time: number): void { //update() function called every 60ms [time], contains moving or flashing things, returns a new star every second
  var diff: number = time - this.lastStarTime;
  if (diff > this.delta) {
    this.lastStarTime = time;
    if (this.delta > 500) {
      this.delta -= 20;
    }
    this.emitStar();
  }
  this.info.text =
    this.starsCaught + " caught - " +
    this.starsFallen + " fallen (max 5)";
  }
  private onClick(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0x00ff00);
      star.setVelocity(0, 0);
      this.starsCaught += 1;
      this.time.delayedCall(100, function (star) { //delayedCall creates a timer event (100(also first arg)), adds it to  time, after 100ms is passed it calls the function(second arg) passed in , optionally pass in args to call func with [star](third arg) and/or  callbackScope [this](fourth arg)   //same for onFall() below
        star.destroy();
      }, [star], this);
    }
  }
  private onFall(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0xff0000);
      this.starsFallen += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
        if (this.starsFallen > 5) {
          this.scene.start("ScoreScene", 
            { starsCaught: this.starsCaught });
        }
      }, [star], this);
    }
  }
private emitStar(): void {
    var star: Phaser.Physics.Arcade.Image; //create image
    var x = Phaser.Math.Between(25, 775); //vertical position of star
    var y = 26; //horizontal position of star
    star = this.physics.add.image(x, y, "star"); 
star.setDisplaySize(50, 50);
    star.setVelocity(0, 200);
    star.setInteractive();

star.on('pointerdown', this.onClick(star), this);//on.pointerdown = when mouse is fired do this, (invoke onClick method above)
    this.physics.add.collider(star, this.sand, //checks for collisions between star and sand
      this.onFall(star), null, this);//invokes the onFall method above
  }
};

