const mongoose = require('mongoose');
// 文档结构对象
let AccountSchema = new mongoose.Schema({
    matter: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['支出', '收入'],
        default: '支出'
    },
    account: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
        default: '无'
    },
    // 通过userID保存账单属于哪个用户的
    userID:{
        type: String,
        required: true
    }
});
// 文档模型对象
let AccountModel = mongoose.model('accounts', AccountSchema);
// 将文档模型对象暴露出去
module.exports = AccountModel;