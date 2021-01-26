function setStopWords(val){
    if(val === "Swedish"){
        stopWords = swedishStopWords;
    }
    if(val === "English"){
        stopWords = englishStopWords;
    }
    if(val === "German"){
        stopWords = germanStopWords;
    }
    if(val === "Spanish"){
        stopWords = spanishhStopWords;
    }
}


function appToSum(val){
    document.getElementById("summary").value += val;
}

function clearSum(){
    document.getElementById("summary").value ="";
}

function onSummarize(){
    clearSum();
    if(stopWords.length>0){
    var vec = new Vectorizer(document.getElementById("txtin").value,3);
    appToSum(vec.summary);
    }else{
        appToSum("You need to select which language text is in")
    }
}