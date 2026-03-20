class Juego extends Phaser.Scene {

    constructor(){
        super("Juego");
    }

    // ---------------- PRELOAD ----------------
    // Aquí se cargan los archivos que usará esta escena
    preload(){
        this.load.audio("musica", "musica.mp3");
    }

    // ---------------- CREATE ----------------
    create(){

        // ---------------- MUSICA ----------------
        // Se agrega la música del juego
        this.musica = this.sound.add("musica", {
            loop: true,   // hace que se repita
            volume: 0.5   // volumen de la música
        });

        // ---------------- PANTALLA ----------------
        // Guardamos ancho y alto de la pantalla
        this.ancho = this.scale.width;
        this.alto = this.scale.height;

        // ---------------- FONDO ----------------
        // Fondo en movimiento infinito
        this.fondo = this.add.tileSprite(0, 0, this.ancho, this.alto, "fondo")
            .setOrigin(0,0);

        // ---------------- PATO ----------------
        // Creamos al pato con físicas
        this.pato = this.physics.add.sprite(100, this.alto / 2, "pato")
            .setScale(0.8);

        // Gravedad del pato
        this.pato.body.gravity.y = 900;

        // ---------------- HITBOX DEL PATO ----------------
        // Ajustamos la caja de colisión del pato
        this.pato.body.setSize(
            this.pato.displayWidth * 0.6,
            this.pato.displayHeight * 0.6
        );

        // Centramos la hitbox dentro del sprite
        this.pato.body.setOffset(
            this.pato.displayWidth * 0.2,
            this.pato.displayHeight * 0.2
        );

        // ---------------- GRUPO DE TUBOS ----------------
        // Aquí se guardarán todos los tubos
        this.pipes = this.physics.add.group();

        // ---------------- SUELO ----------------
        // Creamos el suelo visual
        this.suelo = this.add.tileSprite(0, this.alto - 80, this.ancho, 80, "suelo")
            .setOrigin(0,0);

        // Le agregamos físicas estáticas al suelo
        this.physics.add.existing(this.suelo, true);

        // ---------------- PUNTOS ----------------
        // Contador inicial
        this.puntos = 0;

        // Texto de puntos
        this.textoPuntos = this.add.text(20, 20, "0", {
            fontSize: "28px",
            fill: "#ffffff",
            fontFamily: '"Press Start 2P"',
            stroke: "#ffffff",
            strokeThickness: 6
        });

        // ---------------- CONTROLES ----------------
        // Al tocar la pantalla: salta y empieza la música
        this.input.on("pointerdown", () => {
            this.iniciarJuego();
        });

        // Al presionar espacio: salta y empieza la música
        this.input.keyboard.on("keydown-SPACE", () => {
            this.iniciarJuego();
        });

        // ---------------- GENERADOR DE TUBOS ----------------
        // Cada cierto tiempo se crean tubos nuevos
        this.time.addEvent({
            delay: 2500,
            callback: this.crearTubos,
            callbackScope: this,
            loop: true
        });

        // ---------------- COLISIONES ----------------
        // Si el pato toca un tubo o el suelo, pierde
        this.physics.add.collider(this.pato, this.pipes, this.gameOver, null, this);
        this.physics.add.collider(this.pato, this.suelo, this.gameOver, null, this);

        // ---------------- DEBUG HITBOX ----------------
        // Descomenta estas líneas si quieres ver las colisiones
        // this.physics.world.createDebugGraphic();
        // this.physics.world.drawDebug = true;
    }

    // ---------------- UPDATE ----------------
    update(){

        // Movimiento del fondo
        this.fondo.tilePositionX += 2;

        // Movimiento del suelo
        this.suelo.tilePositionX += 4;

        // Verificamos si cayó o si sumó puntos
        this.verificarCaida();
        this.verificarPuntos();
    }

    // ---------------- INICIAR JUEGO ----------------
    // Hace saltar al pato y reproduce la música si aún no suena
    iniciarJuego(){
        this.saltar();

        if(!this.musica.isPlaying){
            this.musica.play();
        }
    }

    // ---------------- SALTO ----------------
    // Hace que el pato suba
    saltar(){
        this.pato.setVelocityY(-350);
    }

    // ---------------- VERIFICAR CAIDA ----------------
    // Si el pato sale por abajo de la pantalla, pierde
    verificarCaida(){
        if(this.pato.y > this.alto){
            this.gameOver();
        }
    }

    // ---------------- CONTAR PUNTOS ----------------
    // Cuando el pato pasa los tubos de arriba suma 1 punto
    verificarPuntos(){

        this.pipes.getChildren().forEach(pipe => {

            if(pipe.getData("tipo") == "arriba"){

                if(pipe.x < this.pato.x && !pipe.getData("pasado")){

                    pipe.setData("pasado", true);
                    this.puntos++;
                    this.textoPuntos.setText(this.puntos);
                }
            }
        });
    }

    // ---------------- CREAR TUBOS ----------------
    crearTubos(){

        // Espacio entre tubo de arriba y abajo
        let espacio = 180;

        // Posición aleatoria del hueco entre tubos
        let posicion = Phaser.Math.Between(this.alto * 0.3, this.alto * 0.7);

        // ---------------- TUBO ARRIBA ----------------
        let arriba = this.pipes.create(this.ancho, posicion - espacio, "pipe");

        arriba.setOrigin(0, 1);
        arriba.setScale(0.5); // tamaño del tubo
        arriba.body.allowGravity = false;
        arriba.setVelocityX(-200);

        // Datos para contar puntos
        arriba.setData("tipo", "arriba");
        arriba.setData("pasado", false);

        // Ajuste de colisión del tubo arriba
        arriba.body.setSize(arriba.displayWidth * 0.7, arriba.displayHeight);
        arriba.body.setOffset(arriba.displayWidth * 0.10, 0);

        // ---------------- TUBO ABAJO ----------------
        let abajo = this.pipes.create(this.ancho, posicion, "pipe");

        abajo.setOrigin(0, 0);
        abajo.setScale(0.5); // tamaño del tubo
        abajo.body.allowGravity = false;
        abajo.setVelocityX(-200);

        // Dato para identificar el tubo
        abajo.setData("tipo", "abajo");

        // Ajuste de colisión del tubo abajo
        abajo.body.setSize(abajo.displayWidth * 0.7, abajo.displayHeight);
        abajo.body.setOffset(abajo.displayWidth * 0.10, 0);

        // ---------------- LIMPIAR TUBOS FUERA DE PANTALLA ----------------
        this.pipes.getChildren().forEach(pipe => {
            if(pipe.x < -100){
                pipe.destroy();
            }
        });
    }

    // ---------------- GAME OVER ----------------
    // Detiene la música y cambia a la escena de Game Over
    gameOver(){

        if(this.musica){
            this.musica.stop();
        }

        this.scene.start("GameOver", { puntos: this.puntos });
    }
}
