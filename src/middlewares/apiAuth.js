/*dùng để xác thực token JWT cho các API trong hệ thống. 
Đây là một middleware kiểm tra xem người dùng có token hợp lệ hay không 
trước khi cho phép truy cập vào các tài nguyên bảo vệ.*/
import jwt from "jsonwebtoken"; //dùng để kiểm tra tính hợp lệ của JWT.

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; //Lấy token từ header (x-access-token hoặc authorization)
        return res.json({
            success: false,
            message: 'Auth token is required'
        });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); //Loại bỏ tiền tố "Bearer "
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is invalid (expire or something), try to get new one'
                }); //token không hợp lệ trả tb lỗi
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        }); //nếu kh có req token yc cung cấp 
    }
};

module.exports = {
    checkToken: checkToken,
};
