module.exports = function (app, moment, dateChker) {

    //[Schema Setting]    
    var UserSchema = require('./models/userSchema');
    var PrivateCalSchema = require('./models/privateCalSchema');
    var PublicCalSchema = require('./models/publicCalSchema');
    var GroupSchema = require('./models/groupSchema');
    
    //[Module Setting]
    var moment = require('moment');
    var dateChker = require('./dateChker');
    
    
    // Ȩ ȭ��(���� ���� Ȯ��)
    app.get('/calendar', function (req, res) {

        var date = {
            "year": moment().format('YYYY'),
            "month": moment().format('MMM'),
            "day": moment().format('Do')
        };

        var parsedDate = JSON.stringify(date);

        res.send(parsedDate);
    });
    

    // ���� Ķ���� Ȯ��       
    app.get('/calendar/month', function (req, res) {
    //1������ 12�������� �޴´�. �� �� ���ڴ� error�� �����Ѵ�. 
    //##����Ʈ���忡�� �ش� ���� ���� ���� ó��. �鿣�忡���� �� ��ȯ
        var chk = dateChker.monthChk(req.params.month);
        if (chk) {
            res.send(res.params.month);
        } else {
            res.send('error');
        }
    });

    // �ش� ��¥(��) ���� ����Ʈ Ȯ��
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

    // ���� ���� �߰�
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

    // ���� ���� ����
    app.delete('/api/books/:book_id', function (req, res) {
        res.end();
    });

    // ���� ���� ����
    app.post('/api/books/:book_id', function (req, res) {
        res.end();
    });
}