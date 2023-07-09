import cron, { ScheduledTask } from 'node-cron';
import * as childProcess from 'child_process';
import { AxiosResponse } from 'axios';
import { addWatch } from './checkResult';

export const batchTask = new Map<number, ScheduledTask>();

export const batchTaskJob = (
  requestId: number,
  directoryPath: string,
  targetFileName: string,
  args: string[]
) => {
  childProcess.execFile(
    `${directoryPath}/${targetFileName}`,
    args,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
      if (stderr) {
        console.log(stderr);
      }

      if (stdout) {
        addWatch(requestId, directoryPath, targetFileName);
      }
    }
  );
};

export const runBatchTask = (response: AxiosResponse) => {
  const { requestId, directoryPath, targetFileName, args } = response.data;
  return batchTaskJob(requestId, directoryPath, targetFileName, args);
};

export const batchTaskSchedule = (
  requestId: number,
  directoryPath: string,
  targetFileName: string,
  args: string[]
) => {
  batchTask.set(
    requestId,
    cron.schedule('*/5 * * * *', () => {
      batchTaskJob(requestId, directoryPath, targetFileName, args);
    })
  );
};
