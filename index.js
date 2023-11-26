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

      if (req.method === 'GET' && segments[0] === 'comedians') {
        handleComediansRequest(req, res, comedians, segments);
        return;
      }

      if (req.method === 'POST' && segments[0] === 'clients') {
        handleAddClient(req, res);
        return;
      }

      if (
        req.method === 'GET' &&
        segments[0] === 'clients' &&
        segments.length === 2
      ) {
        // получение клиента по номеру билета
        const ticketNumber = segments[1];
        handleClientsRequest(req, res, ticketNumber);
        return;
      }

      if (
        req.method === 'PATCH' &&
        segments[0] === 'clients' &&
        segments.length === 2
      ) {
        // обновление клиента по номеру билета
        handleUpdateClient(req, res, segments);
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
