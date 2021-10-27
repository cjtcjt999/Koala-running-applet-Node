const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const register_router = express.Router();
register_router.post('/', (req, res) => {
  const params = req.body;
  const { userName, userPassword, realName, phoneNumber, studentNumber, major } = params;
  let result = new Result(-1, '');
  if (userName && userPassword && realName && phoneNumber && studentNumber && major) {
    //1、查询数据库中是否有用户名
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM user_info WHERE userName = ?", [userName], function (error, results, fields) {
        if (error) throw error;
        if (results.length >= 1) {
          //2、如果有相同用户名，则注册失败，用户名重复
          result = new Result(-1, '注册失败，用户名已存在');
          //打印响应报文
          res.send(result);
        } else {
          conn.query("INSERT INTO user_info(userName,userPassword,realName,phoneNumber,studentNumber,major,blance) VALUES(?,?,?,?,?,?,?)", [userName, userPassword, realName, phoneNumber, studentNumber, major, 0.00], function (error, results, fields) {
            if (error) throw error;
            //3、如果没有相同用户名，并且有一条记录，则注册成功
            if (results.affectedRows == 1) {
              result = new Result(1, '注册成功');
              res.send(result);
            } else {
              result = new Result(-1, '注册失败');
              res.send(result);
            }
          })
        }
      });
      conn.release();
    })
  } else {
    result = new Result(-1, '注册失败，注册信息不能为空');
    res.send(result);
  }
})

module.exports = register_router;