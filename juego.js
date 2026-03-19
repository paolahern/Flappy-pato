class Juego extends Phaser.Scene {

constructor(){
    super("Juego");
}

create(){

    // ---------------- PANTALLA ----------------
    this.ancho = this.scale.width;
    this.alto = this.scale.height;

    // ---------------- FONDO ---------------- cambiado para que se mueva 
    //indefinitamente 
    this.fondo = this.add.tileSprite(0, 0, this.ancho, this.alto, "fondo")
    .setOrigin(0,0);
    // ---------------- PAJARO ----------------
    this.pato = this.physics.add.sprite(100, this.alto/2, "pato")
    .setScale(0.8); //escala el pajaro por si lo requieres
    this.pato.body.gravity.y = 900;

    // hitbox del pajaro
    //El true lo centra automáticamente.
    this.pato.body.setSize(30,30,true);

    // ---------------- GRUPO DE TUBOS ----------------
    this.pipes = this.physics.add.group();

    this.suelo = this.physics.add.sprite(this.ancho/2, this.alto - 40, "suelo");

    //suelo
    this.suelo = this.add.tileSprite(0, this.alto - 80, this.ancho, 80, "suelo")
.setOrigin(0,0);

this.physics.add.existing(this.suelo, true);

    // ---------------- PUNTOS ----------------
    this.puntos = 0;
    this.textoPuntos = this.add.text(20,20,"0",{
        fontSize:"28px",
        fill:"#ffffff",
        fontFamily: '"Press Start 2P"',
        stroke: "#ffffff",
        strokeThickness: 6
    });

    // ---------------- CONTROLES ----------------
    this.input.on("pointerdown", this.saltar, this);
    this.input.keyboard.on("keydown-SPACE", this.saltar, this);

    // ---------------- GENERADOR DE TUBOS ----------------
    this.time.addEvent({
        delay: 2500, //Temporizador que Aumenta o Disminulle el tiempo en el que se generan los tubos
        callback:this.crearTubos,
        callbackScope:this,
        loop:true
    });

    // ---------------- COLISION ----------------
    this.physics.add.collider(this.pato,this.pipes,this.gameOver,null,this);
    this.physics.add.collider(this.pato, this.suelo, this.gameOver, null, this);

    // ---------------- DEBUG HITBOX ----------------
    //this.debugGraphics = this.add.graphics();
    //this.physics.world.createDebugGraphic();

}

update(){

    //se agrega esta linea donde x mueve la textura del fondo 
    this.fondo.tilePositionX += 2;
    this.verificarCaida();
    this.verificarPuntos();
    //suelo
    this.suelo.tilePositionX += 4;

}

// ---------------- SALTO ----------------
saltar(){
    this.pato.setVelocityY(-350);
}

// ---------------- VERIFICAR CAIDA ----------------
verificarCaida(){

    if(this.pato.y > this.alto){
        this.gameOver();
    }

}


// ---------------- CONTAR PUNTOS ----------------
verificarPuntos(){

    this.pipes.getChildren().forEach(pipe=>{

        if(pipe.getData("tipo") == "arriba"){

            if(pipe.x < this.pato.x && !pipe.getData("pasado")){

                pipe.setData("pasado",true);
                this.puntos++;
                this.textoPuntos.setText(this.puntos);
            }
        }
    });
    //this.debugGraphics.clear();
    //this.physics.world.drawDebug = true;
}

// ---------------- CREAR TUBOS ----------------
crearTubos(){

    let espacio = 200; //Aumenta o disminuye el espacio entre los tubos
    let posicion = Phaser.Math.Between(this.alto * 0.3, this.alto * 0.7);

    // tubo arriba
    let arriba = this.pipes.create(this.ancho, posicion-espacio,"pipe");

    arriba.setOrigin(0,1);
    arriba.body.allowGravity = false;
    arriba.setVelocityX(-200);

    arriba.setData("tipo","arriba");
    arriba.setData("pasado",false);


    // Ajusta el tamaño de la colision tubo arriba
    arriba.body.setSize(arriba.width * 0.7, arriba.height);
    arriba.body.setOffset(arriba.width * 0.10, 0);

    // tubo abajo
    let abajo = this.pipes.create(this.ancho,posicion,"pipe");

    abajo.setOrigin(0,0);
    abajo.body.allowGravity = false;
    abajo.setVelocityX(-200);

    abajo.setData("tipo","abajo");

    
    // Ajusta el tamaño de la colision tubo abajo
    abajo.body.setSize(abajo.width * 0.7, abajo.height);
    abajo.body.setOffset(abajo.width * 0.10, 0);

    this.pipes.getChildren().forEach(pipe=>{
        if(pipe.x < -100){
            pipe.destroy();
        }
    });
}



// ---------------- GAME OVER ----------------
gameOver(){
        this.scene.start("GameOver",{puntos:this.puntos});
    }
}
