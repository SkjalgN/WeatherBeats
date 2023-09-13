var express = require('express');
var router = express.Router();

router.get("/", async function (req, res) {
  const YoutubeApiKey = 'AIzaSyC9xhWzcvS4pqF14DFMntlDABUDjyGcsjo';
  const openWeatherApiKey = 'a1b18af47376495368ad011abb3ac86e';
  var music = req.query.music || 'Summer music';
  var weatherpic = req.query.weatherpic || 'images/Sunny.svg';
  const city = req.query.city || 'Brisbane';

  const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`;

  // OPENWEATHER API
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  const weatherDataPromise = fetch(openWeatherApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((weatherData) => {
      const temperature = (weatherData.main.temp - 273.15).toFixed(2);
      const description = weatherData.weather[0].description;
      console.log(description);
      if (description.includes('rain')) {
        console.log('rain');
      }
      if (currentMonth == 'December') {
        music = 'christmas music';
        weatherpic = 'images/Christmas.svg';
      } else if (currentMonth == 'October') {
        music = 'spooky music';
        weatherpic = 'images/Spooky.svg';
      } else if (currentMonth == 'February') {
        music = 'love music';
        weatherpic = 'images/Love.svg';
      } else if (description.includes('rain')) {
        weatherpic = 'images/Rainy.svg';
        music = 'rainy day music';
      } else if (description.includes('cloud')) {
        weatherpic = 'images/Cloudy.svg';
        music = 'Cloudy music';
      } else if (description.includes('clear')) {
        weatherpic = 'images/Sunny.svg';
        music = 'Summer music';
      } else if (description.includes('snow')) {
        weatherpic = 'images/Snowy.svg';
        music = 'Snowy music';
      } else if (description.includes('thunder')) {
        weatherpic = 'images/Thunder.svg';
        music = 'Thunder ACDC';
      }
      const musicreq = music
      const weatherpicreq = weatherpic
      
      // YOUTUBE API

      const YoutubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YoutubeApiKey}&q=${music}&part=snippet&type=video&videoEmbeddable=true`;

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


      Promise.all([weatherDataPromise, videodataPromises, currentMonth, city, weatherpic, music]) // Commented out videodataPromises
        .then(([weatherData, videodata, month, city, weatherpic, music]) => {
          res.render('index', { title: 'Express', videos: videodata, weather: weatherData, month: month, city: city, weatherpic: weatherpic, music: music });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      return { temperature, description, musicreq, weatherpicreq };
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});



module.exports = router;