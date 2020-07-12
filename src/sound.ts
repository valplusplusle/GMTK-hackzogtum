
export function playBackgroundMusic() {
	//console.log("start bg music called.");
	let audio = document.getElementById("bgaudio");
	if (audio instanceof HTMLAudioElement) {
		audio.play();
	}
}

export function playGameOver() {
	var audio = new Audio('./assets/audio/effects/GameOver.mp3');
	audio.volume = .3;
	audio.play();
}

export function stopBackgroundMusic() {
	//console.log("stop bg music called.");
	let audio = document.getElementById("bgaudio");
	if (audio instanceof HTMLAudioElement) {
		if(audio.fastSeek){
			audio.fastSeek(0);
		}
		audio.pause();
	}
}

function selectTrack(url: string) {
	let audio = document.getElementById("bgaudio");
	if (audio instanceof HTMLAudioElement) {
		audio.src = url;
	}
}

export function selectNormalTrack() {
	selectTrack("assets/audio/music/MainTheme.mp3");
}

export function selectHcTrack() {
	selectTrack("assets/audio/music/HardcoreMode.mp3");
}
