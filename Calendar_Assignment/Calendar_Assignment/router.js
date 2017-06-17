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
    

    // 월별 캘린더 확인       
    app.get('/calendar/month', function (req, res) {
    //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
    //##프론트엔드에서 해당 월의 시작 요일 처리. 백엔드에서는 해당 월의 전체 스케쥴 반환
        var month = req.query.month;
        var chk = dateChker.monthChk(month);
        if (chk) {
            if (month < 10) {
                month = '0' + month;
            }            

            //날짜 순으로 정렬하는 옵션
            var options = {
                sort: {
                    date: 1
                }
            };

            PrivateCalSchema.find({ date: { "$gte": new Date("2017-" + month + "-01T00:00:00.000Z"), "$lte": new Date("2017-" + month + "-31T24:00:00.000Z") } }, null, options, function (err, data) {
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
        var month = req.query.month;
        var day = req.query.day; 

        //컬럼ID 순으로 정렬하는 옵션
        var options = {
	        sort : {
                _id: 1
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
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;        
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
    app.delete('/calendar/delPrvSchedule', function (req, res) {

        //일정 삭제는 먼저 일정 리스트를 확인한 후, 리스트 중 하나를 선택하여 삭제하는 스토리로 가정한다.
        //일정 확인 시, 프론트엔드에 해당 일정들의 고유 id도 같이 넘겨진다.
        //삭제 시, 컬럼의 ID로 삭제한다.
        
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
        PrivateCalSchema.findByIdAndUpdate(id, { schedule : reSchedule }, function (err) {
            if (!err) {
                res.send('modify success');
            }
            else {
                res.send('error');
            }
        });

    });
}