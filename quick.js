var fs = require('fs')
randomTextFile()
function randomTextFile(){
  fs.readFile("random.txt", function(err, buf) {
    var results = buf.toString().split('*');
    var twitter = results[1];
    var spotify = results[3];
    var omdb = results[5];
    console.log(omdb);
    //console.log(results)
  });
}

function textSpotify(spotify){
  
}