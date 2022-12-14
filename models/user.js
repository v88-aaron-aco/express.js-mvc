/**
 * @todo Add more documentation
 */
const DBConnection = require("./connection.js");
const Mysql = require("mysql");
const Sha1 = require("sha1");
const { checkFields } = require("../helpers/index.helper");
/**
 * @class User
 */
class User {
    /**
     * DOCU: Function to retrieve a user from the database. <br/>
     * Triggered: When fetching the user in login. <br/>
     * Last Updated Date: December 12, 2022.
     * @async
     * @function
     * @param {object} login_data  - Requires email_address and password
     * @returns {object} response_data - { status: true|false, result: {id, email, first_name, last_name, created_at, updated_at}, error: null|string }
     * @author Aaron Aco
     */
    async retrieve(login_data) {
        let response_data = { status: false, result: null, error: null };
        try {
            let check_fields = checkFields(
                ["email_address", "password"],
                login_data
            );

            if (check_fields.status) {
                let retrieve_query = Mysql.format(
                    `
                    SELECT id, email, first_name, last_name, created_at, updated_at FROM users WHERE email = ? AND password = ?`,
                    [login_data.email_address, Sha1(login_data.password)]
                );
                response_data = await DBConnection.executeQuery(retrieve_query);
            } else {
                response_data = check_fields;
            }
        } catch (login_error) {
            response_data.error = login_error;
        }

        return response_data;
    }

    /**
     * DOCU: Function to create a new user to the database. <br/>
     * Triggered: When proccessing the registration data of a user <br/>
     * Last Updated Date: December 12, 2022.
     * @async
     * @function
     * @param {object} registration_data - Requires first_name, last_name, email_address and password.
     * @returns {object} response_data - { status: false|true, result: {fieldCount, affectedRows, insertId, serverStatus, warningCount, message, protocol41, changedRows}}, error: any };
     * @author Aaron Aco
     */
    async create(registration_data) {
        let response_data = { status: false, result: null, error: null };
        try {
            let check_fields = checkFields(
                ["first_name", "last_name", "email_address", "password"],
                registration_data
            );

            if (check_fields.status) {
                let validate_email_result = await this.validateEmail(registration_data);

                if ( validate_email_result.status && !validate_email_result.result.length) {
                    let create_query = Mysql.format(
                        `
                        INSERT users(first_name, last_name, email, password, created_at, updated_at) 
                        VALUES(?,?,?,?,NOW(),NOW())`,
                        [
                            registration_data.first_name,
                            registration_data.last_name,
                            registration_data.email_address,
                            Sha1(registration_data.password),
                        ]
                    );
                    response_data = await DBConnection.executeQuery(
                        create_query
                    );
                } else {
                    response_data.result = [];
                    response_data.error = "Email address is already in use.";
                }
            } else {
                response_data = check_fields;
            }
        } catch (registration_error) {
            response_data.error = registration_error;
        }

        return response_data;
    }

    /**
     * DOCU: Function to validate the email_address if already in use. <br/>
     * Triggered: When proccessing the registration data <br/>
     * Last Updated Date: December 12, 2022.
     * @async
     * @function
     * @param {object} registration_data  - Requires the email_address
     * @returns {object} response_data  - { status: false|true, result: {id}, error: any }
     * @author Aaron Aco
     */
    async validateEmail(registration_data) {
        let response_data = { status: false, result: null, error: null };
        let validate_email_query = Mysql.format(
            `
                SELECT users.id FROM users WHERE email = ?`,
            [registration_data.email_address]
        );
        response_data = await DBConnection.executeQuery(validate_email_query);

        return response_data;
    }
}
module.exports = User;
