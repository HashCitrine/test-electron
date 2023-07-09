import chokidar, { FSWatcher } from 'chokidar';
import path from 'path';
import * as send from '../axios/axios';

import cron, { ScheduledTask } from 'node-cron';
import fs from 'fs';

export const checkResultTask = new Map<number, ScheduledTask>();

export const checkResultJob = (
  requestId: number,
  directoryPath: string,
  targetFileName: string
) => {
  console.log(`checkResultJob start : ${requestId}`);
  console.log(`Watching Directory...`);
  const watcher = fs.watch(directoryPath, async (event, filename) => {
    if (event === 'rename' && filename) {
      const file = path.join(directoryPath, filename);
      console.log(path.basename(file)); // todo : 삭제

      if (targetFileName === filename) {
        watcher.close();
        const formData = new FormData();
        formData.append('file', file);
        const data = await send.post('', formData);
        if (data) {
          const task = checkResultTask.get(requestId);
          if (task) {
            task.stop();
          }
        }
      }
    }
  });
};

export const checkResultSchedule = (
  requestId: number,
  directoryPath: string,
  targetFileName: string
) => {
  checkResultTask.set(
    requestId,
    cron.schedule('*/5 * * * *', () => {
      checkResultJob(requestId, directoryPath, targetFileName);
    })
  );
};

export const watchResult = new Map<number, FSWatcher>();

export const addWatch = (
  requestId: number,
  directoryPath: string,
  targetFileName: string
) => {
  console.log(`Add Result Watch Job : ${requestId}`);
  console.log(`Watching Directory...`);
  watchResult.set(
    requestId,
    chokidar.watch(directoryPath).on('add', async (filePath) => {
      if (path.basename(filePath) === targetFileName) {
        const formData = new FormData();
        // todo : 수정 필요
        formData.append('file', filePath);
        const data = await send.post('', formData);
        if (data) {
          const task = watchResult.get(requestId);
          if (task) {
            await task.close();
          }
        }
      }
    })
  );
};
