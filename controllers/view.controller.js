/**
 * @todo Add more documentation
 */
const User = require("../models/user.js");

/**
 * @class ViewController
 */

class ViewController {
    #req;
    #res;
    constructor(req, res) {
        this.#req = req;
        this.#res = res;
    }

    /**
     * DOCU: Function to render the login page. <br/>
     * Triggered: When initial loading of the page <br/>
     * Last Updated Date: December 12, 2022. 
     * @async
     * @function
     * @author Aaron Aco
     */
    homepage = async () => {
        this.validateSession();
        if(this.#req.session.alert){
            var alert =  this.#req.session.alert;
            delete this.#req.session.alert;
        }
        this.#res.render("login.ejs", {alert : alert});
    };

    /**
     * DOCU: Function to to proccess and validate the login form data. <br/>
     * Triggered: When the login button is clicked. <br/>
     * Last Updated Date: December 12, 2022. 
     * @async
     * @function
     * @returns {void}
     * @author Aaron Aco
     */
    login_proccess = async () => {
        let user_login = new User();
        let login_response_data = await user_login.retrieve(this.#req.body);

        if (!login_response_data.status) {
            this.#req.session.alert =  {
                title: login_response_data.error,
                message: login_response_data.result};
            this.#req.session.save();
            this.#res.redirect("/");
            return;
        }

        if (login_response_data.status && login_response_data.result.length) {
           this.#req.session.user = {
            uid: login_response_data.result[0].id,
            first_name: login_response_data.result[0].first_name,
            last_name: login_response_data.result[0].last_name
           }
            this.#req.session.save();
            this.#res.redirect("/wall");
        } else {
            login_response_data.error = "Incorrect Credentials.";
            login_response_data.status = false;
            this.#req.session.alert =  {
                title: login_response_data.error,
                message: login_response_data.result};
            this.#req.session.save();
            this.#res.redirect("/");
        }
    };

    /**
     * DOCU: Function to process and create a user <br/>
     * Triggered: When the register button is clicked in the registration form <br/>
     * Last Updated Date: December 12, 2022.
     * @async
     * @function
     * @author Aaron Aco
     */
    register_proccess = async () => {
        let new_user = new User();
        let create_user_result = await new_user.create(this.#req.body);
        if(create_user_result.status){
            this.#req.session.alert =  {
                title: "Success! You may now login!",
                message: null};
        }else{
            this.#req.session.alert =  {
                title: create_user_result.error,
                message: create_user_result.result};
        }
        this.#req.session.save();
        console.log(create_user_result);
        this.#res.redirect("/");
    };

    /**
     * DOCU: Function to delete session of the user. <br/>
     * Triggered: When the logout link is clicked. <br/>
     * Last Updated Date: December 13, 2022.
     * @async
     * @function
     * @author Aaron Aco
     */
    logout = async () => {
        delete this.#req.session.user;
        this.#res.redirect("/");
    };

    /**
     * DOCU: Function to check if the user is logged in to prevent access to unathorized pages. <br/>
     * Triggered: When the user directly access a page through the url. <br/>
     * Last Updated Date: December 14, 2022.
     * @function
     * @returns {void}
     * @author Aaron Aco
     */
    validateSession(){
        if(this.#req.session.user){
            this.#res.redirect("/wall");
            return;
        }
    }
}

module.exports = ViewController;
