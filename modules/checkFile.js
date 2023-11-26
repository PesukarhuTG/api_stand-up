import fs from 'node:fs/promises';

export const checkFileExist = async path => {
  try {
    await fs.access(path);
  } catch (error) {
    console.error(`Файл ${path} не найден`);
    return false;
  }

  return true;
};

export const createFileIfNotExist = async path => {
  try {
    await fs.access(path);
  } catch (error) {
    await fs.writeFile(path, JSON.stringify([]));
    console.log(`Файл ${path} был создан`);
    return true;
  }
};
