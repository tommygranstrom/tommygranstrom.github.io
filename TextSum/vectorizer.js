class Vectorizer{
    isNotStopWord(param) {
        var i = 0;
        while(i<englishStopWords.length){
            if(param === englishStopWords[i]){
                return false;
            }
            i = i+1;
        }
        return true;   
    }

    makeFreq(dictionary,doc){
        var freqArr = new Array();
        for (var i = 0; i<dictionary.length;i++){
            var cnt = 0;
            for (var j = 0;j<doc.length;j++){
                if (dictionary[i] === doc[j]){
                    cnt = cnt + 1;
                }
            }
            freqArr.push(cnt);
        }
        return freqArr;
    }

    calcDiff(arr1,arr2){
        var pts = 0;
        for (var i = 0;i<arr1.length;i++){
            pts  = pts + Math.abs(arr1[i]-arr2[i]);
        }
        return pts;
    }

    constructor(text,sl){
        this.plainTextSents = text.split(". ");
        this.textSents = new Array();
        var tmpdict = new Set();
        var tmp1 = text.split(". ");
        for(var i = 0;i<tmp1.length;i++){
            var tmp2 = tmp1[i].split(" ");
            for(var j = 0;j<tmp2.length;j++){
                tmp2[j] = tmp2[j].replace(/[^a-zA-Z ]/g, "");
                tmp2[j] = tmp2[j].toLowerCase();
                if(this.isNotStopWord(tmp2[j])){
                    tmpdict.add(tmp2[j]);
                }
            }
            this.textSents.push(tmp2);
        }
        this.dictionary = Array.from(tmpdict);
        //Create frequency vectors
        this.freqArrs = new Array();
        for (var i = 0; i<this.textSents.length;i++){
            this.freqArrs.push(this.makeFreq(this.dictionary,this.textSents[i]));
        }

        this.scoreArr = new Array();
        for(var i = 0;i<this.freqArrs.length;i++){
            var scr = 0;
            for(var j = 0; j<this.freqArrs.length;j++){
                scr = scr + this.calcDiff(this.freqArrs[i],this.freqArrs[j]);
            }
            this.scoreArr.push([[this.plainTextSents[i]],scr]);
        }

        this.scoreArr.sort((a, b) => b[1].toString().localeCompare(a[1].toString()));
        
        this.summary = "";

        if(sl>this.scoreArr.length){
            var ll = this.scoreArr.length;
        }else{
            var ll = sl;
        }
        for(var i = 0;i<ll;i++){
            this.summary = this.summary + this.scoreArr[i][0] + ". ";
        }

    }

    
}