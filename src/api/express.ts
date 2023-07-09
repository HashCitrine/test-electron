import express from 'express';

// eslint-disable-next-line import/prefer-default-export
export const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3030, () => {
  console.log('3030 Server Open');
});
