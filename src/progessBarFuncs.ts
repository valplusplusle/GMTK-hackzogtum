export function setTimeWindow(v: number) {
    let objectToModify = document.getElementById(`timewindow`)!;  
    objectToModify.setAttribute("value", `${v}`);
}