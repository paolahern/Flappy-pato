// CONFIGURACIÓN PRINCIPAL DEL JUEGO
const config = {

type: Phaser.AUTO,

width: window.innerWidth,
height: window.innerHeight,

scale:{
mode: Phaser.Scale.FIT,
// Centra el juego automáticamente en la pantalla
autoCenter: Phaser.Scale.CENTER_BOTH
},
scene:[
    Carga,
    Inicio,
    Juego
]
};


const game = new Phaser.Game(config)
