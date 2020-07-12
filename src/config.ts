
//duration for each challenges in ms
export const TIME_WINDOW : number = 13000; 
export const GAME_TICK_DURATION : number = 50;

//min and max for target of action SPAM
export const MAX_SPAM_NBR : number = 5; 
export const MIN_SPAM_NBR : number = 15; 

//min and max time for holding a key during a time window 
export const MAX_TARGET_TIME : number = 500; 
export const MIN_TARGET_TIME : number = 4000; 

//available keys which are used to gen challenges
//export const AVAIL_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
export const AVAIL_KEYS = ["1","2","3","4","5","6","7","8","9","0","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

export const PERCENT_OF_TO_SOLVE_CHALLENGS_TO_NOT_DIE :number = .8;

//if difficulty exceeds the thresh the gettin harder callback is called
export const DIFFICULTY_INCREASE = .4
export const DIFFICULTY_CRITICAL_THRESH = 8; 

export const BLINK_DURATION_MS = 100;