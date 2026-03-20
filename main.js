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


// ---------------- INICIO DEL JUEGO ----------------
window.onload = async function(){

    //Espera a que cargue la fuente antes de iniciar Phaser
    await document.fonts.load('16px "Press Start 2P"');

    // crea el juego
    const game = new Phaser.Game(config);

    // ---------------- BLOQUEAR ORIENTACIÓN ----------------
    if (screen.orientation) { 
        screen.orientation.lock("portrait").catch(function(error){
            console.log("No se pudo bloquear orientación");
        });
    }
};
