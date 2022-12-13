const User = require("../models/user.js");
const Message = require("../models/message.js");
const Comment = require("../models/comment.js");
class WallController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    wall = async () => {
        let [data] = await User.loadProfile(this.#req.session.userid);
        let all_messages = await Message.retrieve();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        for(let i = 0; i < all_messages.result.length; i++){
            let d = new Date(all_messages.result[i].created_at).toLocaleDateString(undefined, options);
            all_messages.result[i].created_at = d;
            let all_comments = await Comment.retrieve(all_messages.result[i].id);
            for(let j = 0; j < all_comments.result.length; j++){
                let d = new Date(all_comments.result[i].created_at).toLocaleDateString(undefined, options);
                all_comments.result[j].created_at = d;
            }
            all_messages.result[i]['comments'] = all_comments.result;
        }


        this.#res.render("wall.ejs", {userdata : data, all_messages: all_messages.result});
    }
    createMessage = async () => {
        let create_message = await Message.create(this.#req.session.userid, this.#req.body);
        this.#res.redirect("/wall");
    }

    createComment = async () => {
        let create_comment = await Comment.create(this.#req.session.userid, this.#req.body);
        this.#res.redirect("/wall");
    }

    deleteComment = async () => {
        let delete_comment = await Comment.delete(this.#req.body);
        this.#res.redirect("/wall");
    }

    deleteMessage = async () => {
        let delete_message = await Message.delete(this.#req.body);
        this.#res.redirect("/wall");
    }



}

module.exports = WallController;