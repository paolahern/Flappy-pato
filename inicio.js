class Inicio extends Phaser.Scene{

constructor(){
super("Inicio");
}

preload(){
    this.load.image("fondo","./fondo.png");
    this.load.image("pato","./pato.png");
    this.load.image("pipe","./pipe.png");
    this.load.image("suelo","./suelo.png");
}


create(){


this.add.image(200,300,"fondo");
let titulo = this.add.text(this.scale.width/2, this.scale.height*0.35,"El chiken\nvolador",{
    fontSize:"28px",
    fontFamily:'"Press Start 2P"',
    fill:"#3fc9ff",
    strokeThickness:6,
    align:"center"
}).setOrigin(0.5);

//efecto de flotar el titulo
this.tweens.add({
    targets: titulo,
    y: titulo.y - 15,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
});


// ACTIVIDAD:

// Agrega un boton para iniciar el juego, al hacer click en el boton te tiene que llevar a la escena juego

let boton = this.add.text(this.scale.width/2, this.scale.height*0.55,"CLICK PARA JUGAR",{
    fontSize:"16px",
    fontFamily:'"Press Start 2P"',
    fill:"#f7c1fc",
    stroke:"#d46262",
    strokeThickness:4,
    align:"center"
}).setOrigin(0.5);

//efecto de parpadeo tipo arcade 
this.tweens.add({
    targets: boton,
    alpha: 0,
    duration: 800,
    yoyo: true,
    repeat: -1
});

//hace un efeto como si reccieran las letras 
this.tweens.add({
    targets: boton,
    scale: 1.1,
    duration: 700,
    yoyo: true,
    repeat: -1
});
this.input.once("pointerdown",()=>{
            this.scene.start("Juego");
        });
    }
}
