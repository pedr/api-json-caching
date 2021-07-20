const https = require('https')
const fs = require('fs')

const FOLDER = './data';

const getCryptoInfoAndSave = () => {
  return _httpsRequest({
    host: 'api.coincap.io',
    path: '/v2/markets'
  })
    .then(res => {  
      _saveApiContentToFile(res);
    })
}

const getLatestCached = () => {
  return new Promise((resolve, reject) => {
    return fs.readdir(FOLDER, (err, val) => {
      if (err) return reject(err)
      // nodejs readdir ""ordena"" arquivos
      const latestFilename = val[val.length - 1];
      return fs.readFile(`${FOLDER}/${latestFilename}`, { encoding: 'utf8' }, (err, data) => {
        if (err) return reject(err);

        return resolve({
          metadata: {
            updatedAt: +latestFilename.replace('.json', ''),
            from: 'api.coincap.io/v2/markets',
          },
          data: JSON.parse(data)
        });
      })
    });
  });
}


const _httpsRequest = (params) => {
  return new Promise((resolve, reject) => {
    return https.request(params, res => {
      let content = "";
      res.on('error', reject);
      res.on('data', val => content += val)
      res.on('end', () => resolve(content))
    }).end()
  })
}

const _saveApiContentToFile = (fileContent) => {
  const fileName = new Date().getTime();
  return fs.writeFileSync(`${FOLDER}/${fileName}.json`, fileContent, { encoding: 'utf8'});
}


module.exports = {
  getCryptoInfoAndSave,
  getLatestCached, 
}