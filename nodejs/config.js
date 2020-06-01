const fs = require('fs');
const redis_config = require("redis");
var log4js = require("log4js");
//////////
const REDIS = process.env.REDIS || 'localhost:6379';
const PATH_CONFIG = process.env.PATH_CONFIG || './config/java.json';
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const LOG_PATH = process.env.LOG_PATH || './';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const POD_NAME = process.env.POD_NAME;
/////////
const pod_name = POD_NAME ? 'I am living in the pod ' + POD_NAME : 'I do not know where I am'
let auth = REDIS_PASSWORD != null ? { password : REDIS_PASSWORD} : {};

const redis = redis_config.createClient('redis://'+ REDIS, auth);

log4js.configure({
    appenders: { exceptions: { type: "file", filename: LOG_PATH + 'exceptions.log'} },
    categories: { default: { appenders: ["exceptions"], level: LOG_LEVEL } }
});

const logger = log4js.getLogger("exceptions");

fromJson = (json) =>{   
    return JSON.stringify(json);;
}

toJson = (json) =>{
    return JSON.parse(json)
}

load = ()=>{
    redis.get('exceptions', function(err, reply) {
        if(reply == null){
            console.log('there are not information about exceptions in redis');
            let data = fs.readFileSync(PATH_CONFIG);
            // let exceptions_data = JSON.parse(rawdata);
            redis.set("exceptions", data);
            console.log('The information was loaded');
        }
      });
}

cleanAll = (funct) => {
    console.log('CLeaning data')
    redis.del('exceptions', (error, result)=>{
        console.log('Clean complete')
        load();
    })
}


startup = () => {
    load();
}    

module.exports = { redis, startup , toJson , fromJson , cleanAll , logger, pod_name}