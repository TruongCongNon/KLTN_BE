import jwt from "jsonwebtoken";
const middlewareController = {
    //verify token
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const accessToken = authHeader.split(" ")[1];
            // eslint-disable-next-line no-undef
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                // console.log(user);
                next();
            });
        } else {
            return res.status(401).json("You are not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            } else {
                return res.status(403).json("You are not allowed to deleted other")
            }
        })
    }
}
export default middlewareController;
