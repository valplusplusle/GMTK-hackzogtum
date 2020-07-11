import {MAX_TARGET_TIME, MIN_TARGET_TIME, MAX_SPAM_NBR, MIN_SPAM_NBR, AVAIL_KEYS} from './config';

export enum KeyAction {
    HOLD,
    SPAM,
}

//target is either time you have to hold during duration or nbr of hits for spam
export type KeyChallenge  = {
    key : string,
    action : KeyAction 
    target: number
}

export type KeyChallengeSet = {
    keys: Array<KeyChallenge>
}

export type KeyChallengeDifficulty = number;

const actionPool = [KeyAction.HOLD, KeyAction.SPAM];


export class KeyChallengeGenerator{

    private keyDrawPool: Array<string> = new Array();
    constructor(){}

    /**
     * 
     * @param difficulty marks upper border for nbr of challenges per set 
     */
    public getChallenge(difficulty : KeyChallengeDifficulty): KeyChallengeSet{

        if(difficulty>AVAIL_KEYS.length){
            difficulty = AVAIL_KEYS.length - 2;
        }

        let res = {
            keys : new Array<KeyChallenge>()
        }

        this.keyDrawPool = Array.from(AVAIL_KEYS);

        let nbr = this.randInt(2,difficulty);
        for(let i=0; i<nbr; i++){
            res.keys.push(this.genKeyChallenge());
        }

        return res; 
    }

    private genKeyChallenge(): KeyChallenge {

        let key = this.keyDrawPool[this.randInt(0, this.keyDrawPool.length)];
        this.keyDrawPool = this.keyDrawPool.filter((e)=>e !== key);

        let action = actionPool[this.randInt(0, actionPool.length)];

        let target = 0;
        switch (action) {
            case KeyAction.HOLD: 
                target = this.randInt(MIN_TARGET_TIME, MAX_TARGET_TIME); 
                break;
            case KeyAction.SPAM: 
                target = this.randInt(MIN_SPAM_NBR, MAX_SPAM_NBR); 
                break
        }

        return {
            key: key,
            action: action,
            target: target
        }
    }

    private randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max-min))+min;
    }



}
