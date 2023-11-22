import http from 'node:http';
import fs from 'node:fs/promises';
import { sendData, sendError } from './modules/sendData.js';
import { checkFile } from './modules/checkFile.js';
import { handleComediansRequest } from './modules/handleComediansRequest.js';
import { handleAddClient } from './modules/handleAddClient.js';

const PORT = 8081;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) {
    return;
  }

  await checkFile(CLIENTS, true);

  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
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
          // GET / clients/:ticket
          // получение клиента по номеру билета
          const ticket = segments[1];
          handleAddClient(req, res, ticket);
          return;
        }

        if (
          req.method === 'PATCH' &&
          segments[0] === 'clients' &&
          segments.length === 2
        ) {
          // PATCH / clients/:ticket
          // обновление клиента по номеру билета

          handleUpdateClient(req, res, segments);
          return;
        }

        sendError(res, 404, 'Страница не найдена');
      } catch (error) {
        sendError(res, 500, `Ошибка сервера ${error}`);
      }
    })
    .listen(PORT);

  console.log(`launch http://localhost:${PORT}`);
};

startServer();
