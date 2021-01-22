var validTime = true;
var destValid = true;
var startNodeIdx = 7;
var endNodeIdx = 9;

var calcPats = new Array();
var shortCalcPats = new Array();


class PathElement{
    constructor(node,aT,dT,trId,rId){
        this.node = node;
        this.arrTime = aT;
        this.depTime = dT;
        this.tripId = trId;
        this.routeId = rId;
    }
}
function appendToSpecs(val){
    document.getElementById("specsoutPutField").value = val;
}

var pathIsDisplayed = false;
var idDisplayed;
var hold = "";
var displayedContent = "";
function dispPath(ele){
    if(0<calcPats.length){
        var fullpathString = "";
        pt = calcPats[ele.value];
        var ptL = Object.keys(pt).length;
        for(var i = 0;i<ptL;i++){
            fullpathString = fullpathString + data[pt[i]['node']]['txtId'] + " "+pt[i]['arrTime']+" "+pt[i]['depTime']+"</br>";
        }

        var shortPathString = shortCalcPats[ele.value];
        if(ele.innerHTML == shortPathString){
            ele.innerHTML = fullpathString;
        }else{
            ele.innerHTML = shortPathString;
        }

    } 
}

function aut(vall){
    var cnt = 0;
    document.getElementById("datal").innerHTML="";
    if(2<vall.length){
        var i = 0;
        while (i<autoList.length){
            if (vall === autoList[i].slice(0,(vall.length))){
                var node = document.createElement("option"); 
                var val = document.createTextNode(autoList[i]); 
                node.appendChild(val); 
                document.getElementById("datal").appendChild(node);
                cnt = cnt + 1; 
            }
            if(cnt == 4){
                break;
            }
            i = i +1;
        }
    }
}

function autoFill(tmpIn){
    if(2<tmpIn.length){
        var i = 0;
        while (i<autoList.length){
            if (tmpIn === autoList[i].slice(0,(tmpIn.length))){
                appendToSpecs("did you mean: "+autoList[i]);
            }
            i = i +1;
        }
    }
}

function getIdx(tmpIn){
    var i = 0;
    while(i<autoList.length){
        if(tmpIn === autoList[i]){
            return i;
        }
        i = i+1;
    }
    return -1;
}

function checkDestinations(){
    var stNode = document.getElementById("start").value;
    var enNode = document.getElementById("end").value
    startNodeIdx = getIdx(stNode); 
    if(0<=startNodeIdx){
        // OK
        appendToSpecs("Travel from input valid");
        endNodeIdx = getIdx(enNode);
        if(0<=endNodeIdx){
            destValid = true;
            appendToSpecs("Travel to input valid");
            // OK
        }else{
            autoFill(enNode);
            destValid = false;
        }
    }else{
        autoFill(stNode);
        destValid = false;
    }
}

function checkTravelSpecs(){
    var startGoTime = document.getElementById("goTime").value;
    var endGoTime =  document.getElementById("arrTime").value;
    var startHomeTime = document.getElementById("goBackTime").value;
    var endHomeTime =  document.getElementById("arrTimeHome").value;
    if(compTime(startGoTime,endGoTime)){
        appendToSpecs("Input time is valid");
        if(compTime(endGoTime,startHomeTime)){
            if(compTime(startHomeTime,endHomeTime)){
                appendToSpecs("Input time is valid");
                validTime = true;
            }else{
                appendToSpecs("Cannot arrive before departure");
                validTime = false;
            }
        }else{
            appendToSpecs("Cannot go home before arrived");
            validTime = false;
        }
    }else{
        appendToSpecs("Cannot arrive before departure");
        validTime = false;
    }
}


function compTime(t1,t2){
    var time1 = t1.split(":");
    var time2 = t2.split(":");
    if (parseInt(time1[0])<parseInt(time2[0])){
        return true;
    }else if(parseInt(time1[0])==parseInt(time2[0]) && parseInt(time1[1])<parseInt(time2[1])){
        return true;
    }else{
        return false;
    }
}

class Graph{
    constructor(){
        //var fs = require('fs');
        this.nStops = 45265;
        this.foundPaths = 0;
        this.blockTime = new Array();
        this.searchDate = "";
        this.dates = dates;
        this.stops = stops;
        this.patReq = data;
        this.calculatedPaths = {};
        this.maxTransfers = 0;
        this.maxnPaths = 0;
        this.keepSearch = true;
        this.calls = 0;
        this.searchTime;
        this.firstDep = [];
    }

