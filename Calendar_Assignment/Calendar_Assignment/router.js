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

        var date = {
            "year": moment().format('YYYY'),
            "month": moment().format('MMM'),
            "day": moment().format('Do')
        };

        var parsedDate = JSON.stringify(date);

        res.send(parsedDate);
    });
    

    // 월별 캘린더 확인       
    app.get('/calendar/month', function (req, res) {
    //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
    //##프론트엔드에서 해당 월의 시작 요일 처리. 백엔드에서는 월 반환
        var chk = dateChker.monthChk(req.params.month);
        if (chk) {
            res.send(res.params.month);
        } else {
            res.send('error');
        }
    });

    // 해당 날짜(일) 일정 리스트 확인
    app.get('/calendar/chkSchedule', function (req, res) {
        var month = req.query.month;
        var day = req.query.day; 
        var options = {
	        sort : {
		        _id : -1
	        }	
        };
        console.log('test');
        console.log(month, day);
        var chk = dateChker.monthChk(month, day);
    
        if (chk) {
            if(month < 10){
                month = '0'+month;
            }

            if(day < 10){
                day = '0'+day;
            }

            PrivateCalSchema.find({date : {"$gte": new Date("2017-"+month+"-"+day+"T00:00:00.000Z"),"$lte": new Date("2017-"+month+"-"+day+"T24:00:00.000Z")}}, null, options, function(err, data){
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
        var month = req.body.month;
        var day = req.body.day;
        

        var schedule = req.body.schedule;
        var isBirthday = req.body.isBirthday;
        
        var chk = dateChker.monthDayChk(month, day);


        if (chk) {
            if(isBirthday == true){            
                privateCalSchema = new PrivateCalSchema({user_idx : '1', date : new Date(2017, month - 1 , day + 1), schedule : 'My Birthday', isBirthday : true});
                privateCalSchema.save();
            }else{
                privateCalSchema = new PrivateCalSchema({user_idx : '1', date : new Date(2017, month - 1 , day + 1), schedule : schedule, isBirthday : false});
                privateCalSchema.save();
            }
        } else {
            res.send('error');
        }   
        
        res.end();
    });

    // 개인 일정 삭제
    app.delete('/api/books/:book_id', function (req, res) {
        res.end();
    });

    // 개인 일정 수정
    app.post('/api/books/:book_id', function (req, res) {
        res.end();
    });
}