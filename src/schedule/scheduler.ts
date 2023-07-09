import { watchResult } from './checkResult';

const allStopSchedule = () => {
  watchResult.forEach((watchTask) => {
    watchTask.close();
  });
  console.log('All schedules stopped');
};

process.on('SIGINT', () => {
  allStopSchedule();
  process.exit();
});
