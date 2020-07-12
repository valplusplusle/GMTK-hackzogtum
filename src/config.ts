
//duration for each challenges in ms
export const TIME_WINDOW : number = 5000; 
export const GAME_TICK_DURATION : number = 50;

//min and max for target of action SPAM
export const MAX_SPAM_NBR : number = 5; 
export const MIN_SPAM_NBR : number = 15; 

//min and max time for holding a key during a time window 
export const MAX_TARGET_TIME : number = 500; 
export const MIN_TARGET_TIME : number = 4000; 

//available keys which are used to gen challenges
export const AVAIL_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];


export const PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE :number = .3;

//if difficulty exceeds the thresh the gettin harder callback is called
export const DIFFICULTY_INCREASE = .3
export const DIFFICULTY_CRITICAL_THRESH = 8; 

export const BLINK_DURATION_MS = 100;