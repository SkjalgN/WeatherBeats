var express = require('express');
var router = express.Router();

// Visitor count

const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "ap-southeast-2",
});

const s3 = new AWS.S3(); 

const bucketName = "skjalgbucket"; 
const objectKey = "visitor-count.json"; 

let visitorCount = 0;

async function initializeVisitorCount() {
  const count = await getVisitorCountFromS3();
  visitorCount = count || 0;
  console.log("Visitor count initialized:", visitorCount);
}

async function getVisitorCountFromS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3.getObject(params).promise();
    const parsedData = JSON.parse(data.Body.toString("utf-8"));
    visitorCount = parsedData.count;


    console.log("Visitor count retrieved:", visitorCount);
    return visitorCount;
  } catch (err) {
    console.error("Error:", err);
  }
}

// Upload the visitor count to S3
async function uploadVisitorCountToS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify({ count: visitorCount }), // Convert count to JSON
    ContentType: "application/json", // Set content type
  };

  try {
    await s3.putObject(params).promise();
    console.log("Visitor count uploaded successfully.");
  } catch (err) {


    console.error("Error uploading visitor count:", err);
  }
}



// Example: Increment visitor count and update in S3
router.get("/increment", async function (req, res) {

});

module.exports = router;


router.get("/", async function (req, res) {
  initializeVisitorCount();
  visitorCount++; // Increment visitor count
  await uploadVisitorCountToS3(); // Update count in S3
  const count = await getVisitorCountFromS3();
  console.log(count);
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


      Promise.all([weatherDataPromise, videodataPromises, currentMonth, city, weatherpic, music, count])
        .then(([weatherData, videodata, month, city, weatherpic, music, count]) => {
          res.render('index', { title: 'WeatherBeats', videos: videodata, weather: weatherData, month: month, city: city, weatherpic: weatherpic, music: music, count: count});
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