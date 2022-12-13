const dbcon = require("./connection.js");
const Mysql = require("mysql");
class Message{
    static async create (user_id,{message}) {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
                INSERT INTO messages(user_id, message, created_at, updated_at) 
                    VALUES(?,?,NOW(),NOW())`, [
                        user_id, 
                        message
                    ]);
        response_data = await dbcon.executeQuery(query)
        return response_data.result; 
    }

    static async retrieve () {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
            SELECT users.first_name, users.last_name, messages.* 
            FROM messages 
            INNER JOIN users 
            ON messages.user_id = users.id ORDER BY created_at DESC;`);
        response_data = await dbcon.executeQuery(query)
        return response_data; 
    }
    static async delete ({message_id}) {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
        DELETE messages, comments 
        FROM messages 
        INNER JOIN comments 
        WHERE messages.id = comments.message_id 
        AND messages.id = ?;` , message_id);
        response_data = await dbcon.executeQuery(query)
        return response_data; 
    }

    
}
module.exports = Message;