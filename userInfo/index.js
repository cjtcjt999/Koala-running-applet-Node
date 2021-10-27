const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const userInfo_router = express.Router();
const multer = require('multer');

userInfo_router.get('/update/', (req, res) => {
  const params = req.query;
  const { userId, phoneNumber } = params;
  let result = new Result(-1, '');
  if (userId && phoneNumber) {
    //1、查询数据库中是否有用户id
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM user_info WHERE id = ?", [userId], function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) {
          //2、如果找不到用户id，则修改失败
          result = new Result(-1, '修改失败');
          //打印响应报文
          res.send(result);
        } else {
          conn.query("UPDATE user_info SET phoneNumber = ? WHERE id = ?", [phoneNumber, userId, ], function (error, results, fields) {
            if (error) throw error;
            result = new Result(1, '修改成功');
            res.send(result);
          })
        }
      });
      conn.release();
    })
  } else {
    result = new Result(-1, '修改失败');
    res.send(result);
  }
})

userInfo_router.get('/get/', (req, res) => {
  const params = req.query;
  const { userId } = params;
  let result = new Result(-1, '');
  if (userId) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM user_info WHERE id = ?", [userId], function (error, results, fields) {
        if (error) throw error;
        const { id, userName, realName, phoneNumber, studentNumber, major, blance } = results[0];
        const data = { userId: id, userName, realName, phoneNumber, studentNumber, major, blance: blance.toFixed(2) };
        result = new Result(1, '获取用户信息成功', data);
        res.send(result);
      });
      conn.release();
    })
  } else {
    result = new Result(-1, '获取用户信息失败');
    res.send(result);
  }
})

userInfo_router.get('/subFeedback/', (req, res) => {
  const params = req.query;
  const { userId, userName, realName, feedback } = params;
  let result = new Result(-1, '');
  if (userId) {
    pool.getConnection((err, conn) => {
      conn.query("INSERT INTO user_feedback(userId,userName,realName,feedback) VALUES(?,?,?,?)", [userId,userName,realName,feedback], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '提交成功', results);
        res.send(result);
      });
      conn.release();
    })
  } else {
    result = new Result(-1, '提交失败');
    res.send(result);
  }
})

let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      var changedName = (new Date().getTime()) + '-' + file.originalname;
      cb(null, changedName);
    }
  })
});

userInfo_router.post('/upload/', upload.single('file'), (req, res) => {
  console.log('req', req.file)
  result = new Result(1, '上传成功', req.file.filename);
  res.send(result);
})

module.exports = userInfo_router;