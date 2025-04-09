const router = {
  routes: []
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => {
  router[method.toLowerCase()] = (path, handler) => {
    router.routes.push({ method, path, handler });
  };
});

router.get('/', (req, res) => {
  res.send('Привет! Это корневой маршрут');
});

router.get('/ping', (req, res) => {
  res.json({ ответ: 'pong' });
});

router.post('/echo', (req, res) => {
  res.json({ получено: req.body });
});

router.put('/update', (req, res) => {
  res.send('PUT запрос обработан');
});

router.patch('/modify', (req, res) => {
  res.send('PATCH запрос обработан');
});

router.delete('/delete', (req, res) => {
  res.send('DELETE запрос обработан');
});

module.exports = router;
