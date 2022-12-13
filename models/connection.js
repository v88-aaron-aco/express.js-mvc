const Mysql = require("mysql");
const Constants = require("../configs/constants");

const DBconnection = Mysql.createPool(Constants.DATABASE);

DBconnection.executeQuery = async (query) => {
    return new Promise((resolve, reject) => {
        DBconnection.query(query, function(error, result){
            let response_data = { status: false, result: null, error: null};

            if(error){
                response_data.error = error;
            }
            else{
                response_data.status = true;
                response_data.result = result;
            }

            resolve(response_data);
        });
    });
}

module.exports = DBconnection;