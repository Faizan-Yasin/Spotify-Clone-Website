const MY_ALBUMS = {
    "Bright": {
        title: "Bright Songs",
        description: "Bright Songs for you",
        songs: [
            "House Of Cards - Blue Deer.mp3",
            "Time of your life - Patrick Jordan Patrikios.mp3",
            "Yesterdays  - Blue Deer.mp3"
        ]
    },
    "Chill": {
        title: "Just Chill",
        description: "Yes, Just Chill",
        songs: [
            "Care Is Heavy - Jeremy Korpas, Rick Barry.mp3",
            "Elysian Fields - Jeremy Korpas, Rick Barry.mp3",
            "Tonight Again - Rod Kim (feat. Mostly Moss).mp3"
        ]
    },
    "Love": {
        title: "I Love You",
        description: "Love is in the air",
        songs: [
            "Club Love - Everet Almond.mp3",
            "Love Me Never Ending - Everet Almond.mp3",
            "One true love - Patrick Patrikios.mp3"
        ]
    }
};

let currentSong = new Audio();
let songs = [];
let currFolder = "";

function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ""; 

    Object.keys(MY_ALBUMS).forEach(folder => {
        let album = MY_ALBUMS[folder];
        cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="icon-container">
                    <img class="icon"
                        src="https://raw.githubusercontent.com/Faizan-Yasin/Spotify-Clone-Website/main/img/play.svg"
                        alt="Play">
                </div>
                <img class="cover" src="songs/${folder}/cover.jpg" alt="${album.title}">
                <h3>${album.title}</h3>
                <p>${album.description}</p>
            </div>`;
    });

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let folder = item.currentTarget.dataset.folder;
            songs = await getSongs(folder);
            if(songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}

async function getSongs(folder) {
    currFolder = folder;
    
    if (MY_ALBUMS[folder]) {
        songs = MY_ALBUMS[folder].songs;
    } else {
        songs = [];
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="img/music.svg" alt="musicIcon">
                <div title="${song}" class="info">
                    <div>${song}</div>
                    <div>Song Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="play">
                </div>
            </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `songs/${currFolder}/` + track;

    if (!pause) {
        currentSong.play().catch(err => console.log("Playback interaction waiting user context:", err));
        document.getElementById("play").src = "img/pause.svg";
    } else {
        document.getElementById("play").src = "img/play.svg";
    }

    let decodedName = decodeURI(track);
    let songInfoDiv = document.querySelector(".songinfo");
    songInfoDiv.innerHTML = `<span>${decodedName}</span>`;
    songInfoDiv.setAttribute("title", decodedName);

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
    // Default system start up config - Pehla album load karna
    songs = await getSongs("Bright");
    if(songs.length > 0) {
        playMusic(songs[0], true);
    }

    displayAlbums();

    let play = document.getElementById("play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
            document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
        }
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let per = (e.offsetX / e.currentTarget.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = `${per}%`;
        if(!isNaN(currentSong.duration)) {
            currentSong.currentTime = (currentSong.duration * per) / 100;
        }
    });

    document.querySelector(".hambuger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%";
    });

    let prev = document.getElementById("prev");
    let next = document.getElementById("next");

    prev.addEventListener("click", () => {
        let currentTrackName = decodeURI(currentSong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentTrackName);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        } else {
            playMusic(songs[songs.length - 1]); // Cycle backward logic
        }
    });

    next.addEventListener("click", () => {
        let currentTrackName = decodeURI(currentSong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentTrackName);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            playMusic(songs[0]); // Cycle forward loop logic
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = "img/volume.svg";
        } else {
            document.querySelector(".volume>img").src = "img/mute.svg";
        }
    });

    document.querySelector(".volume>img").addEventListener("click", (e) => {
        let rangeInput = document.querySelector(".range").getElementsByTagName("input")[0];
        if (e.target.src.includes("img/volume.svg")) {
            currentSong.volume = 0;
            e.target.src = "img/mute.svg";
            rangeInput.value = 0;
        } else {
            currentSong.volume = 0.3; 
            e.target.src = "img/volume.svg";
            rangeInput.value = 30;
        }
    });
}

main();
