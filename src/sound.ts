
export function playBackgroundMusic() {
	console.log("start bg music called.");
	let audio = document.getElementById("bgaudio");
	if (audio instanceof HTMLAudioElement) {
		audio.play();
	}
}

export function stopBackgroundMusic() {
	console.log("stop bg music called.");
	let audio = document.getElementById("bgaudio");
	if (audio instanceof HTMLAudioElement) {
		if(audio.fastSeek){
			audio.fastSeek(0);
		}
		audio.pause();
	}
}