    checkServId(date,servId) {
        if(0<servId.length){
            var li = dates[servId]['dates'];
            var i = 0;
            while (i<li.length){
                if (date==li[i]){
                    return true;
                }
                i = i+1;
            }
        }
        return false;
    }
    checkIfInList(li,el){
        var i = 0;
        while(i<li.length){
            if(el == li[i]){
                return true;
            }
            i = i+1;
        }
        return false;
    }
    compTime(t1,t2){
        var time1 = t1.split(":");
        var time2 = t2.split(":");
        if (parseInt(time1[0])<parseInt(time2[0])){
            return true;
        }else if(parseInt(time1[0])==parseInt(time2[0]) && parseInt(time1[1])<parseInt(time2[1])){
            return true;
        }else{
            return false;
        }
    }
    countUnique(li){
        var tmp = new Array();
        for(var i = 0;i<li.length;i++){
            if(this.checkIfInList(tmp,li[i])==false){
                tmp.push(li[i]);
            }
        }
        return tmp.length
    }

    getOkChilds(parent,goTime,parentRoute,parentTripId,date){
        var tmp = new Array();
        var lines = this.patReq[parent];
        var childNodes = lines['childs'];
        var servId = lines['childSid'];
        var routeId = lines['childRouteId'];
        var tripId = lines['childTripId'];
        var depTimes = lines['depTime'];
        var arrTimes = lines['arrTime'];
        for(var i = 0;i<servId.length;i++){
            if (this.checkServId(date,servId[i])==true && this.compTime(arrTimes[i],this.blockTime[parseInt(stops[childNodes[i]]['idxId'])])==true){
                if(this.compTime(goTime,depTimes[i])==true){
                    if(this.checkIfInList(parentRoute,routeId[i])==true && parentTripId == tripId[i]){
                        tmp.push(new Array(childNodes[i],routeId[i],tripId[i],depTimes[i],arrTimes[i]));
                    }else if(this.checkIfInList(parentRoute,routeId[i])==false){
                        tmp.push(new Array(childNodes[i],routeId[i],tripId[i],depTimes[i],arrTimes[i]));
                    }
                }
            }
        }
        return tmp;
    }

    allPathsUtil(atNode,destination,goTime,routeId,tripId,path,visited,date,routes){
        path.push(new PathElement(atNode,goTime,"-",tripId,routeId));
        visited[atNode] = true;
        routes.push(routeId);
        
        if(atNode == destination){
            var ttt = {};
            //console.log("---");
            for(var i = 0; i<path.length;i++){
                ttt[i] = {'node':path[i].node,'arrTime':path[i].arrTime,'depTime':path[i].depTime};
            }
            this.calculatedPaths[this.foundPaths] = JSON.parse(JSON.stringify(ttt));
            this.foundPaths = this.foundPaths +1;
            
            if (this.foundPaths == 200){
                this.keepSearch = false;
            }
            
        }else if(this.countUnique(routes)<this.maxTransfers && atNode!=destination){
            var tmp = this.getOkChilds(atNode,goTime,routes,tripId,date);
            for(var i = 0;i<tmp.length;i++){
                if(visited[parseInt(stops[tmp[i][0]]['idxId'])]==false && this.keepSearch == true){ 
                    path[path.length-1].depTime = tmp[i][3];
                    var nBef = this.foundPaths;
                    this.allPathsUtil(stops[tmp[i][0]]['idxId'],destination,tmp[i][4],tmp[i][1],tmp[i][2],path,visited,date,routes);
                    var nAf = this.foundPaths;
                    var deltaPaths = nAf - nBef;
                    if(deltaPaths == 0){
                        this.blockTime[parseInt(stops[tmp[i][0]]['idxId'])] = tmp[i][4]
                    }
                }
            }
        }
        path.pop();
        routes.pop();
        visited[atNode] = false;
    }
    allPaths(start,destination,date,goTime,lastTime,maxT,nPaths){
        this.maxnPaths = nPaths;
        this.maxTransfers = maxT;
        var path = [];
        var visited = new Array();
        for(var i = 0;i<this.nStops;i++){
            visited.push(false);
            this.blockTime.push(lastTime);
        }
        var routes = new Array();
        var t0 = new Date().getTime();
        this.allPathsUtil(start,destination,goTime,"","",path,visited,date,routes);
        var t1 = new Date().getTime();

        console.log(start);
        console.log(" to ");
        console.log(destination);
        this.searchTime = (t1 - t0)/1000;
        console.log(this.foundPaths+" paths found\n");
        console.log("Calculated in " + (t1 - t0)/1000 + " seconds.")
        //specs = specs +  "Calculated in " + toString((t1 - t0)/1000) + " seconds.\n";
    }
}


