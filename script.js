var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640 ,
    scene: {preload: preload, create: create, update: update },
    physics : {
        default : "arcade",
        arcade : {
            debug : true,
            gravity: {y : 1000},
            tileBias : 40,
        },
    },
};
new Phaser.Game(config);

function preload ()
{
    this.load.image("player","assets/character/char.png");
    this.load.image("plateforme","assets/maps/plat.png");
    this.load.image("background","assets/maps/bg.png");
    this.load.image("destruct","assets/maps/destruc.png");
    this.load.image("tileset","assets/tiles/placeholder.png");
    this.load.tilemapTiledJSON("map","assets/maps/map.json");
    this.load.image("trigger","assets/tiles/trigger.png");
    this.load.image("player_charge","assets/character/char_charge.png");
    this.load.image("player_knock","assets/character/char_knock.png");
};

var player;
var jumpValue;
var vitesse;
var isJumping;
var isMoving;
var bounce;
var clavier;
var check;
var currentSpeed;

var trigger_tp_1;
var trigger_tp_2;
var trigger_tp_3;
var fin;

function create()
{

    this.add.image(960,2160,"background");
    this.add.image(960,2160,"plateforme");
    player = this.physics.add.sprite (320,4000, "player");
    //player = this.physics.add.sprite (230,400, "player");
    player.setScale(0.30);
    
    const map = this.add.tilemap("map");
    const tileset = map.addTilesetImage(
        "placeholder",
        "tileset"
    );
    
    const plat = map.createLayer(
        "hitbox",
        tileset
    );

    
    player.setCollideWorldBounds(true);
    plat.setCollisionByProperty({estSolide: true});
    this.physics.add.collider(player, plat);
    
    plat.setVisible(false);

    this.physics.world.setBounds(0,0,1920,4320);
    this.cameras.main.setBounds(0,0,640,4320);
    this.cameras.main.startFollow(player);

    clavier = this.input.keyboard.createCursorKeys();
    
    //tp
    trigger_tp_1 = this.physics.add.sprite(324.5,400,"trigger");
    trigger_tp_1.body.setAllowGravity(false);
    trigger_tp_1.setVisible(false);

    trigger_tp_2 = this.physics.add.sprite(964.5,480,"trigger");
    trigger_tp_2.body.setAllowGravity(false);
    trigger_tp_2.setVisible(false);

    trigger_tp_3 = this.physics.add.sprite(1560,1650,"trigger");
    trigger_tp_3.body.setAllowGravity(false);
    trigger_tp_3.setVisible(false);

    this.physics.add.overlap(player, trigger_tp_1, tp_1, null, this);
    this.physics.add.overlap(player, trigger_tp_2, tp_2, null, this);
    this.physics.add.overlap(player, trigger_tp_3, tp_3, null, this);

    jumpValue = 50;
    vitesse = 0;
    isMoving = false;
    isJumping = false;
    bounce = 3;
    check = 3;
    currentSpeed = 0;
    fin = false;
};

function update ()
{
    if(fin == false){
        if(player.body.blocked.down){
            if(bounce > 0){
                bounce-= 1;
                if(check == 0){
                    player.setAccelerationX(currentSpeed/4);
                }
                
                if(check == 1){
                    player.setAccelerationX(-currentSpeed/4);
                };   
                
                if (check == -1){
                    player.setAccelerationX(0);
                };
            }
            else{
                player.setTexture("player");                    
                player.setAccelerationX(0);
                isMoving = false;
                isJumping = false;
            };
        };  
        if(bounce == 0){
            player.setBounce(0);
        };
    
        if (clavier.right.isDown && player.body.blocked.down && !isJumping){
            player.setFlip(0);
            player.setVelocityX(60);
        }
        else if (clavier.left.isDown && player.body.blocked.down && !isJumping){
            player.setFlip(1);
            player.setVelocityX(-60);
        }
        else{
            player.setVelocityX(0);
        };
    
    
        if(clavier.space.isDown && player.body.blocked.down){   
            player.setTexture("player_charge");
            player.setScale(0.3);       
            jumpValue += 0.7;
            player.setVelocityX(0);
        };
    
        if(Phaser.Input.Keyboard.JustDown(clavier.space) && player.body.blocked.down){
            isJumping = true;
        };
    
        if(jumpValue >= 120 && player.body.blocked.down){
            player.setTexture("player");
            isJumping = true;
            jumpValue = 120;
            player.setVelocityY(-6.5*jumpValue); 
            currentSpeed = 150 * jumpValue;
            jumpValue = 50;
        }
        else if(Phaser.Input.Keyboard.JustUp(clavier.space) && player.body.blocked.down){
            player.setTexture("player");
            isJumping = true;
            player.setVelocityY(-6.5*jumpValue); 
            currentSpeed = 150 * jumpValue;
            jumpValue = 50; 
        };
    
        if(clavier.right.isDown && !isMoving && isJumping){
            player.setFlip(0);
            player.setAccelerationX(currentSpeed);
            isMoving = true;
        };
        if(clavier.left.isDown && isMoving == false && isJumping == true){
            player.setFlip(1);
            player.setAccelerationX(-currentSpeed);
            isMoving = true;
        }; 
    
        if(player.body.blocked.left && isMoving == true){
            player.setTexture("player_knock");
            player.setAccelerationX(currentSpeed/2);
            player.setBounce(0.3);
            bounce =5;
            check = 0;
        }
        else if(player.body.blocked.right && isMoving == true){
            player.setTexture("player_knock");
            player.setAccelerationX(-currentSpeed/2);
            player.setBounce(0.3);
            bounce =5;
            check = 1;
        };
    } //controles
};
    

function tp_1(){
    console.log("tp");
    player.setPosition(960,4200);
    //player.setPosition(890,400);
    player.setAccelerationX(0);
    player.setVelocityX(0);
    this.cameras.main.setBounds(640,0,640,4320);
};

function tp_2(){
    console.log("tp");
    player.setPosition(1600,4100);
    //player.setPosition(1490,1611);
    player.setAccelerationX(0);
    player.setVelocityX(0);
    this.cameras.main.setBounds(1280,0,640,4320);
};   

function tp_3(){
    console.log("tp");
    player.setAccelerationX(0);
    player.setVelocityX(0);
    player.setPosition(1568.5,208.5);
    fin = true;
};  