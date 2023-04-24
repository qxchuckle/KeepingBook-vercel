var express = require('express');
var router = express.Router();

// 导入moment处理日期
const moment = require('moment');

// 导入文档模型对象
const AccountModel = require('../../models/AccountModel');

// 导入检测是否登陆的中间件
const checkLoginMiddleware = require('../../middleware/checkLoginMiddleware');

// 将首页重定向到账单页
router.get('/', (req, res)=>{
  res.redirect('/account');
})

// 记账本页面路由
router.get('/account',checkLoginMiddleware, function (req, res, next) {
  // 读取对应用户所有数据，按日期降序
  AccountModel.find({userID: req.session._id}).sort({ date: -1 })
    .then(data => {
      // 将数据数组传递过去遍历渲染，为了格式化日期，将moment传入
      res.render('index', { content: data, moment });
    })
    .catch(err => {
      console.log(err);
      // 查找失败则返回500
      res.status(500).render('tip', { msg: '查找失败!', url: '/' });
    })

});

// 添加记录页面路由
router.get('/add',checkLoginMiddleware, function (req, res, next) {
  res.render('add');
});

// 添加记录post接口路由
router.post('/add',checkLoginMiddleware,  function (req, res, next) {

  // 插入一条数据
  AccountModel.create({
    // 解构赋值
    ...req.body,
    // 覆盖修改日期为日期对象
    date: moment(req.body.date).toDate(),
    // 将对应用户id传入
    userID: req.session._id
  })
    .then(data => {
      console.log(data);
      // 成功跳转到提示页
      res.render('tip', { msg: '添加成功!', url: '/' });
    })
    .catch(err => {
      console.log(err);
      // 添加失败则返回500
      res.status(500).render('tip', { msg: '添加失败!', url: '/' });
    });

});

// 根据id删除数据，使用路由参数
router.get('/delete/:id',checkLoginMiddleware,  (req, res) => {
  // 获取路由参数id
  let id = req.params.id;
  AccountModel.deleteOne({ _id: id })
    .then(data => {
      console.log(data);
      // 删除成功跳转提示页
      res.render('tip', { msg: '删除成功!', url: '/' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('tip', { msg: '删除失败!', url: '/' });
    })

});

module.exports = router;
