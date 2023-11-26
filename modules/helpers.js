// считываем данные от пользователя и собираем воедино

export const readRequestBody = req =>
  new Promise((res, rej) => {
    let body = '';

    // данные собираем
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // когда закончится
    req.on('end', () => {
      res(body);
    });

    // если ошибка
    req.on('error', err => {
      rej(err);
    });
  });
