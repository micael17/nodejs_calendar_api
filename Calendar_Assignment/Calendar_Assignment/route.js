
module.exports = function (app, moment, userSchema, privateCalSchema, publicCalSchema, groupSchema) {

    //1월~12월을 표현하기 위한 정규식
    /*
      app.param(function(name, fn){
       if (fn instanceof RegExp) {
         return function(req, res, next, val){
           var captures;
           if (captures = fn.exec(String(val))) {
             req.params[name] = captures;
             next();
           } else {
             next('route');
           }
         }
       }
     });  
 */
    //app.param('num0to12Regex', /^([1-9]|1[0-2])$/);

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
    app.get('/calendar/:month', function (req, res) {
        //1월부터 12월까지만 받는다. 그 외 숫자는 error로 응답한다. 
        //##프론트엔드 처리##

        if(req.params.month < 13 && req.params.month > 0){
            res.send('month');
        }else{
            res.send('error');
        }
    });

    // 해당 날짜(일) 일정 리스트 확인
    app.get('/calendar/:month/:date', function (req, res) {
        //월 처리
        if (req.params.month < 13 && req.params.month > 0) {            
        } else {
            res.send('error');
        }    

        //일 처리
        if (req.params.date < 32 && req.params.date > 0) {
            res.send('day');
        }else{
            res.send('error');
        }            

    });

    // 개인 일정 추가
    app.post('/calender/month/', function (req, res) {
        //res.send(moment());
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