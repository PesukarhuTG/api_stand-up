import { sendData, sendError } from './sendData.js';

export const handleComediansRequest = async (req, res, comedians, id) => {
  if (id) {
    const comedian = comedians.find(person => person.id === id);

    if (!comedian) {
      sendError(res, 404, 'Stand-up комик не найден');
      return;
    }

    sendData(res, comedian);
    return; //обязателен иначе снова ниже попробует вернуть данные
  }

  sendData(res, comedians);
};
