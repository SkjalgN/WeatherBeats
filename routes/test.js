// YOUTUBE API
/*
const videodataPromises = fetch(YoutubeApiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const videos = data.items;
    const videoPromises = videos.map((video) => {
      const videoId = video.id.videoId;
      const videoTitle = video.snippet.title;
      const videoThumbnail = video.snippet.thumbnails.default.url;
      return { title: videoTitle, id: videoId, thumbnail: videoThumbnail };
    });
    return Promise.all(videoPromises);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
*/

Promise.all([weatherDataPromise /*, videodataPromises*/, currentMonth, city, weatherpic,music]) // Commented out videodataPromises
  .then(([weatherData, /*videodata,*/ month, city, weatherpic,music]) => {
    res.render('index', { title: 'Express', /*videos: videodata,*/ weather: weatherData, month: month, city: city, weatherpic: weatherpic ,music: music});
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


const videodataPromises = fetch(YoutubeApiUrl)
.then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
.then((data) => {
  const videos = data.items;
  const videoPromises = videos.map((video) => {
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    const videoThumbnail = video.snippet.thumbnails.default.url;
    return { title: videoTitle, id: videoId, thumbnail: videoThumbnail };
  });
  return Promise.all(videoPromises);
})
.catch((error) => {
  console.error('Error:', error);
});


Promise.all([weatherDataPromise , videodataPromises, currentMonth, city, weatherpic, music]) // Commented out videodataPromises
.then(([weatherData, videodata, month, city, weatherpic,music]) => {
  res.render('index', { title: 'Express', videos: videodata, weather: weatherData, month: month, city: city, weatherpic: weatherpic, music: music });
})
.catch((error) => {
  console.error('Error:', error);
});
});


const YoutubeApiKey = 'AIzaSyC9xhWzcvS4pqF14DFMntlDABUDjyGcsjo';
const openWeatherApiKey = 'a1b18af47376495368ad011abb3ac86e';