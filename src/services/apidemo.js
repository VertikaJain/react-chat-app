/* 
import axios from ‘axios’;
import Constants from ‘./constants.js’;
import CookieManager from ‘./CookieManager.js’;
const xAccessTokenOne = CookieManager.getCookie(‘x-access-token’);
console.log({xAccessTokenOne});
const getTracks = async () => {
  const xAuth = ‘’;
  const URL = Constants.BASE_URL + Constants.PUBLIC + Constants.SEARCH;
  let query = {“query”:“”,“options”:{“filters”:{“exclude”:[]},“size”:20,“search_descriptions”:false}};
  return await axios({
    method: ‘post’,
    url: URL,
    headers: {‘x-host’: ‘tele-music.mewo.io’,
    ‘x-auth’: xAuth,
    ‘x-preferred-language’: ‘en’, ‘Content-Type’: ‘application/json’},
    data: JSON.stringify(query)
  })
  // axios.get(URL)
  .then(function (response) {
    // handle success
    console.log(response);
    return response;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}
const playTrack = async (trackId) => {
  console.log(‘playtrack’);
  const xAuth = CookieManager.getCookie(‘x-auth’);
  const {email} = JSON.parse(CookieManager.getCookie(‘user-data’));
  const URL = Constants.BASE_URL + ‘api/track/get/’ + trackId;
  return await axios({
    method: ‘post’,
    url: URL,
    headers: { ‘Content-Type’: ‘application/json’ },
    data: { xAuth, email }
  })
  .then(function (response) {
    // handle success
    return response;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}
const createUser = async (userData) => {
  let url = Constants.BASE_URL + ‘api/users’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: { ‘Content-Type’: ‘application/json’ },
    body: JSON.stringify(userData)
  });
  return response.json();
}
const signIn = async (userData) => {
  let url = Constants.BASE_URL + ‘api/users/signin’;
  let response = await axios({
    url: url,
    method: ‘post’,
    headers: { ‘Content-Type’: ‘application/json’ },
    data: userData
  }).then(res => {
    console.log(res);
    return res;
  });
  if(response.data.success) {
    console.log({response});
    CookieManager.setCookie(‘x-auth’, response.headers[‘x-auth’]);
    CookieManager.setCookie(‘x-access-token’, response.headers[‘x-access-token’]);
    console.log(‘token access: ’, JSON.stringify(response.headers));
    const {first_name, last_name, email, _id, favorites} = response.data.data;
    localStorage.setItem(‘favs’, JSON.stringify(favorites));
    CookieManager.setCookie(‘user-data’, JSON.stringify({first_name, last_name, email, _id}));
    window.location.pathname = ‘/’;
    return response.data;
  } else {
    return response.data;
  }
}
const searchTracks = async (searchText=‘’, tags=[]) => {
  let url = Constants.BASE_URL + ‘api/track/search’;
  const xAuth = CookieManager.getCookie(‘x-auth’);
  const xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let body = {
    xAuth,
    searchText,
    filters: {
      exclude: []
    },
    size: 10
  };
  if (tags.length) {
    body.filters.tags = tags;
  }
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify(body)
  })
  return response.json();
}
const getAllTags = async () => {
  let url =  Constants.BASE_URL + ‘api/track/get-all-tags’;
  let xAuth = CookieManager.getCookie(‘x-auth’);
  let xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify({xAuth})
  });
  return response.json();
}
const activateUser = async (token) => {
  let url =  Constants.BASE_URL + ‘api/users/activate/’+token;
  let response = await fetch(url, {
    method: ‘get’,
  });
  return response.json();
}
const createProject = async (title, trackIds=[]) => {
  let {email} = JSON.parse(CookieManager.getCookie(‘user-data’));
  let xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let url = Constants.BASE_URL + ‘api/project/create’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify({title, email, trackIds})
  });
  return response.json();
}
const getProjects = async () => {
  let {email} = JSON.parse(CookieManager.getCookie(‘user-data’));
  let xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let url = Constants.BASE_URL + ‘api/project/get-all-projects’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify({email})
  });
  return response.json();
}
const addTrackToProject = async (trackId, projectId) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  const xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let url = Constants.BASE_URL + ‘api/project/add-track/’ + projectId;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify({trackId, xAuth})
  });
  return response.json();
}
const addTrackToFavorites = async (trackId) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let { email } = JSON.parse(CookieManager.getCookie(‘user-data’));
  let url = Constants.BASE_URL + ‘api/users/favorites/’ + trackId;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth
    },
    body: JSON.stringify({trackId, email})
  });
  return response.json();
}
const getFavoriteTracks = async () => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let { email } = JSON.parse(CookieManager.getCookie(‘user-data’));
  let xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let url = Constants.BASE_URL + ‘api/users/favorites’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify({email})
  });
  return response.json();
}
const getDownloadTracks = async (trackId) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let url = `${Constants.MEWO_URL}public/tracks/${trackId}/files`;
  let response = await fetch(url, {
    method: ‘GET’,
    headers: {‘x-host’: ‘srstaging.mewo.io’,
    ‘x-auth’: xAuth,
    ‘x-preferred-language’: ‘en’, ‘Content-Type’: ‘application/json’}
  });
  return response.json();
}
const downloadArchiveTrack = async (trackId,quality) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let url = `${Constants.MEWO_URL}public/archive`;
  let response = await fetch(url, {
    method: ‘Post’,
    headers: {‘x-host’: ‘srstaging.mewo.io’,
    ‘x-auth’: xAuth,
    ‘x-preferred-language’: ‘en’, ‘Content-Type’: ‘application/json’},
    body: JSON.stringify({“context”:“track”,“docIds”:[trackId],“quality”:quality,“withVersions”:true})
  });
  return response.json();
}
const getHistoryTracks = async () => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let { email } = JSON.parse(CookieManager.getCookie(‘user-data’));
  let xAccessToken = CookieManager.getCookie(‘x-access-token’);
  let url = Constants.BASE_URL + ‘api/users/history’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth,
      ‘x-access-token’: xAccessToken
    },
    body: JSON.stringify({email})
  });
  console.log({response});
  return response.json();
}
const getDownloadTrackList = async () => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let { email } = JSON.parse(CookieManager.getCookie(‘user-data’));
  let url = Constants.BASE_URL + ‘api/users/downloads/list’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth
    },
    body: JSON.stringify({email})
  });
  console.log(response);
  return response.json();
}
const setDownloads = async (trackId) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let { email } = JSON.parse(CookieManager.getCookie(‘user-data’));
  let url = Constants.BASE_URL + ‘api/users/downloads’;
  let response = await fetch(url, {
    method: ‘post’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth
    },
    body: JSON.stringify({email, trackId})
  });
  return response.json();
}
const keywordsAndMaiaSearch = async (keywords) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let URL = ‘https://api-v2.mewo.io/public/search/url’;
  let response = await fetch(URL, {
    method: ‘POST’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth,
      ‘x-host’: ‘srstaging.mewo.io’
    },
    body: JSON.stringify({ link: keywords })
  });
  return response.json();
}
const searchTracksByMaiaId = async (id) => {
  const xAuth = CookieManager.getCookie(‘x-auth’);
  let body = {“query”:“”,“options”:{“filters”:{“exclude”:[]},“searchId”: id, “size”:20,“search_descriptions”:false}};
  let URL = ‘https://api-v2.mewo.io/public/search’;
  let response = await fetch(URL, {
    method: ‘POST’,
    headers: {
      ‘Content-Type’: ‘application/json’,
      ‘x-auth’: xAuth,
      ‘x-host’: ‘srstaging.mewo.io’
    },
    body: JSON.stringify(body)
  }).then(res => res.json());
  return response;
}
const normalTextSearch = async (keyword) => {
  // const xAuth = CookieManager.getCookie(‘x-auth’);
  // let body = {“query”:“”,“options”:{“filters”:{“exclude”:[]},“searchId”: id, “size”:20,“search_descriptions”:false}};
  // let URL = ‘https://api-v2.mewo.io/public/search’;
  // let response = await fetch(URL, {
  //   method: ‘POST’,
  //   headers: {
  //     ‘Content-Type’: ‘application/json’,
  //     ‘x-auth’: xAuth,
  //     ‘x-host’: ‘srstaging.mewo.io’
  //   },
  //   body: JSON.stringify(body)
  // }).then(res => res.json());
  // return response;
}
const API = {
  getTracks,
  playTrack,
  createUser,
  signIn,
  searchTracks,
  getAllTags,
  activateUser,
  createProject,
  getProjects,
  addTrackToProject,
  addTrackToFavorites,
  getFavoriteTracks,
  getDownloadTracks,
  downloadArchiveTrack,
  getHistoryTracks,
  getDownloadTrackList,
  setDownloads,
  keywordsAndMaiaSearch,
  searchTracksByMaiaId,
  normalTextSearch
};
export default API;

*/