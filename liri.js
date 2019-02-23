require("dotenv").config();

// variable to access the keys.js file / for the api packages
var keys = require("./keys");
var spotify = require("./node_modules/spotify");
var axios = require("axios");
var fs = require ("fs");
var moment = require("moment");

//Global variables 

var appCommand = process.argv[2];
//console.log("appCommand: " + appCommand);
//will start with 3rd index
var userSearch = process.argv.slice(3).join("");
//console.log("userSearch: " + userSearch);


 // The switch will run by user input "appCommand/userSearch"
function liriRun(appCommand, uerSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsInTown(userSearch);
            break;

        case "movie-this":
            getOMBD(userSearch);
            break;

        case "do-what-it-says":
            getRandom();    


        default:
            console.log("Enter one of the following: 'spotify-this', 'concert-this', 'movie-this', 'do-what-it-says')
    }

//Spotify function//
function getSpotify(songName){
    var spotify = new spotify(keys.spotify);

    if (!songName) {
        songName = 'The Sign';

    };
}

spotify.search({ type: 'track', query: 'songName' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }

    //console.log("data for searched song: " + data.tracks.items[0]);
    //add line breaks
      console.log("==================================");
      console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
    //returns search results  
      console.log("Song Name:" + data.tracks.items[0].name + "r\n");
      console.log("Song Preview Link:" + data.tracks.items [0].href + "r/n");
      console.log("Album:" + data.tracks.items [0].album.name + "r/n");  


    //Appends info into log.txt file
    var logSong = "=====Begin Spotify Log Entry======" + "n\Artist: " + data.tracks.items[0].album.artist[0].name

    fs.appendFile("log.txt", logSong, function (err) {
        if (err) throw err;
    });

};

//Get Bands//
function getBandsInTown(artist) {

    var artist = userSearch;
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandQueryURL).then(
        function (response) {

        console.log("========================");
        console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
        console.log("Venue Location: " + response.data[0].venue.city + "r\n");
        console.log("Date of event: " + moment(response.data[0].datetime).format ("MM-DD-YY") + "r\n");   
            
        }
    )
}

//OMDB

function getOMDB(movie) {

    //default reponse with not user input
    if (!movie) {
        movie = "Mr. Nobody";

      var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
      
      axios.request(movieQueryUrl).then(
          function (response) {

        console.log("========================");
        console.log("* Title: " + response.data.Title + "\r\n");
        console.log("* Year Released: " + response.data.Year + "r\n");
        console.log("IMDB Rating:" + response.data.data.imbdRating + "\r\n");
        console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value  + "r\n");   
        console.log("* Country Where Produced: " + response.datta.Country + "\r\n");
        console.log("* Language: " + response.data.Language+ "r\n");
        console.log("* Plot: " + response.data.Plot + "r\n");
        console.log("* Actors:" + response.data.Actors + "\r\n");

        var logMovie = "=====Begin Movie Log Entry======" + "n\Movie title: " + response.data.Title + "\nYear release;
    
    }) 
}
}

function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            console.log(data);
            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);

        };

    })
}

function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) throw err;
    });
};


//call function//

liriRun(appCommand, userSearch);