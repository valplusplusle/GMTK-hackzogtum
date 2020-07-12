function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// the screen has 15x10 virus pixels (vixels)
const virusSize = 30;


export class VirusController {
    private index: Map<number, [number, number]> = new Map();
    private matrix: Array<Array<number>>;
    private points = 0;

    constructor() {
        this.matrix = this.newMatrix();
    }

    newMatrix() {
        let m = new Array(15);
        for (var i = 0; i < m.length; i++) {
            let inner = new Array(10);
            inner.fill(0);
            m[i] = inner;
        }
        return m;
    }

    public start() {
        this.spawnRandomViruses();
    }

    public spawnRandomViruses() {
        console.log("Spawning new Viruses.");
        let virusNumber = [];
        for (let i = 0; i < 7; i++) {
            var random_boolean = Math.random() >= 0.5;
            if (random_boolean) {
                virusNumber.push(i);
            }
        }

        this.index = new Map();
        virusNumber.forEach(id => {
            let placed = false;
            while (!placed) {
                let x = Math.round(Math.random() * 14);
                let y = Math.round(Math.random() * 9);
                console.log(x + " " + y);
                if (this.isFree(x, y)) {
                    console.log("free");
                    this.matrix[x][y] = id;
                    this.index.set(id, [x, y]);
                    this.moveVirus(id, x, y);
                    placed = true;
                }
            }
        });

        console.log("Showing Viruses.");
        this.showAll();
    }

    hideVirus(id: number) {
        document.getElementById("virus"+id)?.classList.add("hidden");
        document.getElementById("virus"+id)?.classList.remove("shown");  
    }
    showVirus(id: number) {
        document.getElementById("virus"+id)?.classList.remove("hidden");
        document.getElementById("virus"+id)?.classList.add("shown");  
    }
    hideAll() {
        for (let i=0; i < 7; i++) {
            this.hideVirus(i);
        }
    }
    showAll() {
        this.index.forEach(([x, y], id:number) => this.showVirus(id));
    }

    public async clickedVirus(event:any) {
        this.addPoints();
    
        let virusId = Number.parseInt(event.target.id.slice(-1));
        console.log("Clicked on virus " + virusId);
        this.hideVirus(virusId);
        let pos = this.index.get(virusId);
        this.index.delete(virusId);
        // remove from matrix
        if (pos) {
            this.matrix[pos[0]][pos[1]] = 0;
        }

        if (this.index.size == 0) {
            await sleep(randomIntFromInterval(1000,4000));
            this.spawnRandomViruses();
        }
    }

    public addPoints() {
        this.points += 10;
        document.getElementById('screenScore')!.innerHTML = this.points.toString();
    }

    isFree(x: number, y: number) : boolean {
        return this.matrix[x][y] == 0;
    }

    moveVirus(id: number, x: number, y: number) {
        let virus = document.getElementById("virus"+id);
        if (virus) {
            virus.style.top  = ((y * virusSize)) + "px";
            virus.style.left = ((x * virusSize)) + "px";
        }
    }

}
