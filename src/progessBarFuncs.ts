export function setTimeWindow(v: number) {
    let objectToModify = document.getElementById(`timewindow`)!;  
    objectToModify.setAttribute("value", `${v}`);
}
export function setProgress(v: number) {
    let objectToModify = document.getElementById(`challengeProgress`)!;  
    objectToModify.setAttribute("value", `${v}`);
}