const { Router }     = require("express");
const ViewController = require("../controllers/view.controller");
const WallController = require("../controllers/wall.controller");

const WallRoute = Router();

WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/wall", (req, res) => { new WallController(req, res).wall(); });


WallRoute.get("/logout", (req, res) => { new ViewController(req, res).logout(); });
WallRoute.post("/register", (req, res) => { new ViewController(req, res).register_proccess(); })
WallRoute.post("/login", (req, res) => { new ViewController(req, res).login_proccess(); })

WallRoute.post("/createMessage", (req, res) => { new WallController(req, res).createMessage(); })
WallRoute.post("/createComment", (req, res) => { new WallController(req, res).createComment(); })

WallRoute.post("/deleteComment", (req, res) => { new WallController(req, res).deleteComment(); })
WallRoute.post("/deleteMessage", (req, res) => { new WallController(req, res).deleteMessage(); })


module.exports = WallRoute;