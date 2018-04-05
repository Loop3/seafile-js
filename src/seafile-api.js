var axios = require('axios');

class SeafileAPI {

  constructor(server, username, password, token) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;
  }

  getToken() {
    const url = this.server + '/api2/auth-token/';
    axios.post(url, {
      username: this.username,
      password: this.password
    })
    .then((response) => {
      this.token = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
  * Login to server and create axios instance for future usage
  */
  login() {
    const url = this.server + '/api2/auth-token/';
    return axios.post(url, {
      username: this.username,
      password: this.password
    })
    .then((response) => {
      this.token = response.data.token;
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  authPing() {
    return this.req.get('/api2/auth/ping/');
  }

  //---- repo API

  listRepos() {
    const url = this.server + '/api2/repos/'
    return this.req.get(url)
  }

  //---- folder API

  listDir(repoID, dirPath) {
    const url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + dirPath;
    return this.req.get(url);
  }

  //---- file api
  getFileDownloadLink(repoID, filePath) {
    // reuse default to 1 to eliminate cross domain request problem
    //   In browser, the browser will send an option request to server first, the access Token
    //   will become invalid if reuse=0
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath + '&reuse=1';
    return this.req.get(url);
  }

  getFileContent(downloadLink) {
    return this.req.get(downloadLink);
  }

  getUpdateLink(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/update-link/?p=' + folderPath;
    return this.req.get(url);
  }

  getUploadLink(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/upload-link/?p=' + folderPath;
    return this.req.get(url);
  }

}

module.exports = { SeafileAPI };
