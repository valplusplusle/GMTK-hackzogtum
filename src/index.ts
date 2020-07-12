import {KeyGame} from './keyGame';
import {playBackgroundMusic, stopBackgroundMusic} from './sound';
import {VirusController} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const vc = new VirusController();
const keygame = new KeyGame();

function registerCBs(){ 
	
    for(var i=0; i<7; i++){
        let div = document.getElementById(`virus${i}`);
        if(div){
            div.onclick = () => {
                vc.clickedVirus(event);
            };
        }
	}
	
	let startGameBtn = document.getElementById("startGameBtn");
	if (startGameBtn) {
		startGameBtn.onclick = (e => {
			playBackgroundMusic();
			startGame();

			let splash = document.getElementById("splash");
			if (splash) {
				splash.style.display = "none";
			}
		});
	}
}

function startGame() {
	const keygame = new KeyGame();
	keygame.registerEndOfGameCB(()=>{
        console.log("you fucked up");
		vc.stop();
        stopBackgroundMusic();
        document.getElementById("endscreen")?.classList.remove("endscreen--hidden");
		document.getElementById("endscreen")?.classList.add("endscreen--visible");
		let scoreField = document.getElementById("endscoreval");
		if(scoreField){
		 scoreField.innerHTML = vc.getScore();
		}
		console.log("end");
    }); 
	keygame.registerGettinCriticalCB(()=>{console.log("it's gettin harder")}); 
	
	keygame.startKeyGame();
	
	vc.start();
}

//playBackgroundMusic();

registerCBs();
