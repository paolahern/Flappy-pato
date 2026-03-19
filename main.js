const config = {
    type: Phaser.AUTO,

    width:360,
    height:640,

    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:0},
            debug:false
        }
    },
    scene:[Inicio,Juego,GameOver]
};

const game = new Phaser.Game(config);

if (screen.orientation) { 
    screen.orientation.lock("portrait").catch(function(error){
        console.log("No se pudo bloquear orientación");
    });
}