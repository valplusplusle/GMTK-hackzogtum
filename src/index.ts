import {foo} from './keyProcessor';
import {playBackgroundMusic} from './sound';
import {spawnRandomViruses} from './virusSpawner';

import '../assets/style/style.css';
import '../assets/style/key.css';
import '../assets/style/virus.css';
import 'bootstrap/dist/css/bootstrap.min.css';


playBackgroundMusic();
foo();
spawnRandomViruses();