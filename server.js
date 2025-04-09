const MyFramework = require('./framework');
const app = new MyFramework();

const logger = require('./middlewares/logger');
const bodyParser = require('./middlewares/bodyParser');

app.use(logger);
app.use(bodyParser);

app.get('/hello', (req, res) => {
  const name = req.query.name || 'мир';
  res.send(`Привет, ${name}!`);
});

app.post('/hello', (req, res) => {
  res.json({ message: `Получено (POST): ${JSON.stringify(req.body)}` });
});

app.put('/hello', (req, res) => {
  res.send('Обновлено (PUT)');
});

app.patch('/hello', (req, res) => {
  res.send('Обновлено частично (PATCH)');
});

app.delete('/hello', (req, res) => {
  res.send('Удалено (DELETE)');
});

app.get('/middleware', (req, res) => {
  res.send('Мидлвары работают корректно!');
});

app.get('/error', (req, res) => {
  throw new Error('Пример ошибки');
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});