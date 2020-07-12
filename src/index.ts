import {KeyGame} from './keyGame';
import {playBackgroundMusic} from './sound';
import {clickedVirus, spawnRandomViruses} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const keygame = new KeyGame();
keygame.registerEndOfGameCB(()=>{
    console.log("you fucked up");
    alert("you fucked up - the system is out of control ;)")
}); 
keygame.registerGettinCriticalCB(()=>{console.log("it's gettin harder")}); 



function registerCBs(){ 
    for(var i=0; i<7; i++){
        let div = document.getElementById(`virus${i}`);
        if(div){
            div.onclick = () => {
                clickedVirus(event);
            };
        }
	}
	
	let startGameBtn = document.getElementById("startGameBtn");
	if (startGameBtn) {
		startGameBtn.onclick = (e => {
			playBackgroundMusic();
            keygame.startKeyGame();
            spawnRandomViruses();
			let splash = document.getElementById("splash");
			if (splash) {
				splash.style.display = "none";
			}
		});
	}
}

window.localStorage.setItem('points', '0'); // init game with 0 Points
registerCBs();


