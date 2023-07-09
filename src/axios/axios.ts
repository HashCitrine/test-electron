import axios from 'axios';

const apiPostfix = `${process.env.CAE_API}`;

// 수정 필요
const getQuery = (data: object) => {
  return data.toString();
};

export const get = async (uri: string, data: string) => {
  return axios.get(`${apiPostfix}${uri}?${data}`);
};
export const getByObject = async (uri: string, data: object) => {
  return axios.get(`${apiPostfix}${uri}?${getQuery(data)}`);
};

export const post = async (uri: string, data: FormData) => {
  // return axios
  //   .post(`${apiPostfix}${uri}`, data, {
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  //   .then((response) => {
  //     switch (response.status) {
  //       case 200:
  //         return response.data;
  //       default:
  //         console.log(response.statusText);
  //     }
  //     return null;
  //   })
  //   .catch(() => {});
  return axios.post(`${apiPostfix}${uri}`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const postFile = async (uri: string, data: FormData) => {
  return axios.post(`${apiPostfix}${uri}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
