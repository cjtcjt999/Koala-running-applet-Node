const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const dn_router = express.Router();
dn_router.get('/save/', (req, res) => {
  const params = req.query;
  const { userId, userName, realName, takeAddress, takeContacts, takeContactsPhone, takeCoordinate, receiveAddress, receiveContacts,
          receiveContactsPhone, receiveCoordinate, takeTime, commodity, remarks, tips,
          estimatedCost, paymentMethod, totalFee, orderStatus, type }
  = params;
  console.log(type)
  let date = new Date();
  const orderTime = date.toLocaleString();
  let orderId;
  function setOrderId() { //生成orderId
    let newDate = date.toJSON().substr(0, 10).replace(/[-T]/g, ''); //20210322
    let randomString = parseInt(Math.random() * 900000 + 100000, 10);
    orderId = newDate + randomString;
  }
  function saveOrder(conn) {
    conn.query("SELECT * FROM order_info WHERE orderId = ?", [orderId], function (error, results, fields) {
      if (error) throw error;
      if (results.length >= 1) {
        //如果有相同orderId，则重新生成orderId
        setOrderId();
        saveOrder();
      } else {
        conn.query("INSERT INTO order_info(userId, userName, realName, orderId, takeAddress, takeContacts, takeContactsPhone, takeCoordinate, receiveAddress, receiveContacts, receiveContactsPhone, receiveCoordinate, takeTime, commodity, remarks, tips, estimatedCost, paymentMethod, totalFee, orderTime, orderStatus, type) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [userId, userName, realName, orderId, takeAddress, takeContacts, takeContactsPhone, takeCoordinate, receiveAddress, receiveContacts,
            receiveContactsPhone, receiveCoordinate, takeTime, commodity, remarks, tips, estimatedCost, paymentMethod, totalFee, orderTime, orderStatus, type
          ], function (error, results, fields) {
            if (error) throw error;
            result = new Result(1, '下单成功');
            res.send(result);
          })
      }
    });
  }
  setOrderId();
  let result = new Result(-1, '');
  if (takeTime && commodity && totalFee) {
    pool.getConnection((err, conn) => {
      saveOrder(conn);
      conn.release();
    })
  } else {
    result = new Result(-1, '下单失败，取件时间、物品信息等不能为空');
    res.send(result);
  }
})
dn_router.get('/get/', (req, res) => {
  const params = req.query;
  const { userId } = params;
  let result = new Result(-1, '');
  if (userId) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM order_info WHERE userId = ? ORDER BY id desc", [userId], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '获取订单信息成功', results);
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '获取订单信息失败，请检查登录状态');
    res.send(result);
  }
})

module.exports = dn_router;