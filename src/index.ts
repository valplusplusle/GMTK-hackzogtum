import {KeyGame} from './keyGame';
import {playBackgroundMusic, stopBackgroundMusic, playGameOver, selectNormalTrack, selectHcTrack} from './sound';
import {VirusController} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const vc = new VirusController();
const keygame = new KeyGame();

function isHCMode(): boolean {
	const hcModeBox = document.getElementById("hardcore_mode");
	if (hcModeBox instanceof HTMLInputElement) {
		return hcModeBox.checked;
	}
	return false;
}

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
			startGame();

			let splash = document.getElementById("splash");
			if (splash) {
				splash.style.display = "none";
			}
		});
	}
}

function startGame() {

	for(let i=0; i<4; i++){
        document.getElementById(`splashv${i}`)?.classList.remove("shown");
        document.getElementById(`splashv${i}`)?.classList.add("hidden");
	}

	const keygame = new KeyGame();
	keygame.registerEndOfGameCB(()=>{
        //console.log("you fucked up");
		vc.stop();
        stopBackgroundMusic();
		playGameOver();

		//endviruses
		for(let i=0; i<4; i++){
        	document.getElementById(`endv${i}`)?.classList.remove("hidden");
        	document.getElementById(`endv${i}`)?.classList.add("shown");
		}

        document.getElementById("endscreen")?.classList.remove("endscreen--hidden");
		document.getElementById("endscreen")?.classList.add("endscreen--visible");
		let scoreField = document.getElementById("endscoreval");
		if(scoreField){
		 scoreField.innerHTML = vc.getScore();
		}
		//console.log("end");
    }); 
	keygame.registerGettinCriticalCB(()=>{console.log("it's gettin harder")}); 
	
	keygame.startKeyGame();

	if (isHCMode()) {
		selectHcTrack();
		vc.setDifficulty(15);
	} else {
		selectNormalTrack();
		vc.setDifficulty(0);
	}
	
	playBackgroundMusic();
	vc.start();
}

//playBackgroundMusic();

registerCBs();
