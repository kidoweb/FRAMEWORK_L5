function errorHandler(err, req, res) {
  console.error('Произошла ошибка:', err.message);
  res.statusCode = 500;
  res.end('Внутренняя ошибка сервера');
}

module.exports = { errorHandler };
