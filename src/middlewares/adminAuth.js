//middleware function dùng để bảo vệ route dành riêng cho admin,
// đảm bảo rằng chỉ người dùng có quyền ADMIN mới có thể truy cập.
module.exports = function (req, res, next) {
    if (req.session.role === 'ADMIN') {
        next(); //lưu vai trò của người dùng nếu hợp lệ thì đi tiếp
    } else {
       res.redirect('/login'); //nếu người dùng kp admin đẩy về login
    }
};
