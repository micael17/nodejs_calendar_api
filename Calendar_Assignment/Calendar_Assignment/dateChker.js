
//��¥ ó����(��)
exports.monthChk = function(month){
        //�� ó��
        if (month < 13 && month > 0) {            
        } else {
           return false;
        }    
    return true;
}


//��¥ ó����(��, ��)
exports.monthDayChk = function(month, day){
        //�� ó��
        if (month < 13 && month > 0) {            
        } else {
           return false;
        }    

        //�� ó��
        if (day < 32 && day > 0) {
        }else{
            return false;
        }            
    return true;
}


