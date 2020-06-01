const express = require ('express');
const config = require ('./config');
const body_parser = require('body-parser');
///////////////
const PORT = process.env.PORT || '8080';
const PASSWORD = process.env.REDIS_PASSWORD || 'Password has not setted';
const APP_NAME = process.env.APP_NAME || 'My Random Expencional app';

//////////////
const logger = config.logger;
const app = express();
app.use(body_parser.json());

/////////////

ping = (req, res) => {
    logger.debug(`pod: ${config.pod_name} - Request: /ping, http_verb: GET`);
    res.send('pong');
}

password = (req, res) => {
    logger.debug(`pod: ${config.pod_name} - Request: /password, http_verb: GET`);
    res.send(PASSWORD);
}

pod = (req, res) => {
    logger.debug(`pod: ${config.pod_name} - Request: /pod, http_verb: GET`);
    res.send(
        config.pod_name
    );
}

clean = (req, res) => {
    logger.debug(`pod: ${config.pod_name} - Request: /clean, http_verb: DELETE`);
    config.cleanAll();
    res.send('Wait a minute')
}

app.get('/ping', ping);
app.get('/password', password);
app.get('/pod', pod);
app.delete('/clean', clean)
app.use('/exceptions/', require('./exceptions/exceptions'));

app.listen(PORT, () => {
    config.startup();
    logger.info(`pod: ${config.pod_name} Server started`);
    console.log(`${APP_NAME} listening on port ${PORT}`);
});