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
let contentBox = Array.from(document.querySelectorAll(".contentBox"));
let songNameList = [];
let prevSongNameList = [];
let songList = [];
let currentVolume;
let currentSongHtml;

// Fetch songs from the specified folder
async function getSongs(folder) {
    let response = await fetch(`http://127.0.0.1:5500/songs/${folder}/`);
    let htmlText = await response.text();
    let div = document.createElement("div");
    div.innerHTML = htmlText;
    let links = div.getElementsByTagName("a");

    prevSongNameList = [...songNameList];
    songNameList = [];
    
    let songs = [];
    for (let link of links) {
        if (link.href.endsWith(".mp3")) {
            songNameList.push(link.href.split(`/${folder}/`)[1].replaceAll("%20", " ").replace("320 Kbps.mp3", " "));
            songs.push(link.href);
        }
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

// Display album information
async function displayAlbum() {
    let response = await fetch(`http://127.0.0.1:5500/songs/`);
    let htmlText = await response.text();
    let div = document.createElement("div");
    div.innerHTML = htmlText;
    let anchors = Array.from(div.getElementsByTagName("a"));
    anchors.forEach((e) => {
        if (e.href.includes("/songs/")) {
            console.log(e.href.split("/").slice(4)[0]);
        }
    });
}

// Main function to initialize event listeners and interactions
async function main() {
    displayAlbum();
    contentBox.forEach((e) => {
        e.addEventListener("click", async (item) => {
            let songs = await getSongs(item.currentTarget.dataset.folder);
            document.querySelector(".left").style.left = "0%";
            
            let songUl = document.querySelector(".songcard ul");
            document.querySelector(".songlist").innerHTML = "";
            songNameList.forEach(song => {
                if (song) {
                    songUl.innerHTML += `<li class="music flex">
                                            <div class="musicImg flex">
                                                <img src="music.svg" class="invert musiclogo" alt="">
                                                <div class="songInfo">
                                                    <div class="songName">${song}</div>
                                                    <div class="songSinger">singer</div>
                                                </div>
                                            </div>
                                            <div class="songPlay flex">
                                                <div class="playNow">Play Now</div>
                                                <img src="play.svg" class="invert" alt="play">
                                                <img src="like.svg" class="invert" alt="like">
                                                <img src="dislike.svg" class="invert" alt="dislike">
                                            </div>
                                        </li>`;
                }
            });

            document.querySelectorAll(".music").forEach(f => {
                if (currentSongHtml === f.querySelector(".songName").innerHTML) {
                    f.style.backgroundColor = "rgb(54, 208, 255)";
                }
            });

            function playCount() {
                songCount = songs.length;
            }

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
                        playButton.src = "pause.svg";
                        songInfo.innerHTML = songList[index];
                        document.querySelector(".seekBar").addEventListener("click", (e) => {
                            document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
                            currentSong.currentTime = currentSong.duration * e.offsetX / e.target.getBoundingClientRect().width;
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
                    playCount();
                    prevSongNameList.forEach((song, index) => {
                        songList[index] = `<img src="music.svg" class="invert musiclogo" alt="">${song}`;
                    });

                    playMusic(e.querySelector(".songName").innerHTML);
                    e.style.backgroundColor = currentSongHtml === e.querySelector(".songName").innerHTML ? "rgb(54, 208, 255)" : "#242424";
                });
            });

            playButton.addEventListener("click", () => {
                if (currentSong.paused) {
                    currentSong.play();
                    playButton.src = "pause.svg";
                } else {
                    currentSong.pause();
                    playButton.src = "play.svg";
                }
            });

            function updateSongInfo() {
                songInfo.innerHTML = songList[currentSongIdx];
                playButton.src = "pause.svg";
                document.querySelectorAll(".music").forEach(f => {
                    if (songInfo.innerHTML.slice(53) === f.querySelector(".songName").innerHTML) {
                        currentSongHtml = songInfo.innerHTML.slice(53);
                        f.style.backgroundColor = "rgb(54, 208, 255)";
                    } else {
                        f.style.backgroundColor = "#242424";
                    }
                });
            }

            prevButton.addEventListener("click", () => {
                if (currentSongIdx > 0) {
                    currentSongIdx--;
                } else {
                    currentSongIdx = songs.length - 1; // Loop to the last song if it's the first song
                }
                currentSong.src = songs[currentSongIdx];
                currentSong.load(); // Ensure the new source is fully loaded before playing
                currentSong.addEventListener('loadeddata', () => {
                    currentSong.play();
                    updateSongInfo();
                });
            });
            
            nextButton.addEventListener("click", () => {
                if (currentSongIdx < songs.length - 1) {
                    currentSongIdx++;
                } else {
                    currentSongIdx = 0; // Loop to the first song if it's the last song
                }
                currentSong.src = songs[currentSongIdx];
                currentSong.load(); // Ensure the new source is fully loaded before playing
                currentSong.addEventListener('loadeddata', () => {
                    currentSong.play();
                    updateSongInfo();
                });
            });
            
            
            
            

            document.querySelector(".hamburger").addEventListener("click", () => {
                document.querySelector(".left").style.left = "0%";
            });

            document.querySelector(".closeIcon").addEventListener("click", () => {
                document.querySelector(".left").style.left = "-400%";
            });

            document.querySelector(".volLine").addEventListener("change", (e) => {
                currentVolume = currentSong.volume;
                currentSong.volume = parseInt(e.target.value) / 100;
                volumeIcon.src = currentSong.volume === 0 ? "mute.svg" : "volume.svg";
            });

            volumeIcon.addEventListener("click", () => {
                if (currentSong.volume === 0) {
                    volumeIcon.src = "volume.svg";
                    currentSong.volume = currentVolume;
                    document.querySelector(".volLine").value = currentVolume * 100;
                } else {
                    volumeIcon.src = "mute.svg";
                    currentVolume = currentSong.volume;
                    currentSong.volume = 0;
                    document.querySelector(".volLine").value = 0;
                }
            });
        });
    });
}

