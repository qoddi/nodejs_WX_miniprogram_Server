var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var fs=require('fs');
var db = require("./db.js");

//load event
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();



//load config.json
var config="./res/config.json";
var cfg=JSON.parse(fs.readFileSync(config));
var isHttps=cfg.secure;

//middleware service
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('public'));

//default page
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});





router.get('/onLogin', function (req, res) {
    var code_req=req.query.code;
    var session_req = req.query.session;
    //console.log(code_req);
    emitter.once("needLogin",function () {
        console.log("[loginemitter]:active");
        loginSig=false;
        login(code_req,function(data){
            console.log(data);
            res.json(data)
        })
    });

    if(!req.query.session){console.log("first time login");emitter.emit("needLogin");}
    var sql = "select *  from user_info where session_3rd ='"+session_req+"'";
    var loginSig=true;
    db.query(sql, function (err, rows) {
        //console.log(rows[0]);
        if(err){console.log('search session err ,need login');emitter.emit("needLogin");}
        if(rows.length===0){console.log('illegal session ,need login');emitter.emit("needLogin");}
        if(rows.length!==0&&rows[0].timestamp<Date.now()){
            console.log('session expired,need login');
            emitter.emit("needLogin");}
            console.log(rows);
        if(rows.length!==0&&loginSig){
            res.json({'success':'true','uid':rows[0].uid});}
    });
});


 function login(code, callback) {
    console.log(code+cfg.appid+cfg.appsecret);
    request.get({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: cfg.appid,
            secret: cfg.appsecret,
            js_code: code
        }
    },function (err, data) {
        if (data.statusCode !== 200) {
            console.log("[error]", err);
        } else {
            console.log("[openid]", data.body.openid);
            console.log("[session_key]", data.body.session_key);
            var that = this;
            var sql = "select *  from user_info where openid ='"+data.body.openid+"'";
            db.query(sql, function (err, rows) {
                console.log(rows);
                if(err||rows.length===0) {
                    console.log("add new id");
                    usersadd(data.body.openid,data.body.session_key,
                        function(err,data,data1){
                            if(err)callback({'success':false,'msg':'add failed'});
                              else
                                  callback({'success':true,'session_3rd':data,'uid':data1,'msg':'add success'})

                    }
                    )}else{
                    console.log("renew id");
                    usersupdate(data.body.openid,data.body.session_key,rows[0].uid,
                        function(err,data,data1){
                            if(err)callback({'success':false,'msg':'update failed'});
                            else
                                callback({'success':true,'session_3rd':data,'uid':data1,'msg':'update success'})}
                    )


                }
            })
        }
    });
}

function usersadd (opid,ssn_key,callback) {
    var ssn_3 = ssn_key+opid;
    var expTime =Date.now()+2592000000;
    sql ="INSERT INTO `user_info` VALUES (0, '"+
        opid+"', '"+
        ssn_key+"','"+
        ssn_3+"','"+
        expTime+"',null,1);";
    db.query(sql,function (err,rows) {
        callback(err,ssn_3,rows.insertId)
    });
}

function usersupdate (opid,ssn_key,uid,callback) {
    var ssn_3 = ssn_key+opid;
    var expTime =Date.now()+2592000000;
    sql ="update user_info set "
        +" session_key='"+ssn_key
        +"', timestamp="+expTime
        +", session_3rd='"+ssn_3+"' where openid='"+opid+"';";
    db.query(sql,function (err,rows) {
        callback(err,ssn_3,uid)})
}












module.exports = router;