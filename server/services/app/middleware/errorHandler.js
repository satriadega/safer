const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";
  console.log(err.name);

  switch (err.name) {
    case "SequelizeValidationError":
      status = 400;
      message = err.errors.map((el) => el.message);
      break;
    case "SequelizeUniqueConstraintError":
      status = 400;
      message = err.errors.map((el) => el.message);
      break;
    case "Invalid Login":
      status = 401;
      message = "Invalid Login";
      break;
    case "Not Found":
      status = 404;
      message = "Error Not Found";
      break;
    case "Not Valid":
      status = 400;
      message = "Data Not Valid";
      break;
    case "unauthenticated":
      status = 401;
      message = "Invalid token";
      break;
    case "Status false":
      status = 403;
      message = "You are not authorized";
      break;
    default:
      status = 400;
      message = err.name;
      break;
  }
  res.status(status).json({ message });
};

module.exports = errorHandler;
