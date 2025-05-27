import jwt from"jsonwebtoken"
const middlewareController = {
  // Xác thực token
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const accessToken = authHeader.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token không hợp lệ");
        }
        req.user = user;  // Gán thông tin user vào request
        next();
      });
    } else {
      return res.status(401).json("Bạn chưa đăng nhập");
    }
  },

  // Kiểm tra quyền admin, shipper, warehouse 
  verifyTokenAndRole: (...allowedRoles)=>{
    return (req,res,next)=>{
      middlewareController.verifyToken(req,res,()=>{
        if(allowedRoles.includes(req.user.role)){
          next();
        }else{
          res.status(403).json("Bạn không có quyền truy cập");
        }
      
      })
    }
  }
  

};

export default middlewareController;