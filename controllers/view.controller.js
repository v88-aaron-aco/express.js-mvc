const User = require("../models/user.js");
class ViewController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    login = async () => {
        let login = await User.retrieve(this.#req.body);
        if(login === false){
            console.log('Invalid credentials!');
            this.#res.redirect("/");
        }else{
            console.log('Login success!');
            this.#res.redirect("/wall");
            this.#req.session.userid = login;
            this.#req.session.save();
        }
    }

    homepage = async () => {
        this.#res.render("login.ejs");
    }

    register = async () => {
        let result = await User.create(this.#req.body);
        if(result){
           console.log('You may now log in!');
           this.#res.redirect("/");
        }
    }

    logout = async () => {
        delete this.#req.session.user;
        this.#res.redirect("/");
    }
}

module.exports = ViewController;