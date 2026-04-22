let currentSong = new Audio();
let currentSongIdx = 0;
let songCount;
let playButton = document.querySelector("#play");
let prevButton = document.querySelector("#previous");
let nextButton = document.querySelector("#next");
let playbar = document.querySelector(".playbar");
let songInfo = document.querySelector(".songinfo");
let timing = document.querySelector(".timing");
let volumeIcon = document.querySelector(".volumeIcon");
let songNameList = [];
let prevSongNameList = [];
let songList = [];
let currentVolume;
let currentSongHtml;

// --- GITHUB API CONFIGURATION ---
const GITHUB_USERNAME = "madhavg07";
const REPO_NAME = "Music-Playstation";
// --------------------------------

// Fetch songs dynamically directly from your GitHub Repository
async function getSongs(folder) {
    prevSongNameList = [...songNameList];
    songNameList = [];
    let songs = [];
    
    try {
        let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/songs/${folder}`);
        let files = await response.json();

        for (let file of files) {
            if (file.name.endsWith(".mp3")) {
                // Clean up the name for the UI
                songNameList.push(file.name.replaceAll("%20", " ").replace("320 Kbps.mp3", "").replace(".mp3", ""));
                // Create the correct relative URL
                songs.push(`./songs/${folder}/${file.name}`); 
            }
        }
    } catch (error) {
        console.error("Failed to fetch songs from GitHub:", error);
    }
    return songs;
}

// Convert seconds to HH:MM:SS format
function timeDimension(number) {
    let h = 0, m = 0, s = 0;
    let num = Math.floor(number);
    h = Math.floor(num / 3600);
    num %= 3600;
    m = Math.floor(num / 60);
    num %= 60;
    s = num;
    let hrs = h > 10 ? h : "0" + h;
    let min = m > 10 ? m : "0" + m;
    let sec = s > 10 ? s : "0" + s;
    return `${hrs}:${min}:${sec}`;
}

// Dynamically fetch folders (1a, 1b, etc.) and draw the Album Cards
async function displayAlbums() {
    let contentPage = document.querySelector(".contentPage");
    
    // Inject the HTML structure that was commented out
    contentPage.innerHTML = `
        <div class="spotifyPlaylist">
            <section class="playlistBox">
                <div class="discription flex">
                    <a href="#"><div class="heading">Spotify Playlist</div></a>
                    <a href="#"><div class="seeAll">See All</div></a>
                </div>
                <div class="contentPlaylist flex"></div>
            </section>
        </div>`;

    let cardContainer = document.querySelector(".contentPlaylist");

    try {
        // Ask GitHub what folders are inside /songs/
        let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/songs`);
        let items = await response.json();

        for (let item of items) {
            // If it is a folder (like 1a, 1b)
            if (item.type === "dir") {
                let folderName = item.name;
                let info = { title: "Album", description: "Hits" }; // Default fallback

                // Try to fetch the info.json directly
                try {
                    let infoRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/songs/${folderName}/info.json`);
                    if (infoRes.ok) {
                        info = await infoRes.json();
                    }
                } catch(e) { console.log("No info.json found for " + folderName); }

                // Draw the card (Notice I used cover.jpeg based on your screenshot!)
                cardContainer.innerHTML += `
                    <div data-folder="${folderName}" class="contentBox card">
                        <div class="play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" fill="#000000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="./songs/${folderName}/cover.jpeg" alt="cover">
                        <h2>${info.title}</h2>
                        <p>${info.description}</p>
                    </div>`;
            }
        }
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

// Main function
async function main() {
    // 1. Wait for albums to be drawn on the screen first!
    await displayAlbums();

    // 2. Now that the cards exist, select them and add click events
    let contentBox = Array.from(document.querySelectorAll(".contentBox"));
    
    contentBox.forEach((e) => {
        e.addEventListener("click", async (item) => {
            let songs = await getSongs(item.currentTarget.dataset.folder);
            if (songs.length === 0) return; 

            document.querySelector(".left").style.left = "0%";
            
            let songUl = document.querySelector(".songcard ul");
            document.querySelector(".songlist").innerHTML = "";
            songNameList.forEach(song => {
                if (song) {
                    songUl.innerHTML += `<li class="music flex">
                                            <div class="musicImg flex">
                                                <img src="img/music.svg" class="invert musiclogo" alt="">
                                                <div class="songInfo">
                                                    <div class="songName">${song}</div>
                                                    <div class="songSinger">Artist</div>
                                                </div>
                                            </div>
                                            <div class="songPlay flex">
                                                <div class="playNow">Play Now</div>
                                                <img src="img/play.svg" class="invert" alt="play">
                                            </div>
                                        </li>`;
                }
            });

            document.querySelectorAll(".music").forEach(f => {
                if (currentSongHtml === f.querySelector(".songName").innerHTML) {
                    f.style.backgroundColor = "rgb(54, 208, 255)";
                }
            });

            function playMusic(str) {
                songs.forEach((song, index) => {
                    let songHTML = songNameList[index];
                    if (songHTML === str) {
                        currentSongHtml = songHTML;
                        currentSong.src = song;
                        currentSong.play();
                        currentSong.volume = 0.5;

                        currentSong.addEventListener("timeupdate", () => {
                            timing.innerHTML = `${timeDimension(currentSong.currentTime)} / ${timeDimension(currentSong.duration)}`;
                            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
                        });

                        currentSongIdx = index;
                        playbar.style.visibility = "visible";
                        playButton.src = "img/pause.svg";
                        songInfo.innerHTML = songList[index];
                        document.querySelector(".seekBar").addEventListener("click", (e) => {
                            document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
                            currentSong.currentTime = currentSong.duration * (e.offsetX / e.target.getBoundingClientRect().width);
                        });
                    }
                });
                songCount = songs.length;
            }

            document.querySelectorAll(".songcard li").forEach(e => {
                e.addEventListener("click", () => {
                    document.querySelectorAll(".songcard .music").forEach(f => {
                        f.style.backgroundColor = "#242424";
                    });
                    
                    prevSongNameList = [...songNameList];
                    prevSongNameList.forEach((song, index) => {
                        songList[index] = `<img src="img/music.svg" class="invert musiclogo" alt="">${song}`;
                    });

                    playMusic(e.querySelector(".songName").innerHTML);
                    e.style.backgroundColor = currentSongHtml === e.querySelector(".songName").innerHTML ? "rgb(54, 208, 255)" : "#242424";
                });
            });
        });
    });

    // Global Play/Pause
    playButton.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playButton.src = "img/pause.svg";
        } else {
            currentSong.pause();
            playButton.src = "img/play.svg";
        }
    });

    function updateSongInfo() {
        songInfo.innerHTML = songList[currentSongIdx];
        playButton.src = "img/pause.svg";
        document.querySelectorAll(".music").forEach(f => {
            if (songInfo.innerHTML.includes(f.querySelector(".songName").innerHTML)) {
                currentSongHtml = f.querySelector(".songName").innerHTML;
                f.style.backgroundColor = "rgb(54, 208, 255)";
            } else {
                f.style.backgroundColor = "#242424";
            }
        });
    }

    // Previous Song
    prevButton.addEventListener("click", () => {
        if (currentSongIdx > 0) {
            currentSongIdx--;
        } else {
            currentSongIdx = songCount - 1; 
        }
        currentSong.src = songNameList[currentSongIdx] ? `./songs/${currentSong.src.split('/songs/')[1].split('/')[0]}/${songNameList[currentSongIdx]}.mp3` : currentSong.src;
        currentSong.play();
        updateSongInfo();
    });
    
    // Next Song
    nextButton.addEventListener("click", () => {
        if (currentSongIdx < songCount - 1) {
            currentSongIdx++;
        } else {
            currentSongIdx = 0; 
        }
        currentSong.src = songNameList[currentSongIdx] ? `./songs/${currentSong.src.split('/songs/')[1].split('/')[0]}/${songNameList[currentSongIdx]}.mp3` : currentSong.src;
        currentSong.play();
        updateSongInfo();
    });

    // Volume & UI Controls
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    });

    document.querySelector(".closeIcon").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-400%";
    });

    document.querySelector(".volLine").addEventListener("change", (e) => {
        currentVolume = currentSong.volume;
        currentSong.volume = parseInt(e.target.value) / 100;
        volumeIcon.src = currentSong.volume === 0 ? "img/mute.svg" : "img/volume.svg";
    });

    volumeIcon.addEventListener("click", () => {
        if (currentSong.volume === 0) {
            volumeIcon.src = "img/volume.svg";
            currentSong.volume = currentVolume;
            document.querySelector(".volLine").value = currentVolume * 100;
        } else {
            volumeIcon.src = "img/mute.svg";
            currentVolume = currentSong.volume;
            currentSong.volume = 0;
            document.querySelector(".volLine").value = 0;
        }
    });
}

main();