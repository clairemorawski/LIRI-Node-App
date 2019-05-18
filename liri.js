//Read & Set Environment Variables
require('dotenv').config();
//Dependencies
var fs = require('fs');
var keys = require('./keys');

//Create Spotify Variable
//spotfiy=constructor/class
var Spotify = require('node-spotify-api');
//request api
var request = require('request');
//var spotify = new Spotify(keys.spotify);
//Request:
var nodeArgs = process.argv;
//Action
var action = process.argv[2];

//LOGIC
if (action === 'spotify-this-song') {
    //run spotify function
    runSpotify();
} else if (action === 'movie-this') {
    //run omdb function
    runOMDB();
} else if (action === 'do-what-it-says') {
    //run function
    runTxt();
}

//grab input from user with a function
function getInput() {
    //run for-loop to grab all elements after 3rd place in array
    var input = '';
    //if (input === '') {
    //input = 'Go Your Own Way';
    // }
    for (var i = 3; i < nodeArgs.length; i++) {
        input += process.argv[i] + ' ';
    }
    return input;
}

function runSpotify(randomTextContent) {
    //get spotify keys
    var sKeys = keys.spotify;
    var spotify = new Spotify(sKeys);
    var input;
    if (!randomTextContent) {
        input = getInput();
    } else {
        input = randomTextContent;
    }
    //prints input to console
    console.log(input);

    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo =
            'Artist Name: ' +
            data.tracks.items[0].artists[0].name +
            '\n' +
            'Song Name: ' +
            data.tracks.items[0].name +
            '\n' +
            'Spotify URL: ' +
            data.tracks.items[0].external_urls.spotify +
            '\n' +
            'Album Name: ' + data.tracks.items[0].album.name;
        console.log(songInfo);

        //Bonus: append to log.txt
        fs.appendFile('log.txt', '\n' + songInfo + '\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function runOMDB(textCommand) {
    //grab input from user with a function
    var input = getInput();
    var omdbKey = keys.omdb.api_key;
    var queryUrl =
        'http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=' + omdbKey;
    if (input === '') {
        input = 'Mr. Nobody';
    }

    //Ratings
    request(queryUrl, function (error, response, body) {
        //Rotten Tomatoes
        if (!error && response.statusCode === 200) {
            var rottenTomatoes = '';

            var rtData = JSON.parse(body).Ratings.find(rating => rating.Source === 'Rotten Tomatoes'
            );

            if (rtData) {
                rottenTomatoes += 'Rotten Tomatoes: ' + rtData.Value + '\n';
            }

            //Print this information about the user's input:
            var movieInfo =
                '\n' +
                'Title: ' +
                JSON.parse(body).Title +
                '\n' +
                'Release Year: ' +
                JSON.parse(body).Year +
                '\n' +
                'IMDB Rating: ' +
                JSON.parse(body).imdbRating +
                '\n' +
                rottenTomatoes +
                'Country: ' +
                JSON.parse(body).Country +
                '\n' +
                'Language: ' +
                JSON.parse(body).Language +
                '\n' +
                'Plot: ' +
                JSON.parse(body).Plot +
                '\n' +
                'Actors: ' +
                JSON.parse(body).Actors +
                '\n';
            console.log(movieInfo);
        }
        //Bonus: append to log.txt
        fs.appendFile('log.txt', '\n' + movieInfo + '\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
    function runTxt() {
        fs.readFile('random.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var randomTextContent = data.split(',');

            if (randomTextContent[0] === 'spotify-this-song') {
                //run spotify function
                runSpotify(randomTextContent[1]);
            } else if (randomTextContent[0] === 'movie-this') {
                //run OMDB function
                runOMDB(randomTextContent[1]);
            }
        });
    }
}