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
    this.load.image("satan","assets/character/satan.png");
    this.load.image("plateforme","assets/maps/plat.png");
    this.load.image("background","assets/maps/bg.png");
    this.load.image("destruct","assets/maps/destruc.png");
    this.load.image("tileset","assets/tiles/placeholder.png");
    this.load.tilemapTiledJSON("map","assets/maps/map.json");
    this.load.image("trigger","assets/tiles/trigger.png");
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

var audio_0;
var audio_1;
var audio_2;

var destruct;
var power_up;
var atk;

var trigger_satan;
var satan;
var vulnerable;

var satan_collider;
var satan_isMoving;

function create()
{

    this.add.image(960,2160,"background");
    this.add.image(960,2160,"plateforme");
    //player = this.physics.add.sprite (320,4000, "player");
    player = this.physics.add.sprite (230,400, "player");
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
    
    jumpValue = 50;
    vitesse = 0;
    isMoving = false;
    isJumping = false;
    bounce = 3;
    check = 3;
    currentSpeed = 0;
    power_up = false;
    atk = true;

    //tp
    trigger_tp_1 = this.physics.add.sprite(324.5,400,"trigger");
    trigger_tp_1.body.setAllowGravity(false);
    trigger_tp_1.setVisible(false);

    trigger_tp_2 = this.physics.add.sprite(964.5,480,"trigger");
    trigger_tp_2.body.setAllowGravity(false);
    trigger_tp_2.setVisible(false);

    this.physics.add.overlap(player, trigger_tp_1, tp_1, null, this);
    this.physics.add.overlap(player, trigger_tp_2, tp_2, null, this);

    destruct = this.physics.add.sprite(1600,3190,"destruct");
    destruct.body.setAllowGravity(false);
    destruct.setScale(1,0.5).setImmovable(true);
    this.physics.add.collider(player, destruct, destroy, null, this);

    trigger_satan = this.physics.add.sprite(1600,4100,"trigger");
    trigger_satan.body.setAllowGravity(false);
    trigger_satan.setVisible(false);

    this.physics.add.overlap(player, trigger_satan, yo_satan, null, this);

    satan = this.physics.add.sprite(1600,3900,"satan");
    satan.body.setAllowGravity(false);
    satan.setVisible(false);
    satan.setCollideWorldBounds(true);
    this.physics.add.collider(satan, plat);

    satan_isMoving = false;
    
};

function update ()
{
    //controles
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
            player.setAccelerationX(0);
            isMoving = false;
            isJumping = false;
        };
    };  
    if(bounce == 0){
        player.setBounce(0);
        atk = false;
    };

    if (clavier.right.isDown && player.body.blocked.down && !isJumping){
        player.setVelocityX(60);
    }
    else if (clavier.left.isDown && player.body.blocked.down && !isJumping){
        player.setVelocityX(-60);
    }
    else{
        player.setVelocityX(0);
    };


    if(clavier.space.isDown && player.body.blocked.down){
        jumpValue += 0.7;
        player.setVelocityX(0);
    };

    if(Phaser.Input.Keyboard.JustDown(clavier.space) && player.body.blocked.down){
        isJumping = true;
    };

    if(jumpValue >= 120 && player.body.blocked.down){
        isJumping = true;
        jumpValue = 120;
        player.setVelocityY(-6.5*jumpValue); 
        currentSpeed = 150 * jumpValue;
        jumpValue = 50;
    }
    else if(Phaser.Input.Keyboard.JustUp(clavier.space) && player.body.blocked.down){
        isJumping = true;
        player.setVelocityY(-6.5*jumpValue); 
        currentSpeed = 150 * jumpValue;
        jumpValue = 50; 
    };

    if(clavier.right.isDown && !isMoving && isJumping){
        player.setAccelerationX(currentSpeed);
        isMoving = true;
    };
    if(clavier.left.isDown && isMoving == false && isJumping == true){
        player.setAccelerationX(-currentSpeed);
        isMoving = true;
    }; 

    if(player.body.blocked.left && isMoving == true){
        player.setAccelerationX(currentSpeed/2);
        player.setBounce(0.3);
        bounce =5;
        check = 0;
    }
    else if(player.body.blocked.right && isMoving == true){
        player.setAccelerationX(-currentSpeed/2);
        player.setBounce(0.3);
        bounce =5;
        check = 1;
    };

    if(Phaser.Input.Keyboard.JustDown(clavier.down) && power_up == true && !player.body.blocked.down && !atk){
        player.setAccelerationX(0);
        player.setVelocityY(1000);
        atk = true;
        check = -1;
        player.setBounce(0.2);
        bounce =1;
        isMoving = true;
    };

    if(satan.visible == true && satan_isMoving == false){
        satan.setVelocityX(20);
        satan_collider = this.physics.add.collider(player,satan,degat,null,this);
        satan.setImmovable(true);
        satan_isMoving = true;  
    };
    
    if(satan.body.blocked.right && satan_isMoving == true){
        satan.setVelocityX(-20);
    };
    
    if(satan.body.blocked.left && satan_isMoving == true){
        satan.setVelocityX(20);
    };
};
    

function tp_1(){
    console.log("tp");
    //player.setPosition(960,4200);
    player.setPosition(890,400);
    this.cameras.main.setBounds(640,0,640,4320);

};

function tp_2(){
    console.log("tp");
    player.setPosition(1600,3100);
    //player.setPosition(960,400);
    this.cameras.main.setBounds(1280,0,640,4320);
    power_up = true;
};

function destroy(){
    if(atk == true){
        console.log("boom");
        atk = false;
        destruct.destroy();
    }
};

function yo_satan(){
    console.log("satan");
    satan.setVisible(true);
    trigger_satan.destroy();  
};

function degat(){
    console.log("boom");
    if(atk == true){
        console.log("boom");
        atk = false;
        satan.setVisible(false);
        this.physics.world.removeCollider(satan_collider);
    }
};                