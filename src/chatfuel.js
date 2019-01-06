"use strict";
/**
 * Chatfuel class. Use its methods to prepare the Chatfuel's JSON response.
 * @todo Quick reply
 */
function Chatfuel() {
  this.ChatFueledAnswer = {};
  if (typeof this.ChatFueledAnswer.messages === 'undefined') {
    // We don't have any message. Let's add our first message
    this.ChatFueledAnswer.messages = [];
  }

}


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
 * @param url The link of the media you want to add
 * @param mediaType The type of the media you want to add. 
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
 * @param msg the text you want to show to the user
 */
Chatfuel.prototype.addMessage = function (msg) {
  var msgJson = { "text": msg };
  this.ChatFueledAnswer.messages.push(msgJson);
};


/**
 * Add a new Gallery. 
 * 
 * @returns the gallery's ID.
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
 * @param galleryID the gallery ID on the messages list.
 * @param elementTitle Element: "title"
 * @param elementImgUrl Element: "image_url"
 * @param elementSubtitle Element: "subtitle"
 * @param buttons 1 button per parameter. 5 buttons max. Use sanitizeToButton 
 * for the correct fomat
 * 
 * @returns true if the element was added. False otherwise.
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
 * @param request_type can be 
 * - web_url: URL
 * - show_block: redirect to block
 * - json_plugin_url: send another request to your backend
 * - phone_number: call a phone number
 * - [ONLY ON GALLERY] element_share: To share the current element [ONLY ON GALLERY]
 * @param target This can be 
 * - if request_type = show_block:  a list of block names (["block 1", "block 2"]) ,
 * - if request_type = show_block OR json_plugin_url: a web link,
 * - if request_type = phone_number: a phone number (format: +19268881413).
 * @param title the title that will be show over the button
 */
Chatfuel.prototype.sanitizeToButton = function (request_type, target, title) {
  var result = {};
  if (request_type == "web_url")
    result = {
      "type": request_type,
      "url": target,
      "title": title
    };
  else if (request_type == "show_block")
    result = {
      "type": request_type,
      "block_names": target,
      "title": title
    };
  else if (request_type == "json_plugin_url")
    result = {
      "type": request_type,
      "url": target,
      "title": title
    };
  else if (request_type == "phone_number")
    result = {
      "type": request_type,
      "phone_number": target,
      "title": title
    };
  else if (request_type == "element_share")
    result = {
      "type": request_type
    };
  return result;
};


Chatfuel.prototype.addUserAttributes = function (attribute, value){
  if (typeof this.ChatFueledAnswer.set_attributes === 'undefined') {
    // We don't have any message. Let's add our first message
    this.ChatFueledAnswer.set_attributes = {};
  }
  this.ChatFueledAnswer.set_attributes[attribute] = value;
}

/** 
 * Convert the current Chatfuel object to JSON for export to Chatfuel.com
 */
Chatfuel.prototype.toJson = function () {
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
  chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/", "Go to Goole"),
  chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/maps", "Title 2"),
  chatfuelled.sanitizeToButton("show_block", ["Bye 1", "Bye 2"], "BYE 3")
);

//console.log(chatfuelled2.toJson());

chatfuelled3.addUserAttributes("name","tunilame");
chatfuelled3.addUserAttributes("age","30");
console.log(chatfuelled3.toJson());