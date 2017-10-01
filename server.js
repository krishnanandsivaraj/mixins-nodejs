var express=require('express');
var app=express();
var bodyparser=require('body-parser');
var router=express.Router();
var monogoOp=require('./data');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({"encoded":"true"}));

router.get('/',function(req,res){
    res.json({success:"true",body:"okay!!"});
});

router.route('/users').get(function(req,res){
    var response={};
    monogoOp.find({},function(err,data){
        console.log(data);
        if(err){res.json({"success":"false","message":"There was an error fetching data: "+err});}
        res.json({"success":"true","message":data});
    });
});

app.use('/',router);
app.listen(3000);
console.log('listening to port 3000');