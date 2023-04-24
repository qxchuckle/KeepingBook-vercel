const checkLoginMiddleware = (req, res, next) => {
    if (!req.session.username) {
        // redirect重定向到登陆页面
        return res.render('tip', { msg: '还未登陆!', url: '/login' });
    }
    next();
}

module.exports = checkLoginMiddleware;