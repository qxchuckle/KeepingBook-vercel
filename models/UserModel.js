const mongoose = require('mongoose');
// 文档结构对象
let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
// 文档模型对象
let AccountModel = mongoose.model('users', UserSchema);
// 将文档模型对象暴露出去
module.exports = AccountModel;