class PathElement{
    constructor(node,aT,dT,trId,rId){
        this.node = node;
        this.arrTime = aT;
        this.depTime = dT;
        this.tripId = trId;
        this.routeId = rId;
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
        this.calculatedPaths = [];
        this.maxTransfers = 0;
        this.maxnPaths = 0;
        this.keepSearch = true;
        this.calls = 0;
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
            
            if (this.foundPaths == 200){
                
                this.keepSearch = false;
            }
            var pathString = "---\n"
            // console.log("---");
            for(var i = 0;i<path.length;i++){
                pathString = pathString + this.patReq[path[i].node]['txtId'] + " "+path[i].arrTime+" "+path[i].depTime+"\n";
            }
            pathString = pathString + "---\n";
            // console.log("---");
            document.getElementById("outPutField").value += pathString;
            this.foundPaths = this.foundPaths +1;
        }else if(this.countUnique(routes)<this.maxTransfers){
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
        var path = new Array();
        var visited = new Array();
        for(var i = 0;i<this.nStops;i++){
            visited.push(false);
            this.blockTime.push(lastTime);
        }
        var routes = new Array();
        var t0 = new Date().getTime();
        this.allPathsUtil(start,destination,goTime,"","",path,visited,date,routes);
        var t1 = new Date().getTime();
        
        console.log(this.foundPaths+" paths found\n");
        var specs = "";
        specs= toString(this.foundPaths)+" paths found\n";
        console.log("Calculated in " + (t1 - t0)/1000 + " seconds.")
        //specs = specs +  "Calculated in " + toString((t1 - t0)/1000) + " seconds.\n";
        document.getElementById("specsoutPutField").value =specs;
    }
}


function startSearching(){
    g = new Graph();
    document.getElementById("outPutField").value = "";
    var start = parseInt(document.getElementById("start").value); //Stockholm
    var stop = parseInt(document.getElementById("end").value); //Uppsala
    var goDate = document.getElementById("goDate").value;
    var startTime = document.getElementById("goTime").value;
    var endTime =  document.getElementById("arrTime").value;
    var maxTransfers = document.getElementById("maxTrc").value;
    var maxnPaths = 200;
    g.allPaths(start,stop,goDate,startTime,endTime,maxTransfers,maxnPaths)
}
