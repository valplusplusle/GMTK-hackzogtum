import * as rxjs from 'rxjs';
import { KeyChallengeGenerator, KeyChallengeSet } from './keyChallengeGenerator';

export function foo() {
	rxjs.of(1, 2, 3).subscribe((v)=>console.log(v));

	let kcg = new KeyChallengeGenerator();
	kcg.getChallenge(12).keys.forEach((e) => {
		console.log(e.key);
		console.log(e.action);
		console.log(e.target);
	})
	
}

export enum KeyState {
	PRESSED,
	RELEASED,
}

export type KeyEvent = {
	key: number,
	state: KeyState,
}

export interface KeyObserver {
	(evt: KeyEvent): void;
}

export enum ChallengeOutcome {
	SOLVED,
	FAILED,
}
export type ChallengeEvent = {
	state: ChallengeOutcome,
}
export interface ChallengeObserver {
	(evt: ChallengeEvent): void;
}


export class KeyProcessor {

	private expectedObservers = new Array<KeyObserver>();
	private unexpectedObservers = new Array<KeyObserver>();
	private challengeObservers = new Array<ChallengeObserver>();
	private challenges: KeyChallengeSet | undefined;

	private keyMem = new Set<number>();
	
	constructor() {

	}

	public registerExpected(obs: KeyObserver) {
		this.expectedObservers.push(obs);
	}
	public registerUnexpected(obs: KeyObserver) {
		this.unexpectedObservers.push(obs);
	}
	public registerChallenges(obs: ChallengeObserver) {
		this.challengeObservers.push(obs);
	}

	public start() {
		document.body.addEventListener("keydown", this.dispatcherFun);
		document.body.addEventListener("keyup", this.dispatcherFun);
		console.log("Keyevents registered.");
	}

	private dispatcherFun(e: KeyboardEvent) {
		if (e.type == 'keydown' && ! this.keyMem.has(e.keyCode)) {
			this.keyMem.add(e.keyCode);
			if (this.isExpectedKey(e.keyCode)) {
				this.notify(this.expectedObservers, e);
			} else {
				this.notify(this.unexpectedObservers, e);
			}
			// TODO: check if the key fulfills  the challenge
		} else if (e.type == 'keyup') {
			this.keyMem.delete(e.keyCode);
			if (this.isExpectedKey(e.keyCode)) {
				this.notify(this.expectedObservers, e);
			} else {
				this.notify(this.unexpectedObservers, e);
			}
		}
	}

	private notify(obses: Array<KeyObserver>, e: KeyboardEvent) {
		obses.forEach(obs => {
			obs({
				key: e.keyCode,
				state: e.type == 'keydown' ? KeyState.PRESSED : KeyState.RELEASED,
			});
		});
	}

	private isExpectedKey(keyCode: number): boolean {
		const expected = this.challenges?.keys.find(kc => kc.key === String.fromCharCode(keyCode));
		if (expected !== undefined) {
			return true;
		} else {
			return false;
		}
	}

}
