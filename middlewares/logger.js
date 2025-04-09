module.exports = (req, res, next) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  next();
};