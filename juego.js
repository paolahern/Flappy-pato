class Juego extends Phaser.Scene {

constructor(){
    super("Juego");
}

preload(){
    // Se carga la música del juego
    this.load.audio("musica", "musica.mp3");
}

create(){

    // ---------------- MUSICA ----------------
    // Se agrega la música
    this.musica = this.sound.add("musica", {
        loop: true,
        volume: 0.5
    });

    // ---------------- PANTALLA ----------------
    this.ancho = this.scale.width;
    this.alto = this.scale.height;

    // ---------------- FONDO ----------------
    this.fondo = this.add.tileSprite(0, 0, this.ancho, this.alto, "fondo")
    .setOrigin(0,0);

    // ---------------- PAJARO ----------------
    this.pato = this.physics.add.sprite(100, this.alto/2, "pato")
    .setScale(0.8);

    this.pato.body.gravity.y = 900;

    // Se ajusta la colisión del pato
    // Como tu imagen es 64x64, se pone una hitbox más centrada
    this.pato.body.setSize(40,40);
    this.pato.body.setOffset(12,12);

    // ---------------- GRUPO DE TUBOS ----------------
    this.pipes = this.physics.add.group();

    // ---------------- SUELO ----------------
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
    // Al tocar o presionar espacio el pato salta
    // y la música empieza solo una vez
    this.input.on("pointerdown", () => {
        this.saltar();

        if(!this.musica.isPlaying){
            this.musica.play();
        }
    });

    this.input.keyboard.on("keydown-SPACE", () => {
        this.saltar();

        if(!this.musica.isPlaying){
            this.musica.play();
        }
    });

    // ---------------- GENERADOR DE TUBOS ----------------
    this.time.addEvent({
        delay: 2500,
        callback:this.crearTubos,
        callbackScope:this,
        loop:true
    });

    // ---------------- COLISION ----------------
    this.physics.add.collider(this.pato,this.pipes,this.gameOver,null,this);
    this.physics.add.collider(this.pato, this.suelo, this.gameOver, null, this);

    // ---------------- DEBUG HITBOX ----------------
    // Descomenta esto si quieres ver las colisiones
    // this.physics.world.createDebugGraphic();
    // this.physics.world.drawDebug = true;
}

update(){

    // Mueve el fondo
    this.fondo.tilePositionX += 2;

    // Verifica caída y puntos
    this.verificarCaida();
    this.verificarPuntos();

    // Mueve el suelo
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
}

// ---------------- CREAR TUBOS ----------------
crearTubos(){

    let espacio = 180;

    // Se ajusta para que no quede tanto espacio vacío abajo
    let posicion = Phaser.Math.Between(this.alto * 0.20, this.alto * 0.45);

    // ---------------- TUBO ARRIBA ----------------
    let arriba = this.pipes.create(this.ancho, posicion-espacio,"pipe");

    arriba.setOrigin(0,1);
    arriba.setScale(0.5);
    arriba.body.allowGravity = false;
    arriba.setVelocityX(-200);

    arriba.setData("tipo","arriba");
    arriba.setData("pasado",false);

    // Se ajusta la colisión del tubo arriba
    arriba.body.setSize(arriba.width * 0.7, arriba.height);
    arriba.body.setOffset(arriba.width * 0.15, 0);

    // ---------------- TUBO ABAJO ----------------
    let abajo = this.pipes.create(this.ancho,posicion,"pipe");

    abajo.setOrigin(0,0);
    abajo.setScale(0.5);
    abajo.body.allowGravity = false;
    abajo.setVelocityX(-200);

    abajo.setData("tipo","abajo");

    // Se ajusta la colisión del tubo abajo
    abajo.body.setSize(abajo.width * 0.7, abajo.height);
    abajo.body.setOffset(abajo.width * 0.15, 0);

    // Destruye tubos que ya salieron de la pantalla
    this.pipes.getChildren().forEach(pipe=>{
        if(pipe.x < -100){
            pipe.destroy();
        }
    });
}

// ---------------- GAME OVER ----------------
gameOver(){

    // Se detiene la música cuando pierdes
    if(this.musica){
        this.musica.stop();
    }

    this.scene.start("GameOver",{puntos:this.puntos});
}
}
