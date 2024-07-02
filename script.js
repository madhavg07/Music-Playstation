let currentSong = new Audio();
let currentSongIdx = 0;
let songCount;
let playy = document.querySelector("#play");
let prev = document.querySelector("#previous");
let next = document.querySelector("#next");
let playbar = document.querySelector(".playbar")
let songInfo = document.querySelector(".songinfo")
let timing = document.querySelector(".timing")
let volumeIcon = document.querySelector(".volumeIcon")
const audioContainer = document.getElementById('audioContainer');
let currentPlayImage;
let songNameList = [];
let prevSongNameList = [];
let songList = [];
let currentvolume
let currentSongHtml;
let currentPlayNow
let like = "none";
let dislike = "none";
let prevCont
let songs
let prevSongs;

async function getSongs(repo, path) {
    const url = `https://api.github.com/repos/madhavg07/Music-Playstation/contents/albums/${repo}/${path}`;
    const headers = {
        // Include your personal access token if necessary
        // 'Authorization': 'token YOUR_PERSONAL_ACCESS_TOKEN'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const songs = [];
        songNameList.length = 0;
        prevSongNameList.length = 0;

        data.forEach(file => {
            if (file.type === "file" && file.name.endsWith(".mp3")) {
                console.log(`Found MP3 file: ${file.name}`);
                const songName = file.name.replace("%20", " ").replace("320 Kbps.mp3", "");
                songNameList.push(songName);
                const rawSongUrl = file.download_url;
                songs.push(rawSongUrl);
            }
        });

        // Dynamically create audio elements for each song
        const audioContainer = document.getElementById('audioContainer');
        audioContainer.innerHTML = ''; // Clear any existing audio elements

        songs.forEach(song => {
            const audioElement = document.createElement('audio');
            audioElement.controls = true;

            const sourceElement = document.createElement('source');
            sourceElement.src = song;
            sourceElement.type = 'audio/mpeg';
            audioElement.appendChild(sourceElement);
            audioContainer.appendChild(audioElement);
            audioContainer.appendChild(document.createElement('br'));
        });

        return songs;
    } catch (error) {
        console.error(`Error fetching songs from GitHub API:`, error);
        return [];
    }
}



// async function getSongs(file, folder) {
//     try {
//         const url = `https://github.com/madhavg07/Music-Playstation/tree/main/albums/${file}/${folder}/`;
//         console.log(`Fetching URL: ${url}`);
//         let response = await fetch(url);
//         let htmlText = await response.text();

//         let div = document.createElement("div");
//         div.innerHTML = htmlText;
//         let anchors = div.getElementsByTagName("a");
//         let songs = [];

//         // Ensure songNameList and prevSongNameList are declared in the accessible scope
//         songNameList.length = 0;
//         prevSongNameList.length = 0;
//         console.log(`Number of anchors found: ${anchors.length}`);

//         // Extract song names and URLs
//         for (let i = 0; i < anchors.length; i++) {
//             let anchor = anchors[i];
//             console.log(`Processing anchor ${i}: ${anchor.href}`);
//             if (anchor.href.includes(".mp3")) {
//                 console.log(`Anchor ${i} contains an MP3`);
//                 let songName = anchor.href.split(`/${folder}/`)[1].replaceAll("%20", " ").replace("320 Kbps.mp3", "");
//                 songNameList.push(songName);
//                 let rawSongUrl = anchor.href.replace('madhavg07.github.io', 'raw.githubusercontent.com').replace('/blob/', '/');
//                 console.log(`Processed song URL: ${rawSongUrl}`);
//                 songs.push(rawSongUrl);
//             }
//         }

//         // Dynamically create audio elements for each song
//         const audioContainer = document.getElementById('audioContainer');
//         audioContainer.innerHTML = ''; // Clear any existing audio elements

//         songs.forEach(song => {
//             const audioElement = document.createElement('audio');
//             audioElement.controls = true;

