let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.getAttribute("href").split("%5C")[3].replaceAll("%20", " "))
        }

    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                <img class="invert" src="img/music.svg" alt="musicIcon">
                                <div title="${song.replaceAll("%5C", " ").replaceAll("%20", " ")}" class="info">
                                    <div>${song.replaceAll("%5C", " ").replaceAll("%20", " ")}</div>
                                    <div>song artist</div>
                                </div>
                                <div class="playnow">
                                        <span>Play Now</span>
                                        <img class="invert" src="img/play.svg" alt="play">
                                </div></li>`
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
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
    currentSong.src = `/${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    let decodedName = decodeURI(track).replaceAll("\\", "");

    let songInfoDiv = document.querySelector(".songinfo");
    songInfoDiv.innerHTML = `<span>${decodedName}</span>`;

    songInfoDiv.setAttribute("title", decodedName);

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if (e.href.includes("%5Csongs%5C")) {
            let folder = (e.href.split("%5Csongs%5C")[1])
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="icon-container">
                            <img class="icon"
                                src="https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/b0acb01fa88ae0753ef903b8fc45fadb5efe1c2b/Video%2084%20-%20Project%202%20-%20Spotify%20Clone/img/play.svg"
                                alt="Play">
                        </div>
                        <img class="cover"
                            src="/songs/${folder}/cover.jpg"
                            alt="Happy Hits!">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    }

     Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main() {

    await getSongs("songs/Bright")
    playMusic(songs[0], true)

    displayAlbums()

    let play = document.getElementById("play")
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"

        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = `${per}%`
        currentSong.currentTime = (currentSong.duration * per) / 100
    })

    document.querySelector(".hambuger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%"
    })

    prev = document.getElementById("prev")
    next = document.getElementById("next")
    prev.addEventListener("click", () => {
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " "))
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " "))
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = "img/volume.svg";
        }
    })

    document.querySelector(".volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("img/volume.svg")) {
            currentSong.volume = 0;
            e.target.src = "img/mute.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            currentSong.volume = 0.3; 
            e.target.src = "img/volume.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }
    })
}

main()