main();


// prev.addEventListener("click", () => {
//     let promise=new Promise((resolve,reject) => {
//         if (currentSongIdx != 0) {
//             currentSong.src = prevSongs[currentSongIdx - 1]
//             currentSongIdx--;
//         }
//         else {
//             currentSong.src = prevSongs[currentSongIdx]
//         }
//         resolve();
//     }
//     ).then(() => {
//         currentSong.play();
//         songInfo.innerHTML = songList[currentSongIdx];
//     playy.src = "pause.svg";
//     Array.from(document.querySelectorAll(".music")).forEach((f) => {
        
//         if (songInfo.innerHTML.slice(53) == f.querySelector(".songName").innerHTML) {
//             currentSongHtml=songInfo.innerHTML.slice(53)
//             f.style.backgroundColor = "rgb(54, 208, 255)";
//         }
//         else{
//             f.style.backgroundColor = "#242424";
//         }
//     })
//     }
//     )
    
    
    
// })
// next.addEventListener("click", () => {
//     let promise=new Promise((resolve,reject) => {
//         setTimeout(() => {
//             if (currentSongIdx < songCount - 1) {
//                 currentSong.src = prevSongs[currentSongIdx + 1]
//                 currentSongIdx++;
//             }
//             else {
//                 currentSong.src = prevSongs[currentSongIdx]
//             }
//             resolve(currentSongIdx);
//         }, 1000);
        
//     }
//     ).then((currentSongIdx) => {
//         currentSong.play();
//         songInfo.innerHTML = songList[currentSongIdx];
//         playy.src = "pause.svg";
//         Array.from(document.querySelectorAll(".music")).forEach((f) => {
//             if (songInfo.innerHTML.slice(53) == f.querySelector(".songName").innerHTML) {
//                 currentSongHtml=songInfo.innerHTML.slice(53)
//                 f.style.backgroundColor = "rgb(54, 208, 255)";
//             }
//             else{
//                 f.style.backgroundColor = "#242424";
//             }
//         })
//     }
//     )
// })