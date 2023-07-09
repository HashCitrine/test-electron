import WebSocket from 'ws';
// import axios, { AxiosResponse } from 'axios';
// import { showNotification } from '../main/util';
import * as constants from '../constants/constants';
import * as send from '../axios/axios';
import { BATCH_START } from '../constants/constants';
import { runBatchTask } from '../schedule/startBatch';

let ws: WebSocket | null = null;

export const requestApiByMessage = async (data: string[]) => {
  // {uri}|{Method}|{request}
  const uri = data[0];
  const method = data[1];
  const request = data[2];

  const formData = new FormData();
  let responseData;
  switch (uri) {
    case constants.BATCH_START:
      responseData = await send.get(BATCH_START, request);
      runBatchTask(responseData);
      break;
    case constants.BATCH_STOP:
    case constants.BATCH_RESTART:
    default:
      switch (method) {
        case 'POST':
          // formData.append();
          return send.post(uri, formData);
        case 'GET':
          return send.get(uri, request);
        default:
      }
  }
  return null;
};

export const connectWebSocket = (): void => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('WebSocket is already connected.');
    return;
  }

  const serverUrl = 'ws://127.0.0.1:8082/ws';
  ws = new WebSocket(serverUrl);

  ws.on('open', () => {
    console.log('Connected to WebSocket server');
    ws?.send('Hello from Electron WebSocket client');
  });

  ws.on('message', async (message: WebSocket.Data) => {
    console.log('Message from server:', message.toString());
    try {
      const data = message.toString().split('|');
      if (data.length !== 3) {
        console.log('Not Request');
      }
      /*

      let response: AxiosResponse<any> | null = null;
      switch (method) {
        case 'POST':
          response = await axios.post(`http://127.0.0.1:8082${uri}`, request, {
            headers: { 'Content-Type': 'application/json' },
          });
          break;
        case 'GET':
          response = await axios.get(`http://127.0.0.1:8082${uri}?${request}`);
          await showNotification();
          break;
        default:
          break;
      }

      console.log(response?.data); */

      await requestApiByMessage(data);
    } catch (err: any) {
      console.log(err.message);
    }
  });

  ws.on('error', (err: WebSocket.ErrorEvent) => {
    console.error('WebSocket error:', err);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
};

export const disconnectWebSocket = (): void => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
};