//             const sourceElement = document.createElement('source');
//             sourceElement.src = song;
//             sourceElement.type = 'audio/mpeg';
//             audioElement.appendChild(sourceElement);
//             audioContainer.appendChild(audioElement);
//             audioContainer.appendChild(document.createElement('br'));
//         });

//         return songs;
//     } catch (error) {
//         console.error(`Error fetching songs for ${folder}:`, error);
//         return [];
//     }
// }


// async function getSongs(file, folder) {
//     let a = await fetch(`https://github.com/madhavg07/Music-Playstation/tree/main/albums/${file}/${folder}/`);
//     let response = await a.text();
//     //console.log(response);
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     let songs = []
//     let i = 0
//     while (prevSongNameList[i]) {
//         prevSongNameList[i] = "";
//         i++;
//     }
//     i = 0
//     while (songNameList[i]) {
//         prevSongNameList[i] = songNameList[i];
//         songNameList[i] = "";
//         i++;
//     }
//     i = 0;
//     for (const idx of as) {
//         if (idx.href.endsWith(".mp3")) {
//             songNameList[i] = idx.href.split(`/${folder}/`)[1].replaceAll("%20", " ").replace("320 Kbps.mp3", " ");
//             songs.push(idx.href);
//             i++;
//         }
//     }

//     // document.addEventListener("DOMContentLoaded", function() {
//     const audioContainer = document.getElementById('audioContainer');

//     // Dynamically create audio elements for each song
//     songs.forEach(song => {
//         const audioElement = document.createElement('audio');
//         audioElement.controls = true;
//         console.log(song);

//         const sourceElement = document.createElement('source');
//         sourceElement.src = `${song}`;
//         sourceElement.type = 'audio/mpeg';
//         audioElement.appendChild(sourceElement);
//         audioContainer.appendChild(audioElement);
//         audioContainer.appendChild(document.createElement('br'));
//     });
//     // });

//     return songs;
// }

function timeDimention(number) {
    let h = 0, m = 0, s = 0;
    let num = Math.floor(number);
    h = Number(Math.floor(num / 3600));
    num = num % 3600;
    m = Number(Math.floor(num / 60));
    num = num % 60;
    s = Number(num);
    let hrs = h > 10 ? h : "0" + h
    let min = m > 10 ? m : "0" + m
    let sec = s > 10 ? s : "0" + s
    return `${hrs}:${min}:${sec}`;
}
// async function displayAlbum(file) {
//     let contentPlaylist = document.querySelector(`.contentPlaylist[data-folder="${file}"]`);
//     try {
//         let response = await fetch(`https://github.com/madhavg07/Music-Playstation/tree/main/albums/${file}/`);
//         let htmlText = await response.text();
//         let div = document.createElement("div");
//         div.innerHTML = htmlText;
//         let anchors = Array.from(div.getElementsByTagName("a"));

//         for (let i = 0; i < anchors.length; i += 2) {
//             let e = anchors[i];
//             if (e.href.includes(`/${file}/`)) {
//                 console.log(e);
//                 let folderParts = e.href.split("/").slice(3);
//                 console.log(folderParts);
//                 if (folderParts.length >= 7) {
//                     let folder = folderParts[6];
//                     if (folder !== "inform.json") {
//                         try {
//                             // Adjust the URL to raw.githubusercontent.com to get the raw JSON file
//                             let songResponse = await fetch(`https://raw.githubusercontent.com/madhavg07/Music-Playstation/main/albums/${file}/${folder}/info.json`);
//                             if (!songResponse.ok) {
//                                 throw new Error(`HTTP error! Status: ${songResponse.status}`);
//                             }
//                             let songInfo = await songResponse.json();

