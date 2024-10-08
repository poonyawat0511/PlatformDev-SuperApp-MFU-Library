import fs from 'fs';
import path from 'path';

export function getFolders() {
  const appDirectory = path.join(process.cwd(), 'src' ,'app');
  const folders = fs.readdirSync(appDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())  // Only get directories
    .map((dirent) => dirent.name);

  return folders;
}