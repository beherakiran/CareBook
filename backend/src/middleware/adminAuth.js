

const adminAuth = (request, response, next) => {
  if (request.role_type !== "admin") {
    return response.status(403).send({
      _status: false,
      _message: "Access denied. Admin only.",
      _data: "",
    });
  }

  next();
};

export default adminAuth;