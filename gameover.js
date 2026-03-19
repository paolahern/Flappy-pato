class GameOver extends Phaser.Scene{

constructor(){
    super("GameOver");
}

create(data){

let ancho = this.scale.width;
let alto = this.scale.height;

// FONDO
this.add.image(ancho/2, alto/2,"fondo")
.setDisplaySize(ancho,alto);


// TITULO GAME OVER
let titulo = this.add.text(ancho/2, alto*0.30,"Cuak Cuak,\nPerdiste",{
    fontSize:"34px",
    fontFamily:'"Press Start 2P"',
    fill:"#ff4444",
    stroke:"#000000",
    strokeThickness:6,
    align:"center"
}).setOrigin(0.5);


// EFECTO FLOTAR
this.tweens.add({
    targets: titulo,
    y: titulo.y - 15,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease:"Sine.easeInOut"
});


// PUNTOS
this.add.text(ancho/2, alto*0.50,"Puntos: " + data.puntos,{
    fontSize:"20px",
    fontFamily:'"Press Start 2P"',
    fill:"#ffffff",
    stroke:"#000000",
    strokeThickness:5
}).setOrigin(0.5);


// BOTON REVIVIR
let boton = this.add.text(ancho/2, alto*0.65,"INTENTA UNA\nVEZ MAS",{
    fontSize:"16px",
    fontFamily:'"Press Start 2P"',
    fill:"#f7c1fc",
    stroke:"#782bac",
    strokeThickness:4,
    align:"center"
}).setOrigin(0.5);


// PARPADEO
this.tweens.add({
    targets: boton,
    alpha:0,
    duration:700,
    yoyo:true,
    repeat:-1
});


// EFECTO CRECER
this.tweens.add({
    targets: boton,
    scale:1.1,
    duration:700,
    yoyo:true,
    repeat:-1
});


// CLICK PARA REINICIAR
this.input.once("pointerdown",()=>{
    this.scene.start("Juego");
});

}
}