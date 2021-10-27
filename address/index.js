const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const address_router = express.Router();
address_router.get('/save/', (req, res) => {
  const params = req.query;
  const { userId, userName, realName, address, contacts, contactsPhone, coordinate } = params;
  let result = new Result(-1, '');
  if (address && contacts && contactsPhone) {
    pool.getConnection((err, conn) => {
      conn.query("INSERT INTO address_info(userId,userName,realName,address,coordinate,contacts,contactsPhone) VALUES(?,?,?,?,?,?,?)", [userId, userName, realName, address, coordinate, contacts, contactsPhone], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '保存成功');
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '保存失败，信息不能为空');
    res.send(result);
  }
})
address_router.get('/update/', (req, res) => {
  const params = req.query;
  const { addressId, address, coordinate, contacts, contactsPhone } = params;
  let result = new Result(-1, '');
  if (address && contacts && contactsPhone) {
    pool.getConnection((err, conn) => {
      conn.query("UPDATE address_info SET address = ?, coordinate = ?, contacts = ?, contactsPhone= ?  WHERE id = ?", [address, coordinate, contacts, contactsPhone, addressId], function (error, results, fields) {
        if (error) throw error;
        result = new Result(1, '修改成功');
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '修改失败，信息不能为空');
    res.send(result);
  }
})
address_router.get('/get/', (req, res) => {
  const params = req.query;
  const { userId } = params;
  let result = new Result(-1, '');
  if (userId) {
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM address_info WHERE userId = ?", [userId], function (error, results, fields) {
        if (error) throw error;
        const data = results.map(item => {
          const { id, address, coordinate, contacts, contactsPhone } = item;
          const list = { id, address, coordinate, contacts, contactsPhone };
          return list;
        })
        result = new Result(1, '获取地址信息成功', data);
        res.send(result);
      })
      conn.release();
    })
  } else {
    result = new Result(-1, '获取地址信息失败，请检查登录状态');
    res.send(result);
  }
})

module.exports = address_router;