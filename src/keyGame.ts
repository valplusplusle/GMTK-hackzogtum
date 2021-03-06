import { KeyChallengeGenerator, KeyChallengeSet, KeyChallenge, KeyAction } from './keyChallengeGenerator';
import { TIME_WINDOW, DIFFICULTY_INCREASE, PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE, DIFFICULTY_CRITICAL_THRESH, BLINK_DURATION_MS, AVAIL_KEYS, TIME_WINDOW_HC, DIFFICULTY_INCREASE_HC } from './config';
import { timer, Subject, of, Subscription } from 'rxjs';
import './changeKeyUiFunctions';
import { letKeyGlow, stopKeyGlow, stopKeyErrorGlow, keyIsReleased, keyIsPressed, letKeyErrorGlow } from './changeKeyUiFunctions';
import { setProgress, setTimeWindow } from './progessBarFuncs';


class KeyProcessor {

	private keyMem = new Set<number>();
	private subjectMap: Map<string, Subject<string>> = new Map();
	
	constructor() {
	}

	init(){
		document.body.addEventListener("keydown", (e) => this.dispatcherFun(e));
		document.body.addEventListener("keyup", (e) => this.dispatcherFun(e));
	}

	public registerNewSubjects(subjectMap: Map<string, Subject<string>>) {
		this.subjectMap = subjectMap;
	}

	private dispatcherFun(e: KeyboardEvent) {

		if (e.type === 'keydown' && ! this.keyMem.has(e.keyCode)) {
			this.keyMem.add(e.keyCode);
			keyIsPressed(String.fromCharCode(e.keyCode));

		    //wel will need this for holding

		} else if (e.type === 'keyup') {
			this.keyMem.delete(e.keyCode);

			//SPAM challenges are only interessted in keyup 
			let stringkey : string = String.fromCharCode(e.keyCode);
			let sub = this.subjectMap.get(stringkey);

			//show error keys
			if(!sub){
				letKeyErrorGlow(stringkey);
				setTimeout(() => {
					stopKeyErrorGlow(stringkey);
				}, 200);
			}
			sub?.next();
			keyIsReleased(String.fromCharCode(e.keyCode));

		}
	}
}

export class KeyGame{
	private keyprocessor = new KeyProcessor();
	private keyChallengeGenerator = new KeyChallengeGenerator();
	private end?: () => void;
	private crit?: () => void;

	private innerTimeWindow = TIME_WINDOW
	private innerDifficultyAdjust = DIFFICULTY_INCREASE;
	private isHC: boolean = false; 

	constructor(){}

    registerEndOfGameCB(cb : ()=>void) {
		this.end = cb;
    }
    registerGettinCriticalCB(cb : ()=>void) {
		this.crit = cb;
	}


	public setHcMode(){
		this.innerTimeWindow = TIME_WINDOW_HC;
		this.innerDifficultyAdjust = DIFFICULTY_INCREASE_HC;
		this.isHC = true;
	}

	public startKeyGame() {

		const gameTimer = timer(this.innerTimeWindow, this.innerTimeWindow);
		this.keyprocessor.init();

		let difficulty = 5; 
		let curKeyGame = new KeyGameRound(this.isHC, difficulty, this.keyChallengeGenerator, this.keyprocessor);
 	    let subscription = gameTimer.subscribe(
			(window) => {
				//calculate outcom and death
				if(!curKeyGame.solved()){
					if(this.end){
						this.end();
					}
					subscription.unsubscribe();	
				} else {

					difficulty = difficulty + this.innerDifficultyAdjust;
					if(Math.floor(difficulty) > DIFFICULTY_CRITICAL_THRESH){
						if(this.crit){
							this.crit();
						}
					}
					//get and register next challenges
					curKeyGame = new KeyGameRound(this.isHC, Math.floor(difficulty), this.keyChallengeGenerator, this.keyprocessor);
					//console.log("new game started");
				}

			}
		);
	
	}
}


export class KeyGameRound{

	private challengeSubjects : Map<string, Subject<string>>; 
	private challengesToSolve : KeyChallengeSet;
	private targetNumber: number;
	private solvedNumber: number; 
	private subsToStop : Array<Subscription>;

	animTimeWindowProgressBar(hc:boolean){
		setTimeWindow(0);
		let sub = timer(0, 200).subscribe((v)=>{
			let perCent = (v/(TIME_WINDOW/200))*100;
			if(hc){
				perCent = (v/(TIME_WINDOW_HC/200))*100;
			}
			//console.log(`set progress to ${perCent}`)
			setTimeWindow(perCent);
		});
		this.subsToStop.push(sub);
	}
	
	constructor(hc: boolean, difficulty: number, keyChallengeGenerator : KeyChallengeGenerator, keyprocessor: KeyProcessor){
		this.subsToStop = new Array();
		this.animTimeWindowProgressBar(hc);
		this.updateProgressProgressBar();
		this.solvedNumber = 0;
		this.challengeSubjects = new Map<string, Subject<string>>();
		
		this.challengesToSolve = keyChallengeGenerator.getChallenge(difficulty);
		//difficulty is adjusted so get the actual length
		this.targetNumber = this.challengesToSolve.length;
		//console.log(`number challenges ${this.targetNumber}`);

		this.challengesToSolve.forEach((keyChall: KeyChallenge)=>{
			let subject = new Subject<string>();
			this.challengeSubjects.set(keyChall.key, subject);

			if(keyChall.action==KeyAction.SPAM) {
				let blink_subscription = timer(BLINK_DURATION_MS, BLINK_DURATION_MS).subscribe((i) => {
					if(i%2==0){
						letKeyGlow(keyChall.key); 
					}else{
						stopKeyGlow(keyChall.key);
					}
				});
				keyChall.subs.push(blink_subscription);
				this.subsToStop.push(blink_subscription);
			}
			 

			let sub = subject.subscribe((s) => {
				if(keyChall.action === KeyAction.SPAM){
					keyChall.current += 1;
					if(keyChall.current >= keyChall.target){
						//console.log(`solved`);
						this.solvedNumber++;
						//end subs if nesc
						keyChall.subs.forEach((s)=>s.unsubscribe());
						stopKeyGlow(keyChall.key);
						var audio = new Audio('./assets/audio/effects/KeyReady.mp3');
						audio.play();
						this.updateProgressProgressBar();
						sub.unsubscribe();
						
					}
				}
			})
		})
		keyprocessor.registerNewSubjects(this.challengeSubjects);
	}

	private cleanup(){
		//stop remaining subs
		this.subsToStop.forEach((s)=>{
			s.unsubscribe();
		});

		//clear all maybe set keys
		AVAIL_KEYS.forEach((k) => {
			stopKeyGlow(k);
			stopKeyErrorGlow(k);
			keyIsReleased(k);
		});
	}

	updateProgressProgressBar() {
		let progress = Math.floor((this.solvedNumber / this.targetNumber)*100/PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE);
		setProgress(progress ? progress : 0);
	}

	solved(): boolean{
		//if this gets called we should clean up
		this.cleanup();
		return PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE <= (this.solvedNumber / this.targetNumber);
	}

}
