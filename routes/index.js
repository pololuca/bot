const path = require('path');

module.exports = function (app) {
    app.get("/index", function (req, res) {
        res.render("html/index", { title: "index" });
    });
    app.get("/", function (req, res) {
        res.render("html/index", { title: "index" });
    });
}
