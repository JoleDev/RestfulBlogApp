//Including all the npm libraries needed for the application
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    express = require("express"),
    app = express();

//Start of setting-up initial express, ejs and body-parser setups
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

//Start of setting up mongoose, Defining db schema, and assign db schema model to the blog variable
mongoose.connect("mongodb://localhost/blog_app");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);
//End of setting up mongoose, Defining db schema, and assign db schema model to the blog variable

//Start of Defining Restful Routes

//Root Route
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogPosts) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                blogPosts: blogPosts
            });
        }
    });
});

//NEW Route
app.get("/blogs/new", function (req, res) {
    res.render("newPost");
});

//CREATE Route
app.post("/blogs", function (req, res) {
    //Create blog post in the db
    Blog.create(req.body.newPost, function (err, newPost) {
        if (err) {
            console.log(err);
        } else {
            //Redirecting to the /blogs page once the create operation is done by mongo
            res.redirect("/blogs");
        }
    });
});

//SHOW Route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, postReturned) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("showPost", {
                showPost: postReturned
            });
        }
    });
});

//EDIT Route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, postReturned) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("editPost", {
                editPost: postReturned
            });
        }
    });
});

//UPDATE Route
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.editPost, function (err, editPost) {
        if (err) {
            console.log(err);
            res.redirect("/blogs/" + req.params.id);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("blogs/:id", function (req, res) {
    res.send ("You reached the delete route");
    // Blog.findByIdAndRemove(req.params.id, function (err) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect("/blogs");
    //     } else {
    //         res.redirect("/blogs");
    //     }
    // });
});

//End of Defining Restful Routes


//Defining the server port
app.listen(3000, function () {
    console.log("Blog application server started");
});