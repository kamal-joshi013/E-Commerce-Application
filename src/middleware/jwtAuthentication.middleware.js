import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).send("Unauthorized");
  } else {
    try {
      const payload = jwt.verify(token, "O3UPpJ1gxXOYqti4T1wE5OCpYiSsdZPI");
      req.userId = payload.userId;
      // console.log(payload);
    } catch (err) {
      res.status(401).send("Unauthorized");
    }
    next();
  }
};

export default jwtAuth;
