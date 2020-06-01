const express = require('express');
const config = require('../config');
////////////

///////////
const redis = config.redis;
const ToJson = config.toJson;
const FromJson = config.fromJson;
const logger = config.logger;
const pod_name = config.pod_name;


var exceptions = express.Router();

sort = (exceptions) =>{
    return exceptions.sort(function (ex1, ex2) {
        if (ex1.count < ex2.count) {
          return 1;
        }
        if (ex1.count > ex2.count) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
}

top = (req,res) =>{
    redis.get('exceptions',(error, result)=>{
        logger.debug(`pod: ${pod_name} Request: /exceptions/top, http_verb: GET`);
        res.send(sort(ToJson(result)));
    })
}

remove = (req,res) =>{
    logger.debug(`pod: ${pod_name} Request: /:id, http_verb: DELETE`);
    let ex_id = parseInt(req.params.id);
    redis.get('exceptions',(error, result)=>{
        exceptions = ToJson(result).filter(function( exception ) {
            return exception.id !== ex_id;
        });

        redis.set("exceptions", FromJson(exceptions), (error2 , result2)=>{
            res.send(result2);
        });
    })
}

add = (req,res) =>{
    logger.debug(`pod: ${pod_name} Request: /, http_verb: POST`);
    let new_exception = req.body;
    redis.get('exceptions',(error, result)=>{
        let exceptions = ToJson(result);
        exceptions.push(new_exception);
        redis.set("exceptions", FromJson(exceptions), (error, result)=>{
            res.send(result);
        });
    })
}

vote = (req,res) =>{
    logger.debug(`pod: ${pod_name} Request: /vote/:id, http_verb: PUT`);
    let exId = req.params.id;
    redis.get("exceptions",(error, result)=>{
       let exceptions = ToJson(result);
       exceptions = exceptions.map((exception)=>{
            if(exception.id == exId){
                exception.count ++;
            }

            return exception;
        });

        redis.set("exceptions", FromJson(exceptions), (error2 , result2)=>{
            res.send(result2);
        })
    })
}

exceptions.get('/top', top);
exceptions.delete('/:id', remove);
exceptions.post('/', add);
exceptions.put('/vote/:id', vote)

module.exports = exceptions;
