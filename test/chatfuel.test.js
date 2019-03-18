var Chatfuel = require("../index");

//////////// TESTS ZONE /////////////
var chatfuelled = new Chatfuel();
var chatfuelled2 = new Chatfuel();
var chatfuelled3 = new Chatfuel();
chatfuelled.addMessage("Test message 1");
chatfuelled.addMessage("Test message 2");
chatfuelled.addImage("https://media.giphy.com/media/3oz8xPKZN7EwfcD0ys/giphy.gif");
chatfuelled.addFile("https://www.lyca.ch/images/eleves/TM_Guide_Redaction_EPFL.pdf");

var newGallery = chatfuelled.newGallery();
chatfuelled.addElementToGallery(
  newGallery,
  "My first gallery",
  "https://www.jqueryscript.net/images/jQuery-Plugin-For-Stacked-Polaroid-Image-Gallery-Photopile.jpg",
  "My amazing description",
  chatfuelled.sanitizeToButton("web_url", "https://www.jqueryscript.net/gallery/jQuery-Plugin-For-Stacked-Polaroid-Image-Gallery-Photopile.html", "jQuery Gallery plugin"),
  chatfuelled.sanitizeToButton("show_block", ["Bye 1", "Bye 2"], "bye")
);
var elementID = chatfuelled.addElementToGallery(
  newGallery,
  "My second gallery",
  "http://shivagallery.org/wp-content/uploads/2015/01/img_0789-370x247.jpg",
  "My amazing description 2",
  chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/", "TITLEEEE"),
  chatfuelled.sanitizeToButton("show_block", ["Bye 1", "Bye 2"], "Bye 2")
);
chatfuelled.addDefaultActionToElement(newGallery,elementID,"web_url","https://www.restaurant-chez-ana.ch/");

chatfuelled2.addButtons(
  "my amazing buttons",
  chatfuelled2.sanitizeToButton("web_url", "https://www.google.ch/", "Go to Goole"),
  chatfuelled2.sanitizeToButton(
    "web_url", 
    "https://www.google.ch/maps", 
    "Go to Maps",
    "Web title",
    "Web value"),
  chatfuelled2.sanitizeToButton(
    "show_block", 
    ["Bye 1", "Bye 2"], 
    "BYE 3",
    "title",
    "value",
    "title2",
    "value",
    "title3",
    "value",
    "title4",
    "value")
);

console.log(chatfuelled.toJson(true));

chatfuelled3.addUserAttributes("name","Paul");
chatfuelled3.addUserAttributes("age","30");
chatfuelled3.redirectToBlocks(["block1"]);
//console.log(chatfuelled2.toJson(true));