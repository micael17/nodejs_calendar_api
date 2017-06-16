
//朝楼 贸府扁(岿)
exports.monthChk = function(month){
        //岿 贸府
        if (month < 13 && month > 0) {            
        } else {
           return false;
        }    
    return true;
}


//朝楼 贸府扁(岿, 老)
exports.monthDayChk = function(month, day){
        //岿 贸府
        if (month < 13 && month > 0) {            
        } else {
           return false;
        }    

        //老 贸府
        if (day < 32 && day > 0) {
        }else{
            return false;
        }            
    return true;
}


