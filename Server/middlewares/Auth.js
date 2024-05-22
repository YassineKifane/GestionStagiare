const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({ path: "../config.env" });


exports.verifyToken = (req, res, next) => {
  if(req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];
   
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(token, process.env.MY_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
    
};


