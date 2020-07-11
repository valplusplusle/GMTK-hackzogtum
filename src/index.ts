import {foo} from './keyProcessor';
import {playBackgroundMusic} from './sound';
import {clickedVirus as clickedVirusInner, spawnRandomViruses} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function registerCBs(){ 
    for(var i=0; i<7; i++){
        let div = document.getElementById(`virus${i}`);
        if(div){
            div.onclick = () => {
                clickedVirusInner(i);
                console.log("test");
            };
        }
    }
}

playBackgroundMusic();
foo();
spawnRandomViruses();
registerCBs();