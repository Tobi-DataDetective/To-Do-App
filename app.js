const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose"); // loading the mongoose library
const _ = require("lodash");


const app = express();


app.set("view engine", "ejs"); // checks into the views folder for ejs file
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database (mongoose) connection
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });



// create a schema with validations
const itemSchema = new mongoose.Schema({
    name: String
});

// create a mongoose model
const Item = mongoose.model("Item", itemSchema);


// creating document
const reading = new Item({
    name: "Reading"
});
const cooking = new Item({
    name: "Cooking"
});
const coding = new Item({
    name: "Coding"
});


// putting all the items into an array
const defaultItems = [reading, cooking, coding];


// creating a general page schema for dynamic pagenation
const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

    // Finding all items in defaultItem array and passing forEach in list.ejs
    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            // inserting the items into document
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully inserted to the document");
                }
            });
            res.redirect("/");

        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }


    });

});

// creating dynamic routes
app.get("/:customListName", function(req, res) {
    customListName = _.capitalize(req.params.customListName);

    // locate if a particular custom route exist to avoid repetition
    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                // creating a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
                // console.log("Doesn't Exist");
            } else {
                // show an existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
                // console.log("Exists");
            }
        }
    });


});



// allowing saving of user input
app.post("/", function(req, res) {
    const itemName = req.body.newItem;

    const listName = req.body.list

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();

        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


});

// allowing deletion of checkbox
app.post("/delete", function(req, res) {

    const checkedItemId = req.body.checkBox;
    // when crossing items to delete we try to stop the redirecting to the root page
    const listName = req.body.listName;


    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
                console.log("successfully Deleted");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
});

app.get("/about", function(req, res) {
    res.render("about");
});


app.listen(3000, function() {
    console.log("Running on port 3000");
});