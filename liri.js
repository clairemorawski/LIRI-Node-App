//Read & Set Environment Variables
require("dotenv").config();

var fs = require('fs');
var keys = require("./keys");

//Create Spotify Variable
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
//prints spotify client id to console
console.log(process.env.SPOTIFY_ID);
//prints spotify client password to console
console.log(process.env.SPOTIFY_SECRET);

var action = process.argv[2].toLowerCase();
var request = (process.argv.slice(3).join("+")).toLowerCase();


var omdbKey = keys.omdb.api_key;

//Command: spotify-this-song
var spotifyThisSong = function (song) {
    //Default: "Go Your Own Way" by Fleetwood Mac
    if (!song) {
        song = "Go Your Own Way"
    }
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log(err)
        }
        var songInfo = data.tracks.items[0]
        outputData(songInfo.artists[0].name)
        outputData(songInfo.name)
        outputData(songInfo.preview_url)
        outputData(songInfo.album.name)
    })
}

//Command: movie-this
var movieThis = function (movie) {
    //Default: Beauty & The Beast
    if (!movie) {
        movie = "Beauty & The Beast"
    }

    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var movieInfo = JSON.parse(body)

            outputData("Title: " + movieInfo.Title)
            outputData("Release Year: " + movieInfo.Year)
            outputData("IMDB Rating: " + movieInfo.imdbRating)
            outputData("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            outputData("Country: " + movieInfo.Country)
            outputData("Language: " + movieInfo.Language)
            outputData("Plot: " + movieInfo.Plot)
            outputData("Actors: " + movieInfo.Actors)
        } else {
            console.log('Error occurred.')
        } if (movie === "Beauty & The Beast") {
            console.log("-----------------------");
            console.log("Please watch this movie.");
            console.log("It is a Disney Classic");
        }
    }

//Command: do-what-it-says
var doWhatItSays = function () {
        fs.readFile('./random.txt', "utf8", function (err, data) {
            if (err) {
                return console.log(err)
            }
            var dataArr = data.split(",")

            runAction(dataArr[0], dataArr[1])
        });

        var outputData = function (data) {
            console.log(data)

            fs.appendFile("./random.txt", "\r\n" + data, function (err) {
                if (err) {
                    return console.log(err)
                }
            })
        }

        var runAction = function (func, parm) {
            switch (func) {
                case "spotify-this-song":
                    spotifyThisSong(parm)
                    break
                case "movie-this":
                    movieThis(parm)
                    break
                case "do-what-it-says":
                    doWhatItSays(parm)
                    break
                default:
                    outputData("That command is not recognized. Please try again.")
            }
        }

        runAction;{process.argv[2], process.argv[3]},