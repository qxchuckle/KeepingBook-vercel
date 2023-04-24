var express = require('express');
var router = express.Router();

// 导入用户文档模型
const UserModel = require('../../models/UserModel');
// 导入md5对密码进行加密
const md5 = require('md5');

// 注册
// 注册页面路由
router.get('/reg', (req, res) => {
    res.render('auth/reg');
})
// 注册操作路由
router.post('/reg', (req, res) => {
    // 如果用户名重复就重新注册
    UserModel.findOne({ username: req.body.username })
        .then(data => {
            // data不为空说明用户名重复
            if (data) {
                res.render('tip', { msg: '用户名已存在', url: '/reg' });
                return;
            }
            // 用户名不重复则创建用户
            UserModel.create({
                ...req.body,
                // 使用md5对密码进行加密
                password: md5(req.body.password)
            })
                .then(data => {
                    res.render('tip', { msg: '注册成功', url: '/login' });
                })
                .catch(err => {
                    res.status(500).render('tip', { msg: '注册失败!', url: '/reg' });
                })
        })
})

// 登陆
// 登陆页面路由
router.get('/login', (req, res) => {
    res.render('auth/login');
})
// 登陆操作路由
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let { username, password } = req.body;
    // 如果用户名或密码为空则返回失败
    if (!username || !password) {
        res.render('tip', { msg: '用户名或密码错误', url: '/login' });
        return;
    }
    // 查询数据库，看有没有该用户
    // 要对密码也做一次md5加密然后去数据库对比
    UserModel.findOne({
        username: username,
        password: md5(password)
    })
        .then(data => {
            // 如果data为空说明用户不存在
            if (!data) {
                res.render('tip', { msg: '用户名或密码错误', url: '/login' });
                return;
            }
            // 用户存在则将用户信息写入session
            req.session.username = data.username;
            req.session._id = data._id;
            // 渲染成功提示页
            res.render('tip', { msg: '登陆成功', url: '/' });
        })
        .catch(err => {
            res.status(500).render('tip', { msg: '登陆失败!', url: '/login' });
        })
})

// 退出登陆，避免跨站请求伪造，使用post
router.post('/logout', (req, res) => {
    // 销毁session
    req.session.destroy(() => {
        res.render('tip', { msg: '退出成功', url: '/login' });
    });
});


module.exports = router;