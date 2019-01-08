"use strict";
/**
 * Chatfuel class. Use its methods to prepare the Chatfuel's JSON response.
 * 
 * @constructor
 * @todo Quick reply
 */
function Chatfuel() {
  this.ChatFueledAnswer = {};
  if (typeof this.ChatFueledAnswer.messages === 'undefined') {
    // We don't have any message. Let's add our first message
    this.ChatFueledAnswer.messages = [];
  }

}
module.exports = Chatfuel;

Chatfuel.prototype.addImage = function (url) {
  this.addMedia(url, "image");
};

Chatfuel.prototype.addVideo = function (url) {
  this.addMedia(url, "video");
};

Chatfuel.prototype.addAudio = function (url) {
  this.addMedia(url, "audio");
};

Chatfuel.prototype.addFile = function (url) {
  this.addMedia(url, "file");
};

/**
 * Add a media (via link)
 * 
 * @param {String} url The link of the media you want to add
 * @param {String} mediaType The type of the media you want to add. 
 * It can be: image, video, audio or file
 * 
 */
Chatfuel.prototype.addMedia = function (url, mediaType) {
  this.ChatFueledAnswer.messages.push({
    "attachment": {
      "type": mediaType,
      "payload": {
        "url": url
      }
    }
  });
};

/**
 * Add a text message
 * 
 * @param {String} msg the text you want to show to the user
 */
Chatfuel.prototype.addMessage = function (msg) {
  var msgJson = { "text": msg };
  this.ChatFueledAnswer.messages.push(msgJson);
};


/**
 * Add a new Gallery. 
 * 
 * @return {int} the gallery's ID.
 */
Chatfuel.prototype.newGallery = function () {
  return this.ChatFueledAnswer.messages.push({
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "image_aspect_ratio": "square",
        "elements": []
      }
    }
  }) - 1;
}


/**
 * Add one element to a gallery.
 * 
 * @param {int} galleryID the gallery ID on the messages list.
 * @param {String} elementTitle Element: "title"
 * @param {String} elementImgUrl Element: "image_url"
 * @param {String} elementSubtitle Element: "subtitle"
 * @param {JSON} buttons 1 button per parameter. 5 buttons max. Use sanitizeToButton 
 * for the correct fomat
 * 
 * @returns {boolean} true if the element was added. False otherwise.
 */
Chatfuel.prototype.addElementToGallery = function () {
  if (arguments.length < 5)
    return false;
  if (arguments.length > 9)
    return false;
  var galleryID = arguments[0];
  var elementTitle = arguments[1];
  var elementImgUrl = arguments[2];
  var elementSubtitle = arguments[3];

  var element = {
    "title": elementTitle,
    "image_url": elementImgUrl,
    "subtitle": elementSubtitle,
    "buttons": []
  };
  for (var i = 4; i < arguments.length; i++) {
    element.buttons.push(arguments[i]);
  }
  this.ChatFueledAnswer.messages[galleryID].attachment.payload.elements.push(element);
  return true;
};

Chatfuel.prototype.addButtons = function () {
  if (arguments.length < 2)
    return false;
  if (arguments.length > 4)
    return false;
  var msg = arguments[0];
  var buttonsID = this.ChatFueledAnswer.messages.push({
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": msg,
        "buttons": []
      }
    }
  });
  if (buttonsID < 0)
    return false;

  for (var i = 1; i < arguments.length; i++) {
    this.ChatFueledAnswer.messages[buttonsID - 1].attachment.payload.buttons.push(arguments[i]);
  }
  return true;
}

/**
 * Sanitize data to build a new button. This button can (and must) be used with 
 * - Gallery
 * - List
 * - Buttons
 * 
 * @param {String} request_type can be 
 * - web_url: URL
 * - show_block: redirect to block
 * - json_plugin_url: send another request to your backend
 * - phone_number: call a phone number
 * - [ONLY ON GALLERY] element_share: To share the current element [ONLY ON GALLERY]
 * @param {String} target This can be 
 * - if request_type = show_block:  a list of block names (["block 1", "block 2"]) ,
 * - if request_type = show_block OR json_plugin_url: a web link,
 * - if request_type = phone_number: a phone number (format: +19268881413).
 * @param {String} title the title that will be show over the button
 * @param {String} attributes (Optional) a list of names and values attributes 
 * seperated by a comma
 */
Chatfuel.prototype.sanitizeToButton = function () {
  var request_type = arguments[0];
  var target = arguments[1];
  var title = arguments[2];
  var result = {};
  // Extract attributes
  if ((arguments.length > 3) && (arguments.length % 2 != 0 )){
    result.set_attributes = {};
    for (var i = 0; i < (arguments.length-3); i++){
      result.set_attributes[arguments[3+i]] = arguments[3+i+1];
      i = i + 1;
      console.log(i);
    }
    console.log(result);
  }
  
  result.type = request_type;
  if (request_type == "web_url"){
    result.url = target;
    result.title = title;
  }
  else if (request_type == "show_block"){
    result.block_names = target;
    result.title = title;
  }
  else if (request_type == "json_plugin_url"){
    result.url = target;
    result.title = title;
  }
  else if (request_type == "phone_number"){
    result.phone_number = target;
    result.title = title;
  }
  else if (request_type == "element_share")
    result.type = request_type;
  return result;
};


Chatfuel.prototype.addUserAttributes = function (attribute, value){
  if (typeof this.ChatFueledAnswer.set_attributes === 'undefined') {
    // We don't have any message. Let's add our first message
    this.ChatFueledAnswer.set_attributes = {};
  }
  this.ChatFueledAnswer.set_attributes[attribute] = value;
}

Chatfuel.prototype.redirectToBlocks = function (blocks){
  if (typeof this.ChatFueledAnswer.redirect_to_blocs === 'undefined') {
    // We don't have any message. Let's add our first message
    this.ChatFueledAnswer.redirect_to_blocs = [];
  }
  for (var i = 0; i< blocks.length; i++ )
    this.ChatFueledAnswer.redirect_to_blocs.push(blocks[i]);
}

/** 
 * Convert the current Chatfuel object to JSON for export to Chatfuel.com
 * 
 * 
 */
Chatfuel.prototype.toJson = function (stringify) {
  var stringify = stringify == null ? "nothing" : stringify;
  if (stringify == "nothing")
    return this.ChatFueledAnswer;
  else if (stringify == true)
    return JSON.stringify(this.ChatFueledAnswer);
};


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
chatfuelled.addElementToGallery(
  newGallery,
  "My second gallery",
  "http://shivagallery.org/wp-content/uploads/2015/01/img_0789-370x247.jpg",
  "My amazing description 2",
  chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/", "TITLEEEE"),
  chatfuelled.sanitizeToButton("show_block", ["Bye 1", "Bye 2"], "Bye 2")
);
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

//console.log(chatfuelled2.toJson());

chatfuelled3.addUserAttributes("name","tunilame");
chatfuelled3.addUserAttributes("age","30");
chatfuelled3.redirectToBlocks(["block1"]);
console.log(chatfuelled2.toJson(true));