function startSearching(){
    var pathIdx = 0;
    calcPats = new Array();
    shortCalcPats = new Array();
    while (document.getElementById("outgoing").firstChild) {
        document.getElementById("outgoing").removeChild(document.getElementById("outgoing").lastChild);
    }
    while (document.getElementById("ingoing").firstChild) {
        document.getElementById("ingoing").removeChild(document.getElementById("ingoing").lastChild);
    }
    var g = new Graph();
    var g2 = new Graph();
    if(destValid==true){
        if(validTime==true){
            var startGoTime = document.getElementById("goTime").value;
            var endGoTime =  document.getElementById("arrTime").value;
            var goDate =  document.getElementById("goDate").value;
            var maxTransfers = document.getElementById("maxTrc").value;
            var maxnPaths = 200;
            g.allPaths(startNodeIdx,endNodeIdx,goDate,startGoTime,endGoTime,maxTransfers,maxnPaths)
            for(var j = 0;j<g.foundPaths;j++){
               var tmpDiv = document.createElement("div");
               var tmpB = document.createElement("button");
               tmpB.className = "pathbutton";
               var pt = g.calculatedPaths[j];
               var ptL = Object.keys(pt).length
               calcPats.push(pt);
               tmpB.value = pathIdx;
               tmpB.id = toString(pathIdx);
               tmpB.onclick = function(){dispPath(this)};
               pathIdx = pathIdx+1;
               var btc = g.patReq[pt[0]['node']]['txtId'] + " - " + g.patReq[pt[ptL-1]['node']]['txtId']+"\n";
               btc = btc + pt[0]['depTime'] + " - " + pt[ptL-1]['arrTime'] + "\n";
               tmpB.innerHTML = btc; 
               shortCalcPats.push(btc);
               tmpDiv.appendChild(tmpB);
               document.getElementById("outgoing").appendChild(tmpDiv);
            }
            g.calculatedPaths = [];

            startGoTime = document.getElementById("goBackTime").value;
            endGoTime =  document.getElementById("arrTimeHome").value;
            g2.allPaths(endNodeIdx,startNodeIdx,goDate,startGoTime,endGoTime,maxTransfers,maxnPaths)
            for(var j = 0;j<g2.foundPaths;j++){
                    var tmpDiv = document.createElement("div");
                    var tmpB = document.createElement("button");
                    tmpB.className = "pathbutton";
                    pt = g2.calculatedPaths[j];
                    var ptL = Object.keys(pt).length
                    calcPats.push(pt);
                    tmpB.value = pathIdx;
                    tmpB.id = toString(pathIdx);
                    tmpB.onclick = function(){dispPath(this)};
                    pathIdx = pathIdx+1;
                    var btc = g2.patReq[pt[0]['node']]['txtId'] + " - " + g2.patReq[pt[ptL-1]['node']]['txtId']+"\n";
                    btc = btc + pt[0]['depTime'] + " - " + pt[ptL-1]['arrTime'] + "\n";
                    tmpB.innerHTML = btc;
                    shortCalcPats.push(btc);
                    tmpDiv.appendChild(tmpB);
                    document.getElementById("ingoing").appendChild(tmpDiv);   
        }
            g2.calculatedPaths = [];
            appendToSpecs(g.foundPaths+" go there paths found in "+ g.searchTime+" seconds\n" +g2.foundPaths+" go home paths found "+ g2.searchTime+" seconds\n");

        }else{
            appendToSpecs("Check time inputs");
        }
    }else{
        appendToSpecs("Check start and end stop");
    }
    //g.allPaths(start,stop,goDate,startTime,endTime,maxTransfers,maxnPaths)
}
