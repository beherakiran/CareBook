
import jwt from "jsonwebtoken";

const auth = (request, response, next) => {
  const secretKey = process.env.secret_key;
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).send({
      _status: false,
      _message: "Token is required.",
      _data: "",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    request.userId = decoded.userId;
    request.role_type = decoded.role_type;

    next();
  } catch (error) {
     console.log("JWT Error:", error.message);
    return response.status(401).send({
      _status: false,
      _message: "Invalid token.",
       _error: error.message,
      _data: "",
    });
  }
};

export default auth;
