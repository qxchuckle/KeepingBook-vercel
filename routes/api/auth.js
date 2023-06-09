var express = require('express');
var router = express.Router();

// 导入用户文档模型
const UserModel = require('../../models/UserModel');
// 导入md5对密码进行加密
const md5 = require('md5');
// 导入jwt控制token
const jwt = require('jsonwebtoken');
// 导入配置文件，获取加密字符串
const config = require('../../config');

// 注册
// 注册操作API
router.post('/reg', (req, res) => {
    // 如果用户名重复就重新注册
    UserModel.findOne({ username: req.body.username })
        .then(data => {
            // data不为空说明用户名重复
            console.log(data);
            if (data) {
                res.json({
                    code: '2003',
                    msg: '用户名已存在',
                    data: null
                })
                return;
            }
            // 用户名不重复则创建用户
            UserModel.create({
                ...req.body,
                // 使用md5对密码进行加密
                password: md5(req.body.password)
            })
                .then(data => {
                    res.json({
                        code: '0000',
                        msg: '注册成功',
                        data: {
                            username: req.body.username
                        }
                    })
                })
                .catch(err => {
                    res.json({
                        code: '2004',
                        msg: '注册失败',
                        data: null
                    })
                })
        })
})

// 登陆
// 登陆操作API
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let { username, password } = req.body;
    // 如果用户名或密码为空则返回失败
    if (!username || !password) {
        res.json({
            code: '2001',
            msg: '用户名或密码错误',
            data: null
        })
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
                res.json({
                    code: '2001',
                    msg: '用户名或密码错误',
                    data: null
                })
                return;
            }
            // 创建并返回token
            let token = jwt.sign({
                username: data.username,
                _id: data._id
            }, config.token_secret, {
                expiresIn: 60 * 60 * 24 * 7
            });
            res.json({
                code: '0000',
                msg: '登陆成功',
                data: {
                    token: token
                }
            })
        })
        .catch(err => {
            res.json({
                code: '2002',
                msg: '登陆出错',
                data: null
            })
        })
})

// 退出登陆
router.post('/logout', (req, res) => {
    // 客户端删除token即可
    res.json({
        code: '0000',
        msg: '退出成功',
        data: null
    })
});


module.exports = router;