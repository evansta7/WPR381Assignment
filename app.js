var request = require('request');
var prompt = require('prompt');
var colors = require("colors/safe");
var SpotifyWebApi = require('spotify-web-api-node');
var term = require('terminal-kit').terminal;
var fs = require('fs');
var latestTweets = require('latest-tweets')


//Gets the latest tweets from Twitter
function getTweets(username){
  var count = 1;
  latestTweets(username, function (err, tweets) {
    if (err) throw err;
    tweets.forEach(element => {
      console.log('---------------------------------------------------------------------------------------------------------');      
      console.log('Tweet number: ' + count);
      console.log('---------------------------------------------------------------------------------------------------------');
      console.log('Username: ' + element.username);
      console.log('Fullname: ' + element.fullname);
      console.log('URL: ' + element.url);
      console.log('Content: ' + element.content);
      console.log('Date: ' + element.date);
      count++;
    });
  })
}

//Gets the song from the Spotify API
function getSong(songName)
{
  var spotifyApi = new SpotifyWebApi({
    clientId : '058c3c1f0924414886f5902a2d7edea8',
    clientSecret : '0db838f1ead34b1e8ae04769acdee98c'
  });
  async function initialize () {
    const token = await getToken()
    spotifyApi.setAccessToken(token)
  }
  async function getToken () {
    const result = await spotifyApi.clientCredentialsGrant()
    return result.body.access_token
  }

async function spotifyAPI(){
  await initialize();
  spotifyApi.searchTracks(songName, {limit:1})
  .then(function(data) {
    console.log('Artist Name: ' + data.body.tracks.items[0].album.artists[0].name);
    console.log('Song Name: ' + data.body.tracks.items[0].name);
    if (data.body.tracks.items[0].preview_url == null) {
      console.log("No preview URL available")
    }else{
      console.log('Preview URL: ' + data.body.tracks.items[0].preview_url);
    }
    console.log('Album Name: ' + data.body.tracks.items[0].album.name);
  }, function(err) {
    console.error(err);
  });
}
spotifyAPI();
}

//Shows the menu in the terminal menu
  term.green('Command Line Menu\n');
  term.green('--------------------------');
  var item = [
              'a. Print latest tweets',
              'b. Spotify Look-up',
              'c. OMDb search',
              'd. Query from textfile'
  ];
  //Shows the prompts needed for the menu selection
  term.singleColumnMenu(item, function(error, response){
    var schema = "";
    switch (response.selectedText) {
      case 'a. Print latest tweets':
      schema = {
        properties : {
          twitter: {
           message : colors.green("Please enter a twitter username")
          }
        }
      }
      //Creates a prompt for users to insert the twitter username
     prompt.start();
     prompt.get(schema, function (err, result) {
       getTweets(result.twitter)
     });
        break;
      case 'b. Spotify Look-up':
      schema = {
        properties : {
          song: {
           message : colors.green("Please enter a song name to search")
          }
        }
      }
      //Creates a prompt for users to insert the song name
     prompt.start();
     prompt.get(schema, function (err, result) {
       getSong(result.song);
     });
          break;
      case 'c. OMDb search':
      schema = {
        properties : {
          movie: {
            message : colors.green("Please enter a movie title to search")
          }
        }
      }
      //Prompts the user to enter the movie name
      prompt.start();
      prompt.get(schema, function (err, result) {
        getMovie(result.movie);
      });
            break;
      case 'd. Query from textfile':
      randomTextFile();
            break;    
    } 
  })

//Retrieves the movie from the OMDb API
  function getMovie(movieName){
  request('http://www.omdbapi.com/?r=json&t=' + movieName + '&apikey=228c4f7d', function (error, response, body) {
    var obj = JSON.parse(body);
    console.log('Title: ' + obj["Title"]);
    console.log('Year: ' + obj["Year"]);
    console.log('Rated: ' + obj["Rated"]);
    console.log('Language: ' + obj["Language"]);
    console.log('Release date: ' + obj["Released"]);
    console.log('Genre: ' + obj["Genre"]);
    console.log('Actors: '+ obj["Actors"]);
    console.log('Plot: '+ obj["Plot"]);
    console.log('IMDB Rating: ' + obj["imdbRating"]);
  });
}

 function randomTextFile(){
  fs.readFile("random.txt", async function(err, buf) {
    var results = buf.toString().split(',');
    getTweets(results[0]);
    getSong(results[1]);
    getMovie(results[2]);
  });
}