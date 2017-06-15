
module.exports = function(app, moment, userSchema, privateCalSchema, publicCalSchema, groupSchema)
{
   
    //1��~12���� ǥ���ϱ� ���� ���Խ�
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

    // Ȩ ȭ��(���� ���� Ȯ��)
    app.get('/calender', function(req,res){        
        res.send(moment());
        res.end();
    });

    // ���� Ķ���� Ȯ��
    app.get('/calendar/:month', function(req, res){
        //1������ 12�������� �޴´�. �� �� ���ڴ� error�� �����Ѵ�. 
        //##����Ʈ���� ó��##
        if(req.params.month > 12 || req.params.month < 1){
            res.send('error');
        }else{
            res.send(moment());
            res.send(moment());
        }       
        res.end();
    });

    // �ش� ��¥(��) ���� ����Ʈ Ȯ��
    app.get('/calendar/:month/:date', function(req, res){
        //�� ó��
        if(req.params.month > 12 || req.params.month < 1){
            res.send('error');
        }else{
            res.send(moment());
        }       
    
        //�� ó��
        if(req.params.date > 31 || req.params.date < 1){
            res.send('error');
        }else{
            res.send(moment());
        }       
        res.end();
    });
    
    // ���� ���� �߰�
    app.post('/calender/month/', function(req, res){
        res.send(moment());
        res.end();
    });

    // ���� ���� ����
    app.delete('/api/books/:book_id', function(req, res){
        res.end();
    });

    // ���� ���� ����
    app.post('/api/books/:book_id', function(req, res){
        res.end();
    });

    

}