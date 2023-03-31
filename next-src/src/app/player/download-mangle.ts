
// const downloads = [];


// async function downloadFiles(url, filename) {
//   // const res = await fetch(url, {
//   //   responseType: ResponseType.Binary
//   // });
//   // await writeBinaryFile("databases/assets/" + filename, new Uint8Array(res.data), { dir: BaseDirectory.App });
//   await invoke("downloadFile", { url, filename: assetsDir + "/" + filename })
//   existFileMap.add(filename)
// }

// let downloading = false;
// async function nextDownload() {
//   if (downloading) return;
//   downloading = true;
//   try {
//     let args = downloads.shift();
//     if (!args) return;
//     console.log(args);
//     await downloadFiles.apply(null, args);
//   } catch (error) {
//     console.log(error)
//   } finally {
//     downloading = false;
//   }

//   await new Promise(s => setTimeout(s), 10000)
//   nextDownload();
// }


// function getFileName(url) {
//   try {
//     let pathname = new URL(url).pathname;
//     let i = pathname.lastIndexOf("/");
//     if (i == -1) return url;
//     return pathname.substring(i + 1);
//   } catch (error) {
//     return url;
//   }
// }


// async function getRandomImages() {
//   const res = await fetch("https://wallhaven.cc/api/v1/search?sorting=random");

//   res.data.data.forEach(async v => {
//     let filename = `wallhaven-${v.id}.${await extname(getFileName(v.path))}`;
//     if (existFileMap.has(filename)) return;
//     downloads.push([v.path, filename])
//   });

//   nextDownload();
// }
// async function getVideos() {
//   if (!localStorage.pixabayPage) {
//     localStorage.pixabayPage = 1;
//   }
//   const res = await fetch("https://pixabay.com/api/videos/?key=&page=" + (localStorage.pixabayPage || 1));

//   res.data.hits.forEach(async v => {
//     let filename = `pixabay-${v.id}.${await extname(getFileName(v.videos.large.url))}`;
//     if (existFileMap.has((v.path))) return;
//     downloads.push([v.videos.large.url, filename])
//   })
//   localStorage.pixabayPage = parseInt(localStorage.pixabayPage) + 1;
//   nextDownload();
// }
