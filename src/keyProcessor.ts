import * as rxjs from 'rxjs';
import { KeyChallengeGenerator } from './keyChallengeGenerator';

export function foo() {
	rxjs.of(1, 2, 3).subscribe((v)=>console.log(v));

	let kcg = new KeyChallengeGenerator();
	kcg.getChallenge(12).keys.forEach((e) => {
		console.log(e.key);
		console.log(e.action);
		console.log(e.target);
	})
	
}
