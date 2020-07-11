import * as rxjs from 'rxjs';
import { KeyChallengeGenerator, KeyChallengeSet, KeyChallenge, KeyAction } from './keyChallengeGenerator';
import { TIME_WINDOW, DIFFICULTY_INCREASE, PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE } from './config';
import { timer, Subject } from 'rxjs';


export class KeyProcessor {

	private keyMem = new Set<number>();
	private subjectMap: Map<string, Subject<string>> = new Map();
	
	constructor() {
		document.body.addEventListener("keydown", (e) => this.dispatcherFun(e));
		document.body.addEventListener("keyup", (e) => this.dispatcherFun(e));
	}

	public registerNewSubjects(subjectMap: Map<string, Subject<string>>) {
		this.subjectMap = subjectMap;
		console.log(`subs after reg: ${this.subjectMap.keys.length}`);
	}

	private dispatcherFun(e: KeyboardEvent) {

		if (e.type == 'keydown' && ! this.keyMem.has(e.keyCode)) {
			this.keyMem.add(e.keyCode);
		    //wel will need this for holding

		} else if (e.type == 'keyup') {
			this.keyMem.delete(e.keyCode);

			//SPAM challenges are only interessted in keyup 
			let stringkey : string = String.fromCharCode(e.keyCode);
			let sub = this.subjectMap.get(stringkey);

			if(sub){
				console.log(`sub is there`);
			}else{
				console.log(`sub undefined ${sub}`);
			}

			sub?.next();

//			this.subjectMap.get(stringkey)?.next();

		}

	}

}

export function startKeyGame() {

	const gameTimer = timer(TIME_WINDOW, TIME_WINDOW);

	let difficulty = 5; 
	let curKeyGame = new KeyGame(difficulty);
    let subscription = gameTimer.subscribe(
		(window) => {
			//calculate outcom and death
			if(!curKeyGame.solved()){
				console.log("end");
				subscription.unsubscribe();	
			}

			difficulty = difficulty + DIFFICULTY_INCREASE;
			//get and register next challenges
			curKeyGame = new KeyGame(Math.floor(difficulty));
			console.log("new game started");

		}
	);
	
}

const keyprocessor = new KeyProcessor();
const keyChallengeGenerator = new KeyChallengeGenerator();

export class KeyGame{

	private challengeSubjects : Map<string, Subject<string>>; 
	private challengesToSolve : KeyChallengeSet;
	private targetNumber: number;
	private solvedNumber: number; 
	
	constructor(difficulty: number){
		this.solvedNumber = 0;
		this.challengeSubjects = new Map<string, Subject<string>>();
		
		this.challengesToSolve = keyChallengeGenerator.getChallenge(difficulty);
		//difficulty is adjusted so get the actual length
		this.targetNumber = this.challengesToSolve.keys.length;

		console.log(`challenges  to solve: ${this.challengesToSolve.keys.length}`);

		this.challengesToSolve.keys.forEach((keyChall: KeyChallenge)=>{
			let subject = new Subject<string>();
			this.challengeSubjects.set(keyChall.key, subject);

			console.log(`keychallkey : ${keyChall.key} `);
			console.log(`challenge subjectslen directly in loop: ${this.challengeSubjects.keys.length}`);
			console.log(`challenge subjectslen directly in loop: ${this.challengeSubjects.entries.length}`);

			subject.subscribe((s) => {
				if(keyChall.action == KeyAction.SPAM){
					keyChall.current += 1;
					if(keyChall.current == keyChall.target){
						console.log(`keyevent ${keyChall.key} saw keyup`);
						this.solvedNumber++;
					}
				}
			})
		})
		console.log(`challenge subjects: ${this.challengeSubjects.keys.length}`);
		keyprocessor.registerNewSubjects(this.challengeSubjects);
	}

	solved(): boolean{
		return true;
		return PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE < (this.solvedNumber / this.targetNumber);
	}

}




