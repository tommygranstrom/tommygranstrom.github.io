var nameArr;
var nNames;
var thunderAudio = new Audio('audio/thunderstruck.mp3');
function loadNames(){
    var input = document.getElementById("names").value;
    nameArr = input.split(",");
    document.getElementById("names").value = nameArr.length + " Names loaded";
    nNames = nameArr.length;
}
function newChallenge(){
    var challenge = getInt(100);
    if(challenge <25){
        //1Person får dricka klunkar
        personDrinks();
    }
    else if(challenge <50){
        //2Person får dela ut klunkar
        personGivesZips();
    }
    else if(challenge <65){
         //3Två personer drar kort
         twoPersonsDraw(); 
    }
    else if(challenge < 75){
        //6Nån blir nåns bitch
        sombodybebitch();
    }
    else if(challenge <85){
        //5Vattenfall
        waterfall();
    }
    else if(challenge < 90){
        //4Chippong
        chippong();
    }
    else if(challenge < 95){
        //7Temalek
        themename();
    }
    else if(challenge >=95){
        //8Thunderstruck
        thunderstrucks();
    }
}
function getPerson(){
    return nameArr[getInt(nNames-1)];
}
function personDrinks(){
    var personTodrink = getPerson();
    var nOfzips = getInt(8);
    document.getElementById("out").value = personTodrink + " drinks " + nOfzips + " sips";
}
function personGivesZips(){
    var personTodrink = getPerson();
    var nOfzips = getInt(8);
    document.getElementById("out").value = personTodrink + " gives anyone " + nOfzips + " sips to drink";
}
function twoPersonsDraw(){
    var p1 = getPerson();
    var p2 = getPerson();
    var nOfzips = getInt(8);
    document.getElementById("out").value = p1 + " and " + p2 + " each take a card. Lowest card drinks " + nOfzips + " sips";
}

function chippong(){
    var p1 = getPerson();
    document.getElementById("out").value = "Play Chippong!!, " + p1 + " starts";
}
function waterfall(){
    var personTodrink = getPerson();
    document.getElementById("out").value = personTodrink + " starts waterfall at a time he/she wishes to.";
}
function sombodybebitch(){
    var p1 = getPerson();
    var p2 = getPerson();
    document.getElementById("out").value = p1 + " is " + p2 +"s drinking bitch the upcoming 10 minutes";
}
function themename(){
    var the = ["Cars","Swedish cities", "Universities","Wine","Swedish Artists","Teachers at LIU","Course codes","Beers","Allswedish fotbaaal teams"];
    var theme = the[getInt(the.length-1)];
    var p1 = getPerson();
    document.getElementById("out").value = p1 +" starts the game of theme. The theme is: " + theme;
}
function thunderstrucks(){
    document.getElementById("out").value = "thnder";
    thunderAudio.play();
}
function getInt(max) {
	return Math.floor(Math.random() * (max + 1));
};
function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
