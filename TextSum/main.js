
function appToSum(val){
    document.getElementById("summary").value += val;
}

function clearSum(){
    document.getElementById("summary").value ="";
}

function onSummarize(){
    clearSum();
    appToSum("Summarize function coming");
}