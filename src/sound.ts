
export function playBackgroundMusic() {
	console.log("start bg music called.");
	let audio = document.getElementById("bgaudio");
	if (audio instanceof HTMLAudioElement) {
		audio.play();
	}
}
