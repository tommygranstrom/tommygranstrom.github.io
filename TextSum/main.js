function appToSum(val){
    document.getElementById("summary").value += val;
}

function clearSum(){
    document.getElementById("summary").value ="";
}

function onSummarize(){
    clearSum();
    var vec = new Vectorizer(document.getElementById("txtin").value,3);
    appToSum(vec.summary);
}