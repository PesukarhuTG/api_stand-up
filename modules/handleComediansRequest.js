import { sendData, sendError } from './sendData.js';

export const handleComediansRequest = async (req, res, comedians, segments) => {
  if (segments.length === 2) {
    const comedian = comedians.find(person => person.id === segments[1]);

    if (!comedian) {
      sendError(res, 404, 'Stand-up комик не найден');
      return;
    }

    sendData(res, comedian);
    return; //обязателен иначе снова ниже попробует вернуть данные
  }

  sendData(res, comedians);
};
