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

export function clickedVirus(virusId:number) {
    let virusScreen = JSON.parse(window.localStorage.getItem('virusList')!);
    virusScreen[virusId] = false;
    window.localStorage.setItem('virusList',  JSON.stringify(virusScreen));
    drawViruses();
}
