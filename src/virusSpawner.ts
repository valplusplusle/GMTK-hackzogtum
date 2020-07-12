function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// the screen has 15x10 virus pixels (vixels)
const virusSize = 30;
const MOVE_INTERVAL_BASE = 2500;
const MOVE_INTERVAL_MIN  = 500;
const FIELD_MAX_X = 15;
const FIELD_MAX_Y = 10;

enum Directions {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

const allDirections = [Directions.UP, Directions.DOWN, Directions.LEFT, Directions.RIGHT];

type Position = [
    number,
    number
]

export class VirusController {
    private index: Map<number, Position> = new Map();
    private matrix: Array<Array<number>>;
    private points = 0;
    private moveInterval: number | undefined;
    private moveIntervalTime = MOVE_INTERVAL_BASE;

    constructor() {
        this.matrix = this.newMatrix();
    }

    public setDifficulty(level: number) {
        let diff = MOVE_INTERVAL_BASE - (level * 100);
        diff = (diff > MOVE_INTERVAL_MIN) ? diff : MOVE_INTERVAL_MIN;
        this.moveIntervalTime = diff;
    }

	getScore(): string {
        return `${this.points}`;
	}
    newMatrix() {
        let m = new Array(FIELD_MAX_X);
        for (var i = 0; i < m.length; i++) {
            let inner = new Array(FIELD_MAX_Y);
            inner.fill(0);
            m[i] = inner;
        }
        return m;
    }

    public start() {
        this.points = 0;
        this.spawnRandomViruses();
    }

    public stop() {
        this.delAllViruses();
    }

    configMoveTimer(numVirus: number) {
        this.stopMoveTimer();

        if (numVirus > 0) {
            this.moveInterval = window.setInterval(() => this.migrateVirus(), this.moveIntervalTime / numVirus);
        }
    }

    stopMoveTimer() {
        window.clearInterval(this.moveInterval);
        this.moveInterval = undefined;
    }

    spawnRandomViruses() {
        //console.log("Spawning new Viruses.");
        let virusNumber = [];
        while (virusNumber.length == 0) {
            for (let i = 0; i < 7; i++) {
                var random_boolean = Math.random() >= 0.5;
                if (random_boolean) {
                    virusNumber.push(i);
                }
            }
        }

        this.index = new Map();
        virusNumber.forEach(id => {
            let placed = false;
            while (!placed) {
                let x = Math.round(Math.random() * (FIELD_MAX_X-1));
                let y = Math.round(Math.random() * (FIELD_MAX_Y-1));

                if (this.isFree(x, y)) {
                    this.addVirus(id, [x, y]);
                    placed = true;
                }
            }
        });
    }

    hideVirus(id: number) {
        document.getElementById("virus"+id)?.classList.add("hidden");
        document.getElementById("virus"+id)?.classList.remove("shown");  
    }
    showVirus(id: number) {
        document.getElementById("virus"+id)?.classList.remove("hidden");
        document.getElementById("virus"+id)?.classList.add("shown");  
    }

    showExplosion(id:number){
        document.getElementById("virus"+id)?.classList.remove("virus"+id);
        document.getElementById("virus"+id)?.classList.add("explosion0");
        setTimeout(this.hideVirusAndExplosion, 1000, id);
    }
    hideVirusAndExplosion(id: number) {  
        document.getElementById("virus"+id)?.classList.remove("explosion0");
        document.getElementById("virus"+id)?.classList.add("hidden");
        document.getElementById("virus"+id)?.classList.remove("shown");
        document.getElementById("virus"+id)?.classList.add("virus"+id);
    }

    public async clickedVirus(event:any) {
        this.addPoints();
        this.playSoundEffect();
    
        let virusId = Number.parseInt(event.target.id.slice(-1));
        //console.log("Clicked on virus " + virusId);
        let pos = this.index.get(virusId);
        if (pos) {
            //this.delVirus(virusId, pos);
            this.killVirus(virusId, pos);
        }

        if (this.index.size == 0) {
            await sleep(randomIntFromInterval(1000,4000));
            this.spawnRandomViruses();
        }
    }

    addPoints() {
        this.points += 10;
        document.getElementById('screenScore')!.innerHTML = this.points.toString();
    }

    isFree(x: number, y: number) : boolean {
        return this.matrix[x][y] == 0;
    }

    migrateVirus() {
        //console.log("Trying to move Virus.");
        let numVirus = this.index.size;
        if (numVirus > 0) {
            let selectedIndex = randomIntFromInterval(0, numVirus-1);
            let virus = Array.from(this.index.entries())[selectedIndex];
            this.maveRandomDirection(virus[0]);
        }
    }

    addVirus(id: number, pos: Position) {
        const [x, y] = pos;
        this.matrix[x][y] = id;
        this.index.set(id, [x, y]);
        this.showVirus(id);

        let virus = document.getElementById("virus"+id);
        if (virus) {
            virus.style.top  = ((y * virusSize)) + "px";
            virus.style.left = ((x * virusSize)) + "px";
        }

        this.configMoveTimer(this.index.size);
    }
    
    killVirus(id: number, pos: Position) {
        const [x, y] = pos;
        this.index.delete(id);
        this.matrix[x][y] = 0;
        this.configMoveTimer(this.index.size);
        this.showExplosion(id);
    }

    delVirus(id: number, pos: Position) {
        const [x, y] = pos;
        this.index.delete(id);
        this.matrix[x][y] = 0;
        this.hideVirus(id);
        this.configMoveTimer(this.index.size);
    }

    delAllViruses() {
        for (const v of this.index) {
            this.delVirus(v[0], v[1]);
        }
    }

    moveVirus(id: number, oldPos: Position, newPos: Position) {
        this.delVirus(id, oldPos);
        this.addVirus(id, newPos);
    }

    maveRandomDirection(id: number) {
        let target = this.shuffle(allDirections);
        let pos = this.index.get(id);
        if (pos) {
            const [x, y] = pos;
            for (const dir of target) {
                let dx = x;
                let dy = y;
                if (dir == Directions.LEFT)  { dx -= 1; }
                if (dir == Directions.RIGHT) { dx += 1; }
                if (dir == Directions.UP)    { dy -= 1; }
                if (dir == Directions.DOWN)  { dy += 1; }
                if (this.withinBounds(dx, dy) && this.isFree(dx, dy)) {
                    this.moveVirus(id, [x, y], [dx, dy]);
                    return;
                }
            }
        }
    }

    withinBounds(x: number, y: number) {
        return (x >= 0 && x < FIELD_MAX_X) && (y >= 0 && y < FIELD_MAX_Y);
    }

    shuffle<T>(arr: Array<T>): Array<T> {
        let a = new Array(...arr);
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    public playSoundEffect() {
        var x = randomIntFromInterval(0,2);
        if(x == 0) {
            var audio = new Audio('./assets/audio/effects/Shoot1.mp3');
            audio.play();
        } else if(x == 1) {
            var audio = new Audio('./assets/audio/effects/Shoot2.mp3');
            audio.play();
        } else if(x == 2) {
            var audio = new Audio('./assets/audio/effects/Shoot3.mp3');
            audio.play();
        }
    }

}
