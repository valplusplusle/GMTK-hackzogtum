export function keyIsPressed(key: string) {
    let objectToModify = document.getElementById(key)!;     
    objectToModify.classList.remove("key"+key.toUpperCase());   
    objectToModify.classList.add("key"+key.toUpperCase()+"--pressed");
}

export function keyIsReleased(key: string) {
    let objectToModify = document.getElementById(key)!;  
    objectToModify.classList.remove("key"+key.toUpperCase()+"--pressed");        
    objectToModify.classList.add("key"+key.toUpperCase());
}

export function letKeyGlow(key: string) {
    let objectToModify = document.getElementById(key)!;  
    objectToModify.classList.remove("key"+"--noGlow");        
    objectToModify.classList.add("key"+"--glow");
}

export function stopKeyGlow(key: string) {
    let objectToModify = document.getElementById(key)!;  
    objectToModify.classList.remove("key"+"--glow");        
    objectToModify.classList.add("key"+"--noGlow");
}

export function letKeyErrorGlow(key: string) {
    let objectToModify = document.getElementById(key)!;  
    objectToModify.classList.remove("key"+"--noGlow");        
    objectToModify.classList.add("key"+"--alert");
}

export function stopKeyErrorGlow(key: string) {
    let objectToModify = document.getElementById(key)!;  
    objectToModify.classList.remove("key"+"--alert");        
    objectToModify.classList.add("key"+"--noGlow");
}