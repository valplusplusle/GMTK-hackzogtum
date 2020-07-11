function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function spawnRandomViruses() {
    let virusScreen = []
    for(let i = 0; i < 7; i++) {
        var random_boolean = Math.random() >= 0.5;
        virusScreen.push(random_boolean);
    }
    window.localStorage.setItem('virusList',  JSON.stringify(virusScreen));
    drawViruses();
}

export function drawViruses() {
    let virusScreen = JSON.parse(window.localStorage.getItem('virusList')!);
    virusScreen.forEach((virus:string, index:number) => {
        if(virus) {
            document.getElementById("virus"+index)?.classList.remove("hidden");
            document.getElementById("virus"+index)?.classList.add("shown");  
        } else {
            document.getElementById("virus"+index)?.classList.remove("shown");
            document.getElementById("virus"+index)?.classList.add("hidden");  
        }
    });
}

export async function clickedVirus(event:any) {
    addPoints();


    let virusId = event.target.id.slice(-1);
    let virusScreen = JSON.parse(window.localStorage.getItem('virusList')!);
    virusScreen[virusId] = false;
    window.localStorage.setItem('virusList',  JSON.stringify(virusScreen));
    drawViruses();
    if(virusScreen.every((element: any) => !element)) {
        await sleep(randomIntFromInterval(1000,4000));
        spawnRandomViruses();
        drawViruses();
    }
}

export function addPoints() {
    let points = window.localStorage.getItem('points')!;
    let pointsAsNumber = Number(points);
    pointsAsNumber = pointsAsNumber + 10;
    window.localStorage.setItem('points', pointsAsNumber.toString());
    document.getElementById('screenScore')!.innerHTML = pointsAsNumber.toString();
}