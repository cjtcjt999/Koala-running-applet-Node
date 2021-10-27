const { app, pool, Result } = require('./connect');
const http = require('http');
const https = require('https');
const fs = require('fs');
const login = require('./login/index');
const register = require('./register/index');
const address = require('./address/index');
const dn = require('./order/dn.js');
const qd = require('./order/qd.js');
const userInfo = require('./userInfo/index');
const options = {
  key: fs.readFileSync('./SSL/4998241_chayuanshiyi.cn.key'),
  cert: fs.readFileSync('./SSL/4998241_chayuanshiyi.cn.pem')
}

app.all('*',(req,res,next) => {
  //这里处理全局拦截，一定要写在最上面，不然会被别的接口匹配而没有执行next导致捕捉不到
  next();
})
app.get('/', (req, res) => {
    return res.json(new Result({ data: 'Hello World！' }))
})

app.use('/login', login);
app.use('/register', register);
app.use('/address', address);
app.use('/order/dn', dn);
app.use('/order/qd', qd);
app.use('/userInfo', userInfo);
//定义端口，此处所用为3000端口，可自行更改
http.createServer(app).listen(3000, function () {
  console.log('runing 3000...');
});
https.createServer(options, app).listen(4000, function () {
  console.log('runing 4000...');
});

