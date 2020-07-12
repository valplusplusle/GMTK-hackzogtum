import {KeyGame} from './keyGame';
import {playBackgroundMusic} from './sound';
import {clickedVirus, spawnRandomViruses} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function registerCBs(){ 
    for(var i=0; i<7; i++){
        let div = document.getElementById(`virus${i}`);
        if(div){
            div.onclick = () => {
                clickedVirus(event);
            };
        }
    }
}

window.localStorage.setItem('points', '0'); // init game with 0 Points
registerCBs();
playBackgroundMusic();

const keygame = new KeyGame();
keygame.registerEndOfGameCB(()=>{console.log("you fucked up"); alert("you fucked up")}); 
keygame.registerGettinCriticalCB(()=>{console.log("it's gettin harder")}); 
keygame.startKeyGame();

spawnRandomViruses();