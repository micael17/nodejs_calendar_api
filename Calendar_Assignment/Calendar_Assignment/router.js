module.exports = function (app, moment, dateChker) {

    //[Schema Setting]    
    var UserSchema = require('./models/userSchema');
    var PrivateCalSchema = require('./models/privateCalSchema');
    var PublicCalSchema = require('./models/publicCalSchema');
    var GroupSchema = require('./models/groupSchema');
    
    //[Module Setting]
    var moment = require('moment');
    var dateChker = require('./dateChker');
    
    
    // 홈 화면(오늘 일정 확인)
    app.get('/calendar', function (req, res) {

        //오늘 날짜를 JSON 형태로 반환한다.

        var date = {
            "year": moment().format('YYYY'),
            "month": moment().format('MMM'),
            "day": moment().format('Do')
        };
        
        var parsedDate = JSON.stringify(date);

        res.send(parsedDate);
    });
    
    // 년별 캘린더 확인       
    app.get('/calendar/year', function (req, res) {
    //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
    //##프론트엔드에서 해당 월의 시작 요일 처리. 백엔드에서는 해당 월의 전체 스케쥴 반환
        var year = req.query.year;

            //날짜 순으로 정렬하는 옵션
            var options = {
                sort: {
                    date: 1
                }
            };
        PrivateCalSchema.find({ start_time: { "$gte": new Date(year), "$lte": new Date(year + '-12-31') } }, null, options, 
            function (err, data) {
                if (data != null) {
                    res.send(data);
                } else {
                    res.send('err');
                }
            });
    });

    // 월별 캘린더 확인       
    app.get('/calendar/month', function (req, res) {
    //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
    //##프론트엔드에서 해당 월의 시작 요일 처리. 백엔드에서는 해당 월의 전체 스케쥴 반환
        
        var year = req.query.year;
        var month = req.query.month;
        
        //파라미터 확인
        if(year == null){
            res.send('year is null');
            return;
        }else if(month == null){
            res.send('month is null');
            return;
        }
        
        //해당 월과 다음 월 세팅(Date 쿼리를 위해 세팅한다.)
        if(Number(month) >= 12){
            var nextMonth = 1;
        }else{
            var nextMonth = Number(month)+1;
        }
        
        
        var chk = dateChker.monthChk(month);
        if (chk) {
            if (month < 10) {
                month = '0' + month;
            }            
            
            if(nextMonth < 10){
                nextMonth = '0'+nextMonth;
            }

            //날짜 순으로 정렬하는 옵션
            var options = {
                sort: {
                    start_time: 1
                }
            };
            console.log(month);
            console.log(nextMonth);
            
            var nextYear;
            if(nextMonth < month){
                nextYear = 2018;
            }else{
                nextYear = 2017;
            }
            
            PrivateCalSchema.find({start_time: { "$gte": new Date(year + '-' + month), "$lte" : new Date(nextYear + '-' + nextMonth)}}, null, options, function (err, data) {
                if (data != null) {
                    res.send(data);
                } else {
                    res.send('err');
                }
            });
            
        } else {
            res.send('error');
        }
    });
    
    

    // 해당 날짜(일) 일정 리스트 확인
    app.get('/calendar/chkSchedule', function (req, res) {
        //프론트엔드에서는 편하게 숫자로만 받는다. 
        //ex) 3, 14 (3월 14일)
        //백엔드에서 형식을 맞춰준다.
        
        var year = req.query.year;
        var month = req.query.month;
        var day = req.query.day; 
        
        //파라미터 확인
        if(year == null){
            res.send('year is null');
            return; 
        }else if(month == null){
            res.send('month is null');
            return;
        }else if(day == null){
            res.send('day is null');
            return;
        }

        //컬럼ID 순으로 정렬하는 옵션
        var options = {
	        sort : {
                _id: 1
	        }	
        };
        
        var chk = dateChker.monthChk(month, day);
    
        if (chk) {
            if(month < 10){
                month = '0'+month;
            }

            if(day < 10){
                day = '0'+day;
            }

            PrivateCalSchema.find({start_time : {"$gte": new Date(year+"-"+month+"-"+day+"T00:00:00.000Z"),"$lte": new Date(year+"-"+month+"-"+day+"T23:59:59.000Z")}}, null, options, function(err, data){
			    if(data != null){
				    res.send(data);
			    }else{
				    res.send('err');
			    }
		    });
        } else {
            res.send('error');
        }

    });

    // 개인 일정 추가
    app.post('/calendar/addPrvSchedule', function (req, res) {
        //프론트엔드에서는 편하게 숫자 또는 문자로만 받는다. 
        //ex) 3, 14, 13:00, 15:00 (3월 14일 13시00분 15시00분. 초 단위는 생략한다.)
        
        var year = req.body.year; 
        var month = req.body.month;
        var day = req.body.day;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var schedule = req.body.schedule;
        var isBirthday = req.body.isBirthday;
        
         //파라미터 확인
         switch(true){
            case (year == null) :
                res.send('year is null');
                return;
            case (month == null) :
                res.send('month is null');
                return;
            case (day == null) :
                res.send('month is null');
                return;
            case (startTime == null):
                res.send('startTime is null');
                return;
            case (endTime == null):
                console.log("switch");
                res.send('endTime is null');
                return;
            case (schedule == null):
                res.send('schedule is null');
                return;
            case (isBirthday == null):
                res.send('isBirthday is null');
                return;
         }
                
            
        
        
        var startArray = startTime.split(':');
        var endArray = endTime.split(':');
        
        if(Number(endArray[0]) < Number(startArray[0])){
            res.send('error. 일정의 마감시간은 시작시간보다 빠를 수 없습니다.');
            return;
        }
        /* 
        if(Number(startArray[0]) > 23){
            res.send('error. 시작시간은 최대 23시부터 가능합니다.');
        }
        */
        
        if(month < 10){
            month = '0'+month;
        }

        if(day < 10){
            day = '0'+day;
        }
        
         //프론트에서 받아온 데이터는 백엔드에서 ISODate 형식으로 맞춰준다. 초 단위는 생략한다.
        var modStartTime = year+'-'+month+'-'+day+'T'+startTime+':00.000Z';
        var modEndTime = year+'-'+month+'-'+day+'T'+endTime+':00.000Z';
        
        var chk = dateChker.monthDayChk(month, day);
        
        console.log(modEndTime);
        
        if (chk) {
            if(isBirthday == true){
                //생일일 경우 boolean으로 생일 여부를 저장한다.
                var privateCalSchema = new PrivateCalSchema({user_idx : '1', start_time : new Date(modStartTime), end_time : new Date(modEndTime), schedule : schedule, isBirthday : true});
                privateCalSchema.save();
            }else{
                var privateCalSchema = new PrivateCalSchema({user_idx : '1', start_time : new Date(modStartTime), end_time : new Date(modEndTime), schedule : schedule, isBirthday : false});
                privateCalSchema.save();
            }
        } else {
            res.send('error');
        }   
        
        res.end();
    });

    // 개인 일정 삭제
    app.delete('/calendar/delPrvSchedule', function (req, res) {

        //일정 삭제는 먼저 일정 리스트를 확인한 후, 리스트 중 하나를 선택하여 삭제하는 스토리로 가정한다.
        //일정 확인 시, 프론트엔드에 해당 일정들의 고유 id도 같이 넘겨진다.
        //삭제 시, 해당 일정의 고유 ID로 삭제한다.
        
        var id = req.body.id;

        PrivateCalSchema.remove({ _id: id }, function (err) {
            if (!err) {
                res.send('delete success');
            }
            else {
                res.send('error');
            }
        });
        
    });

    // 개인 일정 수정
    app.put('/calendar/modPrvSchedule', function (req, res) {

        //일정 수정은 먼저 일정 리스트를 확인한 후, 리스트 중 하나를 선택하여 수정하는 스토리로 가정한다.
        //일정 확인 시, 프론트엔드에 해당 일정들의 고유 id도 같이 넘겨진다.
        //수정 시, 컬럼의 ID로 조회하여 수정한다.

        var id = req.body.id;
        var reSchedule = req.body.schedule;
        var year = req.body.year; 
        var month = req.body.month;
        var day = req.body.day;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;    
        var isBirthday = req.body.isBirthday;
        
        //파라미터 확인
         switch(true){
             case (id == null) :
                res.send('id is null');
                return;
            case (year == null) :
                res.send('year is null');
                return;
            case (month == null) :
                res.send('month is null');
                return;
            case (day == null) :
                res.send('month is null');
                return;
            case (startTime == null):
                res.send('startTime is null');
                return;
            case (endTime == null):
                console.log("switch");
                res.send('endTime is null');
                return;
            case (reSchedule == null):
                res.send('schedule is null');
                return;
            case (isBirthday == null):
                res.send('isBirthday is null');
                return;
         }
        
        var startArray = startTime.split(':');
        var endArray = endTime.split(':');
        if(Number(endArray[0]) < Number(startArray[0])){
            res.send('error. 일정의 마감시간은 시작시간보다 빠를 수 없습니다.');
            return;
        }
        
        if(month < 10){
            month = '0'+month;
        }

        if(day < 10){
            day = '0'+day;
        }
        
        //프론트에서 받아온 데이터는 백엔드에서 ISODate 형식으로 맞춰준다. 초 단위는 생략한다.
        var modStartTime = year+'-'+month+'-'+day+'T'+startTime+':00.000Z';
        var modEndTime = year+'-'+month+'-'+day+'T'+endTime+':00.000Z';
        
        if(isBirthday == true){
            PrivateCalSchema.findByIdAndUpdate(id, { schedule : reSchedule,  start_time : new Date(modStartTime), end_time : new Date(modEndTime), isBirthday : true }, 
            function (err) {
                 if (!err) {
                    res.send('modify success');
                }
                else {
                    res.send('error');
                }
            });
        }else{
            PrivateCalSchema.findByIdAndUpdate(id, { schedule : reSchedule, start_time : new Date(modStartTime), end_time : new Date(modEndTime) }, 
            function (err) {
                 if (!err) {
                    res.send('modify success');
                }
                else {
                    res.send('error');
                }
            });
        }
    });
}