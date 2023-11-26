import http from 'node:http';
import fs from 'node:fs/promises';
import { sendError } from './modules/sendData.js';
import { checkFileExist, createFileIfNotExist } from './modules/checkFile.js';
import { handleComediansRequest } from './modules/handleComediansRequest.js';
import { handleAddClient } from './modules/handleAddClient.js';
import { handleClientsRequest } from './modules/handleClientsRequest.js';
import { handleUpdateClient } from './modules/handleUpdateClient.js';

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async port => {
  if (!(await checkFileExist(COMEDIANS))) {
    return;
  }

  await createFileIfNotExist(CLIENTS);

  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  const server = http.createServer(async (req, res) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');

      const segments = req.url.split('/').filter(Boolean); // разбиваем url и убираем пустоты

      // проверка на пустоту
      if (!segments.length) {
        sendError(res, 404, 'Нет сегмента запроса данных');
        return;
      }

      // деструктуризация сегмента
      const [resource, id] = segments;

      if (req.method === 'GET' && resource === 'comedians') {
        handleComediansRequest(req, res, comedians, id);
        return;
      }

      if (req.method === 'POST' && resource === 'clients') {
        handleAddClient(req, res);
        return;
      }

      if (req.method === 'GET' && resource === 'clients' && id) {
        // получение клиента по номеру билета
        handleClientsRequest(req, res, id);
        return;
      }

      if (req.method === 'PATCH' && resource === 'clients' && id) {
        // обновление клиента по номеру билета
        handleUpdateClient(req, res, id);
        return;
      }

      sendError(res, 404, 'Страница не найдена');
    } catch (error) {
      sendError(res, 500, `Ошибка сервера ${error}`);
    }
  });

  server.listen(port, () => {
    console.log(`Сервер запущен по адресу http://localhost:${port}`);
  });

  // если текущий порт будет занят
  server.on('error', err => {
    if ((err.code = 'EADDRINUSE')) {
      console.error(`Порт ${port} занят, пробуем запустить на ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error(`Возникла ошибка при запуске сервера: ${err}`);
    }
  });
};

startServer(PORT);
