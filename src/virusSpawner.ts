function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}


export class VirusController {
    private virusScreen: Array<boolean> = [];
    private points = 0;

    constructor() {
    }

    public start() {
        this.spawnRandomViruses();
    }
    
    public spawnRandomViruses() {
        this.virusScreen = [];
        for(let i = 0; i < 7; i++) {
            var random_boolean = Math.random() >= 0.5;
            this.virusScreen.push(random_boolean);
        }
        this.drawViruses();
    }

    public drawViruses() {
        this.virusScreen.forEach((virus:boolean, index:number) => {
            if(virus) {
                document.getElementById("virus"+index)?.classList.remove("hidden");
                document.getElementById("virus"+index)?.classList.add("shown");  
            } else {
                document.getElementById("virus"+index)?.classList.remove("shown");
                document.getElementById("virus"+index)?.classList.add("hidden");  
            }
        });
    }

    public async clickedVirus(event:any) {
        this.addPoints();
    
        let virusId = event.target.id.slice(-1);
        this.virusScreen[virusId] = false;
        this.drawViruses();
        if(this.virusScreen.every((element: any) => !element)) {
            await sleep(randomIntFromInterval(1000,4000));
            this.spawnRandomViruses();
            this.drawViruses();
        }
    }
    
    public addPoints() {
        this.points += 10;
        document.getElementById('screenScore')!.innerHTML = this.points.toString();
    }

}
