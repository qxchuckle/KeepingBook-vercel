# KeepingBook
nodejs + express + ejs + mongoose + mongodb的**练手**小项目

连接mongodb-cloud，本地版前往此仓库（不再更新）[keepingBook](https://github.com/qxchuckle/keepingBook)

**功能：**
1. 注册登陆，会话控制、用户识别
2. 基于token实现API，方便扩展，[API文档](https://console-docs.apipost.cn/preview/3d8ecc659c1e192b/da97e0b2ec13fd71)
3. 账单完整的增删改查

**去体验：**[记账本](https://kpb.qcqx.cn/)  
演示账号：username：qx ， password：123

***

# 在vercel中部署
fork该仓库，修改**config.js**中的URL，应该首先去注册[mongodb-cloud](https://cloud.mongodb.com/)以获取连接URL

然后在vercel中直接import你的仓库，稍等片刻，部署就会完成




