var express = require('express');
var router = express.Router();

router.get("/", async function (req, res) {
  const YoutubeApiKey = 'AIzaSyC9xhWzcvS4pqF14DFMntlDABUDjyGcsjo';
  const openWeatherApiKey = 'a1b18af47376495368ad011abb3ac86e';
  const override = req.query.override || "";
  const city = req.query.city || 'Brisbane';

  const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`;

  // OPENWEATHER API
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  const weatherDataPromise = fetch(openWeatherApiUrl)

    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status 1: ${response.status}`);
      }
      return response.json();
    })
    .then((weatherData) => {
      console.log("--------------------")
      const temperature = (weatherData.main.temp - 273.15).toFixed(2);
      const description = weatherData.weather[0].description;

      const keywordData = {
        'clear': {
          music: 'Summer music',
          picture: 'images/Sunny.svg',
        },
        'christmas': {
          music: 'Christmas music',
          picture: 'images/Christmas.svg',
        },
        'spooky': {
          music: 'Spooky music',
          picture: 'images/Spooky.svg',
        },
        'love': {
          music: 'Love music',
          picture: 'images/Love.svg',
        },
        'rain': {
          music: 'Rainy day music',
          picture: 'images/Rainy.svg',
        },
        'cloud': {
          music: 'Cloudy music',
          picture: 'images/Cloudy.svg',
        },
        'snow': {
          music: 'Snowy music',
          picture: 'images/Snowy.svg',
        },
        'thunder': {
          music: 'Thunder ACDC',
          picture: 'images/Thunder.svg',
        },
      };

      var music = '';
      var weatherpic = '';
      console.log(keywordData);

      if (override) {
        music = keywordData[override].music;
        weatherpic = keywordData[override].picture;
      } else if (currentMonth == 'December') {
        music = 'Christmas music';
        weatherpic = 'images/Christmas.svg';
      } else if (currentMonth == 'October') {
        music = 'Spooky music';
        weatherpic = 'images/Spooky.svg';
      } else if (currentMonth == 'February') {
        music = 'Love music';
        weatherpic = 'images/Love.svg';
      } else if (description.includes('rain')) {
        music = keywordData['rain'].music;
        weatherpic = keywordData['rain'].picture;
      } else if (description.includes('cloud')) {
        music = keywordData['cloud'].music;
        weatherpic = keywordData['cloud'].picture;
      } else {
        music = 'Summer music';
        weatherpic = 'images/Sunny.svg';
      }


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
            const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
            return { title: videoTitle, id: videoId, thumbnail: videoThumbnail, link: youtubeLink};
          });
          return Promise.all(videoPromises);
        })
        .catch((error) => {
          console.error('Error:', error);
        });


      Promise.all([weatherDataPromise, videodataPromises, currentMonth, city, weatherpic, music])
        .then(([weatherData, videodata, month, city, weatherpic, music]) => {
          res.render('index', { title: 'WeatherBeats', videos: videodata, weather: weatherData, month: month, city: city, weatherpic: weatherpic, music: music });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      return { temperature, description, music, weatherpic };
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});



module.exports = router;