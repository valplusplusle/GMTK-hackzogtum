import {KeyGame} from './keyGame';
import {playBackgroundMusic} from './sound';
import {VirusController} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';


let vc = new VirusController();


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
			let splash = document.getElementById("splash");
			if (splash) {
				splash.style.display = "none";
			}
			startGame();
		});
	}
}

function startGame() {
	const keygame = new KeyGame();
	keygame.registerEndOfGameCB(()=>{console.log("you fucked up")}); 
	keygame.registerGettinCriticalCB(()=>{console.log("it's gettin harder")}); 
	
	keygame.startKeyGame();
	
	vc.start();
}

//playBackgroundMusic();

registerCBs();
