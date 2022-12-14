const DBConnection = require("./connection.js");
const Mysql = require("mysql");
const { checkFields } = require("../helpers/index.helper");
/**
 * @class Post
 */
class Post{

    /**
     * DOCU: Function to retrieve both message and comments from the database using nested queries. <br/>
     * Triggered: When loading the wall page after the successfull logged in of the user. <br/>
     * Last Updated Date: December 14, 2022
     * @async
     * @function
     * @returns {object} - response_data {status: true|false, result: {object} | [array], error: any }
     * @author Aaron Aco
     */
     async retrieve () {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
        SELECT messages.id AS message_id, messages.user_id, CONCAT(users.first_name, " ", users.last_name) AS full_name, messages.message, DATE_FORMAT(messages.created_at, "%M %D %Y") AS created_at, messages.isDeleted, messages.created_at AS created_at_sort,
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    "comment_id", comments.id,
                    "user_id", users.id,
                    "full_name", CONCAT(users.first_name, " ", users.last_name),
                    "comment", comments.comment,
                    "isDeleted", "comments.isDeleted",
                    "created_at", DATE_FORMAT(comments.created_at, "%M %D %Y")
                )
            )
            FROM comments
            INNER JOIN users ON users.id = comments.user_id
            WHERE comments.message_id = messages.id AND comments.isDeleted = 0
        ) AS comments
        FROM messages 
        INNER JOIN users ON users.id = messages.user_id AND isDeleted = 0 ORDER BY created_at_sort DESC;`);
        response_data = await DBConnection.executeQuery(query);

        return response_data; 
    }

    /**
     * DOCU: Function to create a new message in the database. <br/>
     * Triggered: When the create message proccess is triggered. <br/>
     * Last Updated Date: December 14, 2022.
     * @async
     * @function 
     * @param {integer} user_id  - Requires the id of the user from the session
     * @param {object} form_data - Requires the message
     * @returns {object} response_data - {status: true|false, result: {object} | [array], error: any}
     * @author Aaron Aco
     */
     async create (user_id,form_data) {
        let response_data = { status: false, result: null, error: null };
        let check_fields = checkFields(
            ["message"],
            form_data
        );
        if (check_fields.status) {
            let create_message_query = Mysql.format(`
            INSERT INTO messages(user_id, message, created_at, updated_at) 
                VALUES(?,?,NOW(),NOW())`, [
                    user_id, 
                    form_data.message
                ]);
            response_data = await DBConnection.executeQuery(create_message_query);

        } else {
            response_data = check_fields;
        }

        return response_data; 
    }

    /**
     * DOCU: Function to create a new comment to a message in the database. <br/>
     * Triggered: When the create comment is triggered. <br/>
     * @param {integer} user_id  - Requires the user id from the session
     * @param {object} form_data  - Requires the comment
     * @returns {object} - response_data {status: false|true, result: {object} | [array], error: any}
     * @author Aaron Aco
     */
     async reply (user_id,form_data) {
        let response_data = { status: false, result: null, error: null };
        let check_fields = checkFields(
            ["comment"],
            form_data
        );

        if (check_fields.status) {
            let create_comment_query = Mysql.format(`
            INSERT INTO comments(user_id,message_id, comment, created_at, updated_at)
                VALUES(?,?,?,NOW(),NOW())`, [
                    user_id,
                    form_data.message_id, 
                    form_data.comment
                ]);
            response_data = await DBConnection.executeQuery(create_comment_query);
        } else {
            response_data = check_fields;
        }

        return response_data; 
    }

    /**
     * DOCU: Function to update the comment isDeleted column value to true/1 in the database. <br/>
     * Triggered: When delete comment proccess is triggered. <br/>
     * Last Updated Date: December 14, 2022.
     * @async
     * @function
     * @param {object} {comment_id} - Requires the comment id 
     * @returns {object} response_data {status: true|false, result: {object} | [array], error: any}
     * @author Aaron Aco
     */
     async deleteComment ({comment_id}) {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
        UPDATE comments 
        SET
        isDeleted = 1,
        updated_at = NOW()
        WHERE id = ?;` , comment_id);
        response_data = await DBConnection.executeQuery(query);

        return response_data; 
    }

    /**
     * DOCU: Function to update the message isDeleted column value to true/1 in the database. <br/>
     * Triggered: When delete message proccess is triggered. <br/>
     * Last Updated Date: December 14, 2022.
     * @async
     * @function
     * @param {object} {message_id} - Requires the message id 
     * @returns {object} response_data {status: true|false, result: {object} | [array], error: any}
     * @author Aaron Aco
     */
    async deleteMessage ({message_id}) {
        let response_data = { status: false, result: null, error: null };
        let query = Mysql.format(`
        UPDATE messages 
        SET
        isDeleted = 1,
        updated_at = NOW()
        WHERE id = ?;` , message_id);
        response_data = await DBConnection.executeQuery(query);

        return response_data; 
    }
}

module.exports = Post;