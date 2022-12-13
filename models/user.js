const dbcon = require("./connection.js");
const Mysql = require("mysql");
const sha1 = require("sha1");
class User{
    static async create ({email_address, first_name, last_name, password}) {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
                INSERT users(first_name, last_name, email, password, created_at, updated_at) 
                    VALUES(?,?,?,?,NOW(),NOW())`, [
                        first_name, 
                        last_name, 
                        email_address,
                        sha1(password)
                    ]);
        response_data = await dbcon.executeQuery(query)
        return response_data.result; 
    }

    static async retrieve ({email_address, password}) {
        let result = false
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
                SELECT * FROM users WHERE email = ? AND password = ?`, [
                        email_address, 
                        sha1(password)
                    ]);
        response_data = await dbcon.executeQuery(query)
        if(response_data.result.length >0){
            result = response_data.result[0].id; 
        }
        return result; 
    }

    static async loadProfile (id) {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
                SELECT users.id, users.first_name, users.last_name FROM users WHERE id = ?`, [id]);
        response_data = await dbcon.executeQuery(query)
        return  response_data.result; 
    }
    
}
module.exports = User;