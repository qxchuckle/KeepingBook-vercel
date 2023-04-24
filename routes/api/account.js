var express = require('express');
var router = express.Router();

// 导入moment处理日期
const moment = require('moment');

// 导入文档模型对象
const AccountModel = require('../../models/AccountModel');

// 导入token校验中间件
const checkTokenMiddleware = require('../../middleware/checkTokenMiddleware');

// 获取所有记录接口
router.get('/', checkTokenMiddleware, function (req, res, next) {

    // 读取所有数据，按日期降序
    AccountModel.find({userID: req.userID}).sort({ date: -1 })
        .then(data => {
            // 接口返回json
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '0000',
                // 响应的信息
                msg: '读取成功',
                // 响应的数据
                data: data
            })
        })
        .catch(err => {
            console.log(err);
            // 接口的状态信息标识在code中，不设置响应码
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '1001',
                // 响应的信息
                msg: '读取失败',
                // 响应的数据
                data: null
            })
        })

});

// 获取单条记录接口
router.get('/:id', checkTokenMiddleware, (req, res) => {
    let { id } = req.params;
    AccountModel.findById(id)
        .then(data => {
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '0000',
                // 响应的信息
                msg: '读取成功',
                // 响应的数据
                data: data
            });
        })
        .catch(err => {
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '1004',
                // 响应的信息
                msg: '读取失败',
                // 响应的数据
                data: null
            })
        })
})

// 添加记录接口
router.post('/', checkTokenMiddleware, function (req, res, next) {

    // 插入一条数据
    AccountModel.create({
        // 解构赋值
        ...req.body,
        // 覆盖修改日期为日期对象
        date: moment(req.body.date).toDate(),
        userID: req.userID
    })
        .then(data => {
            console.log(data);
            // 接口返回json
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '0000',
                // 响应的信息
                msg: '添加成功',
                // 响应的数据，返回创建成功的文档
                data: data
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '1002',
                // 响应的信息
                msg: '添加失败',
                // 响应的数据
                data: null
            })
        });

});

// 根据id删除数据，使用路由参数
router.delete('/:id', checkTokenMiddleware, (req, res) => {
    // 获取路由参数id
    let id = req.params.id;
    AccountModel.deleteOne({ _id: id })
        .then(data => {
            console.log(data);
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '0000',
                // 响应的信息
                msg: '删除成功',
                // 响应的数据
                data: data
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                // 响应编号，四个0表示成功，非0表示失败
                code: '1003',
                // 响应的信息
                msg: '删除失败',
                // 响应的数据
                data: null
            })
        })

});

// 更新账单接口
router.patch('/:id', checkTokenMiddleware, (req, res) => {
    let { id } = req.params;
    AccountModel.updateOne({ _id: id }, req.body)
    .then(data => {
        res.json({
            code: '0000',
            msg: '更新成功',
            data: data
        })
    })
    .catch(err=>{
        res.json({
            code: '1005',
            msg: '更新失败',
            data: null
        })
    })
})


module.exports = router;