//                             contentPlaylist.innerHTML += ` 
//                                 <div data-folder="${folder}" class="contentBox">
//                                     <div class="contentBoxDiv">
//                                         <div class="contentImgDiv">
//                                             <img class="contentImg" aria-hidden="false" draggable="false"
//                                                 src="https://raw.githubusercontent.com/madhavg07/Music-Playstation/main/albums/${file}/${folder}/cover.jpeg"
//                                                 data-testid="card-image" alt="">
//                                             <div class="playIcon">
//                                                 <button class="playButton">
//                                                     <svg class="playsvg" data-encore-id="icon" role="img"
//                                                         aria-hidden="true" viewBox="0 0 24 24"
//                                                         class="Svg-sc-ytk21e-0 bneLcE">
//                                                         <path
//                                                             d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
//                                                         </path>
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div class="infoContent flex">
//                                             <h4>${songInfo.title}</h4>
//                                             <div class="contentPara">${songInfo.description}</div>
//                                         </div>
//                                     </div>
//                                 </div>`;
//                         } catch (error) {
//                             console.error(`Error fetching song info for ${folder}:`, error);
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(`Error fetching album content for ${file}:`, error);
//     }
// }
async function displayAlbum(file) {
    let contentPlaylist = document.querySelector(`.contentPlaylist[data-folder="${file}"]`);

    try {
        // Fetch directory contents using GitHub API
        let response = await fetch(`https://api.github.com/repos/madhavg07/Music-Playstation/contents/albums/${file}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();

        for (let item of data) {
            if (item.type === 'dir' && item.name !== 'inform.json') {
                try {
                    // Fetch info.json from each directory
                    let songResponse = await fetch(`https://raw.githubusercontent.com/madhavg07/Music-Playstation/main/albums/${file}/${item.name}/info.json`);
                    if (!songResponse.ok) {
                        throw new Error(`HTTP error! Status: ${songResponse.status}`);
                    }
                    let songInfo = await songResponse.json();

                    contentPlaylist.innerHTML += `
                        <div data-folder="${item.name}" class="contentBox">
                            <div class="contentBoxDiv">
                                <div class="contentImgDiv">
                                    <img class="contentImg" aria-hidden="false" draggable="false"
                                        src="https://raw.githubusercontent.com/madhavg07/Music-Playstation/main/albums/${file}/${item.name}/cover.jpeg"
                                        data-testid="card-image" alt="">
                                    <div class="playIcon">
                                        <button class="playButton">
                                            <svg class="playsvg" data-encore-id="icon" role="img"
                                                aria-hidden="true" viewBox="0 0 24 24"
                                                class="Svg-sc-ytk21e-0 bneLcE">
                                                <path
                                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="infoContent flex">
                                    <h4>${songInfo.title}</h4>
                                    <div class="contentPara">${songInfo.description}</div>
                                </div>
                            </div>
                        </div>`;
                } catch (error) {
                    console.error(`Error fetching song info for ${item.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching album content for ${file}:`, error);
    }
}

async function displayAlbumFolder() {
    let contentPage = document.querySelector(".contentPage");
    const repoOwner = 'madhavg07';
    const repoName = 'Music-Playstation';
    const path = 'albums';

    try {
        // Fetch the contents of the albums directory using the GitHub API
        let response1 = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`);
        if (!response1.ok) {
            throw new Error(`HTTP error! Status: ${response1.status}`);
        }
        let data = await response1.json();

        for (let item of data) {
            if (item.type === 'dir') {
                let folder = item.name;
                try {
                    // Fetch inform.json from each album folder
                    let albumResponse = await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${path}/${folder}/inform.json`);
                    if (!albumResponse.ok) {
                        throw new Error(`HTTP error! Status: ${albumResponse.status}`);
                    }
                    let albumInfo = await albumResponse.json();

                    contentPage.innerHTML += `
                        <div class="spotifyPlaylist">
                            <section class="playlistBox">
                                <div class="discription flex">
                                    <a href="#">
                                        <div class="heading flex">${albumInfo.heading}</div>
                                    </a>
                                    <a href="#">
                                        <div class="seeAll flex">See All <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg></div>
                                    </a>
                                </div>
                                <div class="contentPlaylist flex" data-folder="${folder}">
                                </div>
                            </section>
                        </div>`

                    await displayAlbum(folder);
                } catch (error) {
                    console.error(`Error fetching album info for ${folder}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching album folders:', error);
    }
}

// async function displayAlbum(file) {
//     let contentPlaylist = document.querySelector(`.contentPlaylist[data-folder="${file}"]`);
//     try {
//         let response = await fetch(`https://github.com/madhavg07/Music-Playstation/tree/main/albums/${file}/`);
//         let htmlText = await response.text();
//         let div = document.createElement("div");
//         div.innerHTML = htmlText;
//         let anchors = Array.from(div.getElementsByTagName("a"));

//         for (let e of anchors) {
//             if (e.href.includes(`/${file}/`)) {
//                 console.log(e.href.split("/").slice(3));
//                 let folder = e.href.split("/").slice(3)[6];
//                 console.log(folder);
//                 if (folder !== "inform.json") {
//                     try {
//                         let songResponse = await fetch(`https://github.com/madhavg07/Music-Playstation/blob/main/albums/${file}/${folder}/info.json`);
//                         console.log(songResponse);
//                         let songInfo = await songResponse.json();
//                         console.log(songInfo);
//                         contentPlaylist.innerHTML += ` 
//                             <div data-folder="${folder}" class="contentBox">
//                                 <div class="contentBoxDiv">
//                                     <div class="contentImgDiv">
//                                         <img class="contentImg" aria-hidden="false" draggable="false"
//                                             src="/albums/${file}/${folder}/cover.jpeg"
//                                             data-testid="card-image" alt="">
//                                         <div class="playIcon">
//                                             <button class="playButton">
//                                                 <svg class="playsvg" data-encore-id="icon" role="img"
//                                                     aria-hidden="true" viewBox="0 0 24 24"
//                                                     class="Svg-sc-ytk21e-0 bneLcE">
//                                                     <path
//                                                         d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
//                                                     </path>
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div class="infoContent flex">
//                                         <h4>${songInfo.title}</h4>
//                                         <div class="contentPara">${songInfo.description}</div>
//                                     </div>
//                                 </div>
//                             </div>`;
//                     } catch (error) {
//                         console.error(`Error fetching song info for ${folder}:`, error);
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(`Error fetching album content for ${file}:`, error);
//     }
// }
// async function displayAlbumFolder() {
//     let contentPage = document.querySelector(".contentPage");
//     try {
//         let response1 = await fetch(`https://github.com/madhavg07/Music-Playstation/tree/main/albums/`);
//         let htmlText = await response1.text();

//         // Parse the HTML
//         let div = document.createElement("div");
//         div.innerHTML = htmlText;
//         let anchors = Array.from(div.getElementsByTagName("a"));
//         for (let i = 0; i < anchors.length; i += 2) {
//             let e = anchors[i];
//             if (e.href.includes("/albums/")) {
//                 console.log(e);
//                 let folderParts = e.href.split("/").slice(4);
//                 console.log(folderParts);
//                 if (folderParts.length >= 5) {
//                     let folder = folderParts[4];
//                     try {
//                         // Adjust the URL to raw.githubusercontent.com to get the raw JSON file
//                         let albumResponse = await fetch(`https://raw.githubusercontent.com/madhavg07/Music-Playstation/main/albums/${folder}/inform.json`);
//                         if (!albumResponse.ok) {
//                             throw new Error(`HTTP error! Status: ${albumResponse.status}`);
//                         }
//                         let albumInfo = await albumResponse.json();

//                         contentPage.innerHTML += ` 
//                             <div class="spotifyPlaylist">
//                                 <section class="playlistBox">
//                                     <div class="discription flex">
//                                         <a href="#">
//                                             <div class="heading flex">${albumInfo.heading}</div>
//                                         </a>
//                                         <a href="#">
//                                             <div class="seeAll flex">See All <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
//         <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//         <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//     </svg></div>
//                                         </a>
//                                     </div>
//                                     <div class="contentPlaylist flex" data-folder="${folder}">
//                                     </div>
//                                 </section>
//                             </div>`

//                         await displayAlbum(folder);
//                     } catch (error) {
//                         console.error(`Error fetching album info for ${folder}:`, error);
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching album folders:', error);
//     }
// }


// async function displayAlbumFolder() {
//     let contentPage = document.querySelector(".contentPage");
//     try {
//         let response1 = await fetch(`https://github.com/madhavg07/Music-Playstation/tree/main/albums/`);
//         console.log(response1);

//         let htmlText = await response1.text();
//         let div = document.createElement("div");
//         div.innerHTML = htmlText;
//         let anchors = Array.from(div.getElementsByTagName("a"));
//         for (let e of anchors) {
//             if (e.href.includes("/albums/")) {
//                 console.log(e.href.split("/").slice(4));
//                 let folder = e.href.split("/").slice(4)[4];
//                 try {
//                     console.log(folder);
//                     let albumResponse = await fetch(`https://github.com/madhavg07/Music-Playstation/blob/main/albums/${folder}/inform.json`);
//                     let albumInfo = await albumResponse.json();

//                     contentPage.innerHTML += ` 
//                         <div class="spotifyPlaylist">
//                             <section class="playlistBox">
//                                 <div class="discription flex">
//                                     <a href="#">
//                                         <div class="heading flex">${albumInfo.heading}</div>
//                                     </a>
//                                     <a href="#">
//                                         <div class="seeAll flex">See All <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
//     <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//     <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
// </svg></div>

//                                     </a>
//                                 </div>
//                                 <div class="contentPlaylist flex" data-folder="${folder}">
//                                 </div>
//                             </section>
//                         </div>`

//                     await displayAlbum(folder);
//                 } catch (error) {
//                     console.error(`Error fetching album info for ${folder}:`, error);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching album folders:', error);
//     }
// }

function playingCSS() {

    Array.from(document.querySelectorAll(".music")).forEach((f) => {

        if (currentSongHtml == f.querySelector(".songName").innerHTML) {
            currentPlayImage = f.querySelector(".playImage")
            currentPlayNow = f.querySelector(".playNow")

            f.style.backgroundColor = "rgb(54, 208, 255)";
            f.querySelector(".playNow").innerHTML = "Playing..."
            f.querySelector(".playNow").style.height = "13px"
            f.querySelector(".playNow").style.width = "45px"
            f.querySelector(".playImage").src = "img/pause.svg"
            // f.querySelector(".playNow").style.visibility = "visible"
            // f.querySelector(".playImage").style.visibility = "visible"
            // currentPlayNow.style.visibility = "hidden"
            // currentPlayImage.style.visibility = "hidden"
        }
        else {
            f.style.backgroundColor = "#242424";
            f.querySelector(".playNow").innerHTML = "Play Now"
            f.querySelector(".playNow").style.height = "25px"
            f.querySelector(".playNow").style.width = "22.22px"
            f.querySelector(".playImage").src = "img/play.svg"
            // f.querySelector(".playNow").style.visibility = "hidden"
            // f.querySelector(".playImage").style.visibility = "hidden"
        }

    })
}
function nextSong() {
    if (currentSong.currentTime === currentSong.duration) {
        if (currentSongIdx < songCount - 1) {
            currentSong.src = prevSongs[currentSongIdx + 1]
            currentSongIdx++;
        }
        else {
            currentSong.src = prevSongs[currentSongIdx]
        }
        setTimeout(() => {
            currentSong.play();
        }, 150);
        songInfo.innerHTML = songList[currentSongIdx];
        currentSongHtml = songInfo.innerHTML.slice(57)
        playy.src = "img/pause.svg";
        document.querySelector(".circle").style.left = 0 %
            playingCSS()
    }
}

async function main() {


    await displayAlbumFolder();
    currentSong.volume = 0.5;
    let contentBox = Array.from(document.querySelectorAll(".contentBox"))
    prevCont = contentBox[0].querySelector(".contentBoxDiv");
    contentBox.forEach((e) => {
        //console.log(e);

        e.addEventListener("click", async (item) => {
            //console.log(prevCont);
            prevCont.style.backgroundColor = "";
            prevCont = e.querySelector(".contentBoxDiv")
            prevCont.style.backgroundColor = "#3b3b3b"
            // console.log(e.parentElement.dataset.folder);
            let file = e.parentElement.dataset.folder
            // console.log(item, item.currentTarget.dataset.folder);
            if (prevSongs === songs) {
                prevSongs = songs;
            }

            songs = await getSongs(file, item.currentTarget.dataset.folder);
            document.querySelector(".left").style.left = "0%";
            // console.log(songs);
            let songUl = document.querySelector(".songcard").getElementsByTagName("ul")[0]
            //songUl.innerHTML = ""
            document.querySelector(".songlist").innerHTML = "";
            for (const song of songNameList) {
                if (song != "") {
                    songUl.innerHTML += `<li class="music flex">
                                                    <div class="musicImg flex">
                                                        <img src="img/music.svg" class="invert musiclogo" alt="">
                                                        <div class="songInfo">
                                                            <div class="songName">${song}</div>
                                                            <div class="songSinger">SoundTrack</div>
                                                        </div>
                                                    </div>
                                                    <div class="songPlay flex">
                                                        <div class="playNow">PLay Now</div>
                                                        <img src="img/play.svg" class="invert playImage" alt="play">
                                                        <div class="likeButton"><svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" >
    <path d="M2 12.5C2 11.3954 2.89543 10.5 4 10.5C5.65685 10.5 7 11.8431 7 13.5V17.5C7 19.1569 5.65685 20.5 4 20.5C2.89543 20.5 2 19.6046 2 18.5V12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15.4787 7.80626L15.2124 8.66634C14.9942 9.37111 14.8851 9.72349 14.969 10.0018C15.0369 10.2269 15.1859 10.421 15.389 10.5487C15.64 10.7065 16.0197 10.7065 16.7791 10.7065H17.1831C19.7532 10.7065 21.0382 10.7065 21.6452 11.4673C21.7145 11.5542 21.7762 11.6467 21.8296 11.7437C22.2965 12.5921 21.7657 13.7351 20.704 16.0211C19.7297 18.1189 19.2425 19.1678 18.338 19.7852C18.2505 19.8449 18.1605 19.9013 18.0683 19.9541C17.116 20.5 15.9362 20.5 13.5764 20.5H13.0646C10.2057 20.5 8.77628 20.5 7.88814 19.6395C7 18.7789 7 17.3939 7 14.6239V13.6503C7 12.1946 7 11.4668 7.25834 10.8006C7.51668 10.1344 8.01135 9.58664 9.00069 8.49112L13.0921 3.96056C13.1947 3.84694 13.246 3.79012 13.2913 3.75075C13.7135 3.38328 14.3652 3.42464 14.7344 3.84235C14.774 3.8871 14.8172 3.94991 14.9036 4.07554C15.0388 4.27205 15.1064 4.37031 15.1654 4.46765C15.6928 5.33913 15.8524 6.37436 15.6108 7.35715C15.5838 7.46692 15.5488 7.5801 15.4787 7.80626Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg></div>
                                                        
<div class="dislikeButton"><svg viewBox="0 0 24 24" width="24" height="24" color="#000000" >
    <path d="M2 11.5C2 12.6046 2.89543 13.5 4 13.5C5.65685 13.5 7 12.1569 7 10.5V6.5C7 4.84315 5.65685 3.5 4 3.5C2.89543 3.5 2 4.39543 2 5.5V11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15.4787 16.1937L15.2124 15.3337C14.9942 14.6289 14.8851 14.2765 14.969 13.9982C15.0369 13.7731 15.1859 13.579 15.389 13.4513C15.64 13.2935 16.0197 13.2935 16.7791 13.2935H17.1831C19.7532 13.2935 21.0382 13.2935 21.6452 12.5327C21.7145 12.4458 21.7762 12.3533 21.8296 12.2563C22.2965 11.4079 21.7657 10.2649 20.704 7.9789C19.7297 5.88111 19.2425 4.83222 18.338 4.21485C18.2505 4.15508 18.1605 4.0987 18.0683 4.04586C17.116 3.5 15.9362 3.5 13.5764 3.5H13.0646C10.2057 3.5 8.77628 3.5 7.88814 4.36053C7 5.22106 7 6.60607 7 9.37607V10.3497C7 11.8054 7 12.5332 7.25834 13.1994C7.51668 13.8656 8.01135 14.4134 9.00069 15.5089L13.0921 20.0394C13.1947 20.1531 13.246 20.2099 13.2913 20.2493C13.7135 20.6167 14.3652 20.5754 14.7344 20.1577C14.774 20.1129 14.8172 20.0501 14.9036 19.9245C15.0388 19.728 15.1064 19.6297 15.1654 19.5323C15.6928 18.6609 15.8524 17.6256 15.6108 16.6429C15.5838 16.5331 15.5488 16.4199 15.4787 16.1937Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg></div>
                                                        
                                                    </div>
                                                </li>`
                }
            }
            Array.from(document.querySelectorAll(".music")).forEach((f) => {
                f.querySelector(".likeButton svg").setAttribute("fill", "none");
                like = "color";
                f.querySelector(".dislikeButton svg").setAttribute("fill", "none");
                dislike = "none"
            }
            )
            playingCSS()
            currentPlayImage=Array.from(document.querySelectorAll(".music"))[0].querySelector(".playImage")
            function playCount() {
                i = 0;
                for (const song of songs) {
                    i++;
                }
                songCount = i;
            }
            function playMusic(str) {
                i = 0;
                for (const song of songs) {
                    songHTML = songNameList[i]
                    if (songHTML == str) {
                        currentSongHtml = songHTML;
                        currentSong.src = songs[i];
                        currentSong.play();


                        currentSong.addEventListener("timeupdate", () => {
                            console.log(currentSong.volume);
                            //console.log(currentSong.duration, currentSong.currentTime);
                            timing.innerHTML = `${timeDimention(currentSong.currentTime)}/ ${timeDimention(currentSong.duration)}`
                            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
                        })

                        currentSongIdx = i;
                        playbar.style.visibility = "visible"
                        playy.src = "img/pause.svg";
                        songInfo.innerHTML = songList[i];
                        document.querySelector(".seekBar").addEventListener("click", (e) => {
                            console.log(e.target.getBoundingClientRect(), e.offsetX, e.width);
                            document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
                            currentSong.currentTime = currentSong.duration * e.offsetX / e.target.getBoundingClientRect().width;
                            // timing.innerHTML=`${timeDimention(currentSong.duration*(e.offsetX/e.target.getBoundingClientRect().width))}/${timeDimention(currentSong.duration)}`
                        })
                    }
                    i++;
                }
                songCount = i;
            }
            //console.log(songList);

            //attach an event listener to each song
            Array.from(document.querySelector(".songcard").getElementsByTagName("li")).forEach(e => {

                e.addEventListener("click", () => {

                    console.log(e.querySelector(".songName").innerHTML);
                    //e.style.filter="invert(1)";

                    prevSongs = songs;
                    let i = 0
                    while (prevSongNameList[i]) {
                        prevSongNameList[i] = "";
                        i++;
                    }
                    i = 0
                    playCount();
                    while (i < songCount) {
                        prevSongNameList[i] = songNameList[i];
                        i++;
                    }
                    i = 0;
                    for (const song of prevSongNameList) {
                        songList[i] = `<img src="img/music.svg" class="invert musiclogo" alt="">` + song
                        i++;
                    }
                    Array.from(document.querySelector(".songcard").getElementsByClassName("music")).forEach(f => {
                        f.style.backgroundColor = "#242424";
                        // console.log(f);
                    })

                    playMusic(e.querySelector(".songName").innerHTML);
                    playingCSS()
                })
            })
            Array.from(document.querySelectorAll(".music")).forEach((f) => {
                f.querySelector(".likeButton").addEventListener("click", () => {
                    event.stopPropagation();
                    f.querySelector(".likeButton svg").setAttribute("fill", "white");
                    like = "color";
                    f.querySelector(".dislikeButton svg").setAttribute("fill", "none");
                    dislike = "none"
                    console.log(`like button is clicked`);
                });
                f.querySelector(".dislikeButton").addEventListener("click", () => {
                    event.stopPropagation();
                    f.querySelector(".dislikeButton svg").setAttribute("fill", "white");
                    dislike = "color"
                    f.querySelector(".likeButton svg").setAttribute("fill", "none");
                    like = "none"
                    console.log(`dislike button is clicked`);
                });
            });
            currentPlayImage.addEventListener("click", () => {
                if (currentSong.paused) {
                    currentSong.play();
                    playy.src = "img/pause.svg";
                    currentPlayImage.src = "img/pause.svg"
                }
                else {
                    currentSong.pause()
                    playy.src = "img/play.svg"
                    currentPlayImage.src = "img/play.svg"
                }
            })
        })

    })

    Array.from(document.querySelectorAll(".music")).forEach((f) => {
        f.addEventListener("active", () => {
            f.querySelector(".playNow").style.visibility = "visible"
            f.querySelector(".playImage").style.visibility = "visible"
        }
        )
    }
    )
    playy.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playy.src = "img/pause.svg";
            currentPlayImage.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            playy.src = "img/play.svg"
            currentPlayImage.src = "img/play.svg"
        }
    })
    
    prev.addEventListener("click", () => {
        //currentSong.pause();
        if (currentSongIdx != 0) {
            currentSong.src = prevSongs[currentSongIdx - 1]
            currentSongIdx--;
        }
        else {
            currentSong.src = prevSongs[currentSongIdx]
        }
        setTimeout(() => {
            currentSong.play();
        }, 150);
        songInfo.innerHTML = songList[currentSongIdx];
        currentSongHtml = songInfo.innerHTML.slice(57)
        playy.src = "img/pause.svg";
        playingCSS()


    })
    next.addEventListener("click", async () => {
        //currentSong.pause();
        if (currentSongIdx < songCount - 1) {
            currentSong.src = prevSongs[currentSongIdx + 1]
            currentSongIdx++;
        }
        else {
            currentSong.src = prevSongs[currentSongIdx]
        }
        setTimeout(() => {
            currentSong.play();
        }, 150);
        songInfo.innerHTML = songList[currentSongIdx];
        currentSongHtml = songInfo.innerHTML.slice(57)
        playy.src = "img/pause.svg";
        playingCSS()

    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })
    document.querySelector(".closeIcon").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-400%";
    })
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && (mutation.attributeName === 'style')) {
                nextSong();
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(document.querySelector(".circle"), {
        attributes: true, // Observe attribute changes
        attributeFilter: ['style'] // Only observe changes to the 'style' attribute
    });
    //add a listener to volume
    document.querySelector(".volLine").addEventListener("change", (e) => {
        console.log(e.target.value);
        currentvolume = currentSong.volume
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume == 0) {
            volumeIcon.src = "img/mute.svg"
        }
        else {
            volumeIcon.src = "img/volume.svg"
        }
    })
    volumeIcon.addEventListener("click", () => {

        if (currentSong.volume == 0) {
            volumeIcon.src = "img/volume.svg"
            currentSong.volume = currentvolume;
            document.querySelector(".volLine").value = currentvolume * 100;
        }
        else {
            volumeIcon.src = "img/mute.svg"
            let i = currentSong.volume
            currentvolume = i
            currentSong.volume = 0;
            document.querySelector(".volLine").value = 0;
        }
    })
    let spotifyPlaylist = Array.from(document.querySelectorAll(".spotifyPlaylist"))
    spotifyPlaylist.forEach((e) => {
        e.querySelector(".seeAll").addEventListener("click", () => {
            e.querySelector(".contentPlaylist").scrollBy({
                top: 100,
                left: 300,
                behavior: "smooth",
            });
        })
    })


}

main()