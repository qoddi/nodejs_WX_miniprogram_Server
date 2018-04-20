# nodejs_WX_miniprogram_Server
a nodejs wx miniprogram login server

WX miniprogram login server
（nodejs+express）

实现完整的微信小程序使用微信登陆过程以及登陆态的维护，具体包括
1.通过get请求接收微信小程序端发送的登陆请求，以及code，调用微信API使用我方服务器向微信服务器请求session以及openid
2.将session openid以及生成的seesion_3rd，利用mysql存储到database
3.向小程序返回session_3rd，小程序每次登陆通过 wx.setStorageSync将session_3rd带上实现登陆校验
4.对session_3rd的校验以及异常处理，向小程序返回登陆结果




使用方法：
   0.修改/res/config.json添加小程序的appid/appsecret，其中secure的布尔值决定是否使用https
     在/routes/db.js中添加数据库的相关信息
     在/res/ssl/下放域名证书（小程序要求https），改名cert.pem与privkey.pem,其中cert.pen要包含中间证书
     
   1.使用webstorm打开工程
   
   2.或者在代码根目录使用指令node ./bin/www
   
   3.使用get进行接口进行测试 
   https://yourdomain:port/wx/onlogin
   携带的数据为json格式，
   {
      "code":"xxxxxxxxxxxxxxxxxxx".
      "session"：“xxxxxxxxxxxxxxxxxxx”      
   }
