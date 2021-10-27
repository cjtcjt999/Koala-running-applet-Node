const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const qd_router = express.Router();
qd_router.get('/get/', (req, res) => {
  const params = req.query;
  const { userId } = params;
  let result = new Result(-1, '');
  if (userId) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM order_info WHERE userId <> ? and orderStatus = ? ORDER BY id desc", [userId, '待接单'], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '获取抢单信息成功', results);
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '获取抢单信息失败，请检查登录状态');
    res.send(result);
  }
})

qd_router.get('/qdList/get/', (req, res) => {
  const params = req.query;
  const { userId } = params;
  let result = new Result(-1, '');
  if (userId) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM order_info WHERE receiptUserId = ? ORDER BY id desc", [userId], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '获取我的抢单信息成功', results);
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '获取我的抢单信息失败，请检查登录状态');
    res.send(result);
  }
})

qd_router.get('/receiveOrder/', (req, res) => {
  const params = req.query;
  const { id, receiptUserId, receiptUserName, receiptRealName, receiptPhoneNumber, receiptCoordinate } = params;
  let voucher = "";
  for(let i = 1;i <= 6;i++){
    const num = Math.floor(Math.random()*10);
    voucher += num;
  }
  let result = new Result(-1, '');
  if (id && receiptUserId && receiptUserName && receiptRealName && receiptPhoneNumber) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM order_info WHERE id = ? ORDER BY id desc", [id], function (error, results, fields) {
        if (results[0].orderStatus === '待接单') {
          conn.query("UPDATE order_info SET receiptUserId = ?, receiptUserName = ?, receiptRealName = ?, receiptPhoneNumber = ?, voucher = ?, orderStatus= ?, receiptCoordinate= ?  WHERE id = ?", [receiptUserId, receiptUserName, receiptRealName, receiptPhoneNumber, voucher, '订单进行中', receiptCoordinate, id], function (error, results, fields) {
            if (error) throw error;
            result = new Result(1, '抢单成功！');
            res.send(result);
          })
        } else {
          result = new Result(-1, '抢单失败，订单已被抢走啦！');
          res.send(result);
        }
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '抢单失败，请校验登录信息');
    res.send(result);
  }
})

qd_router.get('/completeOrder/', (req, res) => {
  const params = req.query;
  const { id, voucher } = params;
  let result = new Result(-1, '');
  if (id, voucher) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM order_info WHERE id = ? ORDER BY id desc", [id], function (error, results, fields) {
        if (results[0].voucher === voucher) {
          conn.query("UPDATE order_info SET orderStatus= ? WHERE id = ?", ['订单已完成', id], function (error, results, fields) {
            if (error) throw error;
            result = new Result(1, '订单已完成！');
            res.send(result);
          })
        } else {
          result = new Result(-1, '凭证错误');
          res.send(result);
        }
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '确认送达失败，请校验登录信息');
    res.send(result);
  }
})

qd_router.get('/setCurrCoordinate/', (req, res) => {
  const params = req.query;
  const { id, receiptCoordinate } = params;
  let result = new Result(-1, '');
  if (id && receiptCoordinate) {
    pool.getConnection((err, conn) => {
      conn.query("UPDATE order_info SET receiptCoordinate = ? WHERE id = ?", [receiptCoordinate, id], function (error, results, fields) {
        if (error) throw error;
        conn.query("SELECT * FROM order_info WHERE id = ? ORDER BY id desc", [id], function (error, results, fields) {
          if (error) throw error;
          result = new Result(1, '定位信息更新成功', {receiptCoordinate: results[0].receiptCoordinate, orderStatus: results[0].orderStatus});
          res.send(result);
        })
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '更新定位失败');
    res.send(result);
  }
})

qd_router.get('/getCurrCoordinate/', (req, res) => {
  const params = req.query;
  const { id } = params;
  let result = new Result(-1, '');
  if (id) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM order_info WHERE id = ? ORDER BY id desc", [id], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '获取定位信息成功', {receiptCoordinate: results[0].receiptCoordinate, orderStatus: results[0].orderStatus});
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '获取骑手定位失败');
    res.send(result);
  }
})

module.exports = qd_router;