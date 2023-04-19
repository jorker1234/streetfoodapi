module.exports = (req, res, next) => {
  res.success = (data = "", statusCode = 200) => {
    res.status(statusCode || 200).send(data);
  };

  res.error = ({ message, status = 500, code }) => {
    const errorBody = {
      status,
      message,
      code,
    };
    res.status(status || 500).send({ error: errorBody });
  };

  next();
};
