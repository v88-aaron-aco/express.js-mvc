const User = require("../models/user.js");
const Post = require("../models/post.js");
/**
 * @class WallController
 */
class WallController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }
    
    /**
     * DOCU: Function to render the wall view, fetch the user's datain session, and load all the messages and comments. <br/>
     * Triggered: After successfull login. <br/>
     * Last Updated Date: December 13, 2022.
     * @async
     * @function
     * @author Aaron Aco
     */
    wall = async () => {

        this.validateSession();

        if(this.#req.session.alert){
            var alert =  this.#req.session.alert;
            delete this.#req.session.alert;
        }
        let user_data = this.#req.session.user;
        let wall = new Post();
        let posts = await wall.retrieve();
        this.#res.render("wall.ejs" , {user_data : user_data, posts : posts, alert: alert});
    }
    createMessage = async () => {
        let post = new Post();
        let create_message = await post.create(this.#req.session.user.uid, this.#req.body);
        if(create_message.status){
            this.#req.session.alert =  {
                title: "Success! Your message has been posted!",
                message: null};
        }else{
            this.#req.session.alert =  {
                title: create_message.error,
                message: create_message.result};
        }
        this.#req.session.save();
        this.#res.redirect("/wall");

    createComment = async () => {
        let post = new Post();
        let create_comment = await post.reply(this.#req.session.user.uid, this.#req.body);
        if(create_comment.status){
            this.#req.session.alert =  {
                title: "Success! Your comment has been posted!",
                message: null};
        }else{
            this.#req.session.alert =  {
                title: create_comment.error,
                message: create_comment.result};
        }
        this.#req.session.save();
        this.#res.redirect("/wall");
    }

    deleteComment = async () => {
        let post = new Post();
        let delete_comment = await post.deleteComment(this.#req.body);
        if(delete_comment.status){
            this.#req.session.alert =  {
                title: "Success! Your comment has been deleted!",
                message: null};
        }else{
            this.#req.session.alert =  {
                title: delete_comment.error,
                message: delete_comment.result};
        }
        this.#req.session.save();
        this.#res.redirect("/wall");
    }


    deleteMessage = async () => {
        let post = new Post();
        let delete_message = await post.deleteMessage(this.#req.body);
        if(delete_message.status){
            this.#req.session.alert =  {
                title: "Success! Your message has been deleted!",
                message: null};
        }else{
            this.#req.session.alert =  {
                title: delete_message.error,
                message: delete_message.result};
        }
        this.#req.session.save();
        this.#res.redirect("/wall");
    }

    validateSession(){
        if(!this.#req.session.user){
            this.#res.redirect("/");
            return;
        }
    }


}

module.exports = WallController;