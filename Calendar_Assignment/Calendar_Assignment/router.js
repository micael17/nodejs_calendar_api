module.exports = function (app, moment, dateChker) {
    
    /*
     * [가정]
     * 본 과제에서는 사용자별 ID 관리 및 로그인 과정이 없으므로 생략한다.
     * 이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
     * 또한 해당 유저의 DB ID를 클라이언트에서 이미 알고 있다고 가정한다.
     * 따라서 서버로 넘어오는 요청 중 사용자의 ID가 필요한 경우라면 해당 ID가 자동으로 파라미터에 담겨서 요청된다고 가정한다.
     */

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
    
    // 년별 캘린더 확인 (스토리 외. 테스트 용)
    app.get('/calendar/year', function (req, res) {
    //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
    //##프론트엔드에서 해당 월의 시작 요일 처리. 백엔드에서는 해당 월의 전체 스케쥴 반환
    
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.query.userDbId;
        var year = req.query.year;
        
        if(userDbId == null){
            res.send('user db id is null');
            return;
        }else if(year == null){
            res.send('year is null');
            return;
        }

            //날짜 순으로 정렬하는 옵션
            var options = {
                sort: {
                    date: 1
                }
            };
            
        PrivateCalSchema.find({user_db_id : userDbId, start_time: { "$gte": new Date(year), "$lte": new Date(year + '-12-31') } }, null, options, 
            function (err, prvData) {
                
                if(prvData.length > 0){
                    //유저가 등록한 그룹 id 조회
                    UserSchema.find({ _id : userDbId}, {_id : 0, group_id : 1}, 
                        function(err, getGroupData){   
                            if(getGroupData.length > 0){
                                //res.send(getGroupData);
                                var tempGroupId = getGroupData[0].group_id;
                                
                                     //해당 그룹id를 가진 pubCal 조회
                                     PublicCalSchema.find({group_id : tempGroupId, start_time: { "$gte": new Date(year), "$lte": new Date(year + '-12-31') }}, 
                                        function(err, pubData){
                                            
                                            //개인 일정과 그룹 일정을 담을 배열 생성
                                            //프론트엔드에서는 배열의 번호로 개인일정과 그룹일정을 식별할 수 있다.
                                            var tempArray = [];
                                            tempArray[0] = prvData;
                                            tempArray[1] = pubData;
                                            
                                            // 개인일정 또는 그룹일정 데이터가 있다면
                                            if(prvData.length > 0 || pubData.length > 0 ){    
                                                res.send(tempArray);
                                            }else{
                                                res.send('none');
                                            }
                                        });
                            }else{
                                 res.send('private ^' + '\r' + prvData);
                            }
                    });
                }else{
                    res.send('no match user or data');
                }
            });
            
    });

    // 월별 캘린더 확인       
    app.get('/calendar/month', function (req, res) {
    //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
    //##프론트엔드에서 해당 월의 시작 요일 처리. 백엔드에서는 해당 월의 전체 스케쥴 반환
        
        var year = req.query.year;
        var month = req.query.month;
        
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.query.userDbId;
        
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
            
            PrivateCalSchema.find({user_db_id : userDbId, start_time: { "$gte": new Date(year + '-' + month), "$lte" : new Date(nextYear + '-' + nextMonth)}}, null, options,
            function (err, prvData) {
                
                if(prvData.length > 0){
                    //유저가 등록한 그룹 id 조회
                    UserSchema.find({ _id : userDbId}, {_id : 0, group_id : 1}, 
                        function(err, getGroupdata){
                            var tempGroupId = getGroupdata[0].group_id;
                            console.log(tempGroupId);
                            
                                 //해당 그룹id를 가진 pubCal 조회
                                 PublicCalSchema.find({group_id : tempGroupId, start_time : { "$gte": new Date(year + '-' + month), "$lte" : new Date(nextYear + '-' + nextMonth)}}, 
                                    function(err, pubData){
                                        //개인 일정과 그룹 일정을 담을 배열 생성
                                        //프론트엔드에서는 배열의 번호로 개인일정과 그룹일정을 식별할 수 있다.
                                        var tempArray = [];
                                        tempArray[0] = prvData;
                                        tempArray[1] = pubData;
                                        
                                        // 개인일정 또는 그룹일정 데이터가 있다면
                                        if(prvData.length > 0 || pubData.length > 0 ){    
                                            res.send(tempArray);
                                        }else{
                                            res.send('none');
                                        }
                                    });
                    });
                }else{
                    res.send('no match user or data');
                }
            });
            
        } else {
            res.send('date error');
        }
    });
    
    

    // 해당 날짜(일) 일정 리스트 확인
    app.get('/calendar/day', function (req, res) {
        //프론트엔드에서는 편하게 숫자로만 받는다. 
        //ex) 3, 14 (3월 14일)
        //백엔드에서 형식을 맞춰준다.
        
        var year = req.query.year;
        var month = req.query.month;
        var day = req.query.day; 
        
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.body.userDbId;
        
        
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
        }else if(userDbId == null){
            res.send('user db id is null');
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

		    
		    PrivateCalSchema.find({user_db_id : userDbId, start_time: { "$gte": new Date(year+"-"+month+"-"+day+"T00:00:00.000Z"), "$lte" : new Date(year+"-"+month+"-"+day+"T23:59:59.000Z")}}, null, options,
            function (err, prvData) {
                
                if(prvData.length > 0){
                    //유저가 등록한 그룹 id 조회
                    UserSchema.find({ _id : userDbId}, {_id : 0, group_id : 1}, 
                        function(err, getGroupdata){
                            var tempGroupId = getGroupdata[0].group_id;
                            console.log(tempGroupId);
                            
                                 //해당 그룹id를 가진 pubCal 조회
                                 PublicCalSchema.find({group_id : tempGroupId, start_time : { "$gte": new Date(year+"-"+month+"-"+day+"T00:00:00.000Z"), "$lte" : new Date(year+"-"+month+"-"+day+"T23:59:59.000Z")}}, 
                                    function(err, pubData){
                                        //개인 일정과 그룹 일정을 담을 배열 생성
                                        //프론트엔드에서는 배열의 번호로 개인일정과 그룹일정을 식별할 수 있다.
                                        var tempArray = [];
                                        tempArray[0] = prvData;
                                        tempArray[1] = pubData;
                                        
                                        // 개인일정 또는 그룹일정 데이터가 있다면
                                        if(prvData.length > 0 || pubData.length > 0 ){    
                                            res.send(tempArray);
                                        }else{
                                            res.send('none');
                                        }
                                    });
                    });
                }else{
                    res.send('no match user or data');
                }
            });
        } else {
            res.send('date error');
        }

    });

    // 개인 일정 추가 (일반 일정 또는 생일 추가)
    app.post('/calendar/addPrvSchedule', function (req, res) {
        //프론트엔드에서는 편하게 숫자 또는 문자로만 받는다. 
        //ex) 3, 14, 13:00, 15:00 (3월 14일 13시00분 15시00분. 초 단위는 생략한다.)
        
        //var userDbId = req.body.userId;
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.body.userDbId;
        
        var year = req.body.year; 
        var month = req.body.month;
        var day = req.body.day;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var schedule = req.body.schedule;
        var isBirthday = req.body.isBirthday;
        
         //파라미터 확인
         //보통 다음과 같은 switch문에 true를 쓰는 것은 적합한 쓰임새는 아니지만, 체크할 사항이 많아서 가독성을 위해 사용했다.
         //일반적으로 입력 체크는 프론트엔드에서 하지만, 그냥 해봤다.
         switch(true){
            case (userDbId == null) :
                res.send('user is null');
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
                //주의 !!! 절대로 유저 id 입력을 틀리지 말것. 현재 예제에서는 무결성 확인을 할 수 없으니 꼭 정확히 입력할것.
                var privateCalSchema = new PrivateCalSchema({user_db_id : userDbId, start_time : new Date(modStartTime), end_time : new Date(modEndTime), schedule : schedule, isBirthday : true});
                privateCalSchema.save();
            }else{
                var privateCalSchema = new PrivateCalSchema({user_db_id : userDbId, start_time : new Date(modStartTime), end_time : new Date(modEndTime), schedule : schedule, isBirthday : false});
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
        
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.body.userDbId;
        
        if(id == null){
            res.send('schedule id is null');
            return;
        }else if(userDbId == null){
            res.send('user id is null');
            return;
        }

        PrivateCalSchema.remove({ _id: id, user_db_id: userDbId }, function (err, data) {
            if(data != null){
                res.send('delete success');
            }
            else if (data == null) {
                res.send('no match user or data');
            }else {
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
        
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.body.userDbId;
        
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
            PrivateCalSchema.findOneAndUpdate({_id : id, user_db_id : userDbId}, { schedule : reSchedule,  start_time : new Date(modStartTime), end_time : new Date(modEndTime), isBirthday : true }, 
            function (err, data) {
                if(data == null){
                    res.send('there is no match data or user');
                }else if (!err) {
                    res.send('modify success');
                }else {
                    res.send('error');
                }
            });
        }else{
            PrivateCalSchema.findOneAndUpdate({_id : id, user_db_id : userDbId}, { schedule : reSchedule, start_time : new Date(modStartTime), end_time : new Date(modEndTime) }, 
            function (err, data) {
                if(data == null){
                    res.send('there is no match data or user');
                }else if (!err) {
                    res.send('modify success');
                }else {
                    res.send('error');
                }
            });
        }
    });
    
    //캘린더 그룹 생성
    app.post('/calendar/createGroup', function(req, res){
        var groupName = req.body.groupName;
        var userDbId = req.body.userDbId;
        
        if(groupName == null){
            res.send('err group name is null');
            return;
        }else if(userDbId == null){
            res.send('err user db id is null');
            return;
        }
        // 주의!! 유저 ID는 절대 틀려서는 안된다. 이 예제는 무결성 확인이 불가능하다.
        var groupSchema = new GroupSchema({group_name : groupName, user_db_id : userDbId});
        groupSchema.save();
        
        res.end();
    });
    
    //사용자는 전체 캘린더 그룹 리스트를 볼 수 있다
    app.get('/calendar/showGroupList', function(req, res){
        
        GroupSchema.find(
            function(err, data){
                if(data.length > 0){
				    res.send(data);
			    }else{
				    res.send('no data');
			    }
            });
    });
    
    //사용자는 자신이 생성한 캘린더 그룹을 삭제 할 수 있다
    app.delete('/calendar/delGroup', function(req, res){
        
        /*
         * 사용자의 ID와 DB에서의 사용자 컬럼 ID로 그룹을 삭제한다.
         * 프론트엔드에서는 사용자가 자신이 생성한 그룹 리스트를 볼 수 있는 화면이 있다고 가정한다.
         * 따라서 그 화면에서 특정 그룹을 선택하여 삭제 명령을 내리면 이 api가 실행된다고 가정한다.
         */
        
        var groupId = req.body.groupId;
        
        //이 캘린더는 유저가 이미 로그인을 했다고 가정한다.
        //유저의 DB ID는 다음과 같다고 가정한다.
        var userDbId = req.body.userDbId;
        
        if(groupId == null){
            res.send('err group Id is null');
            return;
        }else if(userDbId == null){
            res.send('err user db id is null');
            return;
        }
        
         GroupSchema.remove({ _id: groupId, user_db_id : userDbId }, function (err, data) {
             console.log(data.result.n);
            if(data.result.n > 0){
                res.send('delete success');
            }else if(data.result.n == 0){
                res.send('there is no match group or user id');
            }else {
                res.send('error');
            }
        });
    });
    
    //사용자는 자신이 생성한 캘린더 그룹 이름을 수정 할 수 있다
    app.put('/calendar/modGroup', function(req, res){
        
        /*
         * DB에서의 사용자 컬럼 ID와 그룹 ID로 그룹을 삭제한다. 
         */
         
        var userDbId = req.body.userDbId;
        var groupId = req.body.groupId;
        var reName = req.body.reName;
        
        if(groupId == null){
            res.send('err group id is null');
            return;
        }else if(userDbId == null){
            res.send('err user db id is null');
            return;
        }else if(reName == null){
            res.send('err rename is null');
            return;
        }
        
        GroupSchema.findOneAndUpdate({ _id : groupId, user_db_id : userDbId}, { group_name : reName },  function(err, data){
            if(data == null){
                res.send('there is no match data');
            }else if(!err){
                res.send('update success');
            }else{
                res.send('update err');
            }
        });
    });

    //사용자는 캘린더 그룹에 일정을 추가할 수 있다
    app.post('/calendar/addGroupSchedule', function(req, res){
        
        //프론트엔드에서는 편하게 숫자 또는 문자로만 받는다. 
        //ex) 3, 14, 13:00, 15:00 (3월 14일 13시00분 15시00분. 초 단위는 생략한다.)
        
        var groupId = req.body.groupId;
        var year = req.body.year;
        var month = req.body.month;
        var day = req.body.day;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var schedule = req.body.schedule;
        var userDbId = req.body.userDbId;
        
        if(groupId == null){
            res.send('err group id is null');
            return;
        }else if(year == null){
            res.send('err year is null');
            return;
        }else if(month == null){
            res.send('err month is null');
            return;
        }else if(day == null){
            res.send('err day is null');
            return;
        }else if(startTime == null){
            res.send('err startTime is null');
            return;
        }else if(endTime == null){
            res.send('err endTime is null');
            return;
        }else if(schedule == null){
            res.send('err schedule is null');
            return;
        }else if(userDbId == null){
            res.send('err userDbId is null');
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
        
        var chk = dateChker.monthDayChk(month, day);
        
        console.log(modEndTime);
        
        if (chk) {
            //주의!! 그룹ID와 사용자DB ID는 절대 틀리면 안된다.
            var publicCal = new PublicCalSchema({user_db_id : userDbId, group_id : groupId, start_time : new Date(modStartTime), end_time : new Date(modEndTime), schedule : schedule});
            publicCal.save();
        }else{
            res.send('date chk err');
        }
        res.end();
        
    });
    
    //캘린더 그룹별 일정 확인
    app.get('/calendar/chkGroupSchedule', function(req, res){
        var groupId = req.query.groupId;
        
        if(groupId == null){
            res.send('err group id is null');
            return;
        }
        
        PublicCalSchema.find({ group_id : groupId}, function(err, data){
            if(data.length > 0){
                res.send(data);
            }else{
                res.send('no data found');
            }
        });
    })

    //사용자는 자신의 캘린더에 표시할 캘린더 그룹을 선택할 수 있다 (1. 추가)
    app.put('/calendar/selectMyGroup', function(req, res){
        var userDbId = req.body.userDbId;
        
        //클라이언트에서 선택한 그룹 ID를 받아온다.
        var groupId = req.body.groupId;
        
        if(userDbId == null){
            res.send('user db id is null');
            return;
        }else if(groupId == null){
            res.send('group id is null');
            return;
        }
        
        //이미 등록된 그룹인지 확인한다.
        UserSchema.find({ _id : userDbId, group_id : groupId},
            function(err, data){
                
                if(data != null){
                     console.log(data.length);
                    if(data.length > 0){
                        res.send('already exist group');
                        return;
                    }else{
                        UserSchema.findByIdAndUpdate(userDbId, {$push: {group_id : groupId}}, function(err){
                           if(!err){
                               res.send('select ok');
                           }else{
                               res.send('err');           }
                        });
                    }
                }else{
                    res.send('no match user or group id');
                }
                
               
            });
        
        
        //PublicCalSchema.findOneAndUpdate({_id : id, user_db_id : userDbId, isShow : isShow});
    });
    
    //사용자는 자신의 캘린더에 표시할 캘린더 그룹을 선택할 수 있다 (2. 삭제)
    app.put('/calendar/delMyGroup', function(req, res){
        var userDbId = req.body.userDbId;
        
        //클라이언트에서 선택한 그룹 ID를 받아온다.
        var groupId = req.body.groupId;
        
        if(userDbId == null){
            res.send('user Db Id is null');
            return;
        }else if(groupId == null){
            res.send('groupId is null');
            return;
        }
        
        UserSchema.findOneAndUpdate({_id : userDbId, group_id : groupId}, {$pop: {group_id : groupId}}, 
            function(err, data){
               if(data != null){
                   res.send('del ok');
               }else if(data == null){
                   res.send('there is no group in user or wrong user');   
               }else{
                   res.send('err!');
               }
            });
        
        //PublicCalSchema.findOneAndUpdate({_id : id, user_db_id : userDbId, isShow : isShow});
    });
    
    //사용자는 자신의 캘린더에서 일정을 검색할 수 있어야 한다
    app.get('/calendar/searchSchedule', function(req, res){
        var userDbId = req.query.userDbId;
        var keyword = req.query.keyword;
        var year = req.query.year;
        
        if(userDbId == null){
            res.send('user Db Id is null');
            return;
        }else if(keyword == null){
            res.send('keyword is null');
            return;
        }else if(year == null){
            res.send('year is null');
            return;
        }
        
        //일정 시작 날짜 순으로 정렬하는 옵션
        var options = {
	        sort : {
                start_date : 1
	        }	
        };
        
        PrivateCalSchema.find({user_db_id : userDbId, start_time: { "$gte": new Date(year), "$lte": new Date(year + '-12-31')}, schedule : { $regex: keyword } }, null, options, 
            function (err, prvData) {
                if(prvData.length > 0){
                    //유저가 등록한 그룹 id 조회
                    UserSchema.find({ _id : userDbId}, {_id : 0, group_id : 1}, 
                        function(err, getGroupData){                
                            if(getGroupData.length > 0){
                                //res.send(getGroupData);
                                var tempGroupId = getGroupData[0].group_id;
                                
                                     //해당 그룹id를 가진 pubCal 조회
                                     PublicCalSchema.find({group_id : tempGroupId, start_time: { "$gte": new Date(year), "$lte": new Date(year + '-12-31') }, schedule : { $regex: keyword }}, 
                                        function(err, pubData){
                                            //개인 일정과 그룹 일정을 담을 배열 생성
                                            //프론트엔드에서는 배열의 번호로 개인일정과 그룹일정을 식별할 수 있다.
                                            var tempArray = [];
                                            tempArray[0] = prvData;
                                            tempArray[1] = pubData;
                                            
                                            // 개인일정 또는 그룹일정 데이터가 있다면
                                            if(prvData.length > 0 || pubData.length > 0 ){    
                                                res.send(tempArray);
                                            }else{
                                                res.send('none');
                                            }
                                        });
                            }else{
                                 res.send('private ^' + '\r' + prvData);
                            }
                    });
                }else{
                    res.send('no match data or user');
                }
            });
    });
    
    //사용자 추가 (스토리 외 기능. 테스트를 위해 사용함)
    app.post('/calendar/createUser', function(req, res){
        var userId = req.body.userId;
        var userPw = req.body.userPw;
        var groupId = '';
        var calId = '';
        
        if(userId == null){
            res.send('err user id is null');
            return;
        }else if(userPw == null){
            res.send('err user pw is null');
            return;
        }
        
        var userSchema = new UserSchema({id : userId, pw : userPw, groupId : groupId, calId : calId});
        userSchema.save();
        res.end();
    });
    
    //사용자 리스트(스토리 외 기능. 테스트를 위해 사용함)
    app.get('/calendar/showUser', function(req, res){
       UserSchema.find(
           function(err, data){
               if(data.length > 0){
                   res.json(data);
               }else{
                   res.send('err');
               }
               
           });
    });
}