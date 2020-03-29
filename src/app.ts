import 'phaser';
import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";

const config: GameConfig = { // taken off phaser , also has its own properties used as ts settings for config
  
  title: "All the stars",
  width: 800,
  height: 600,
  parent: "game",
  scene: [WelcomeScene, GameScene, ScoreScene], //added the created scene, runs the first scene first, within that scene it must call the next scene but you still declare all of them here too
  physics: { //makes the stars fall
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};
export class AllTheStarsGame extends Phaser.Game { //new instance of game class extension off of phaser
  constructor(config: GameConfig) {
    super(config); //super accesses and calls functions on an objects parent
  }
}//AllTheStarsGame now equals an instance of game extended to have GameConfig with the values of config for configuration
window.onload = () => {
  var game = new AllTheStarsGame(config);
};