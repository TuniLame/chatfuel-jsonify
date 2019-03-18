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
 * @param {string} galleryAspectRatio The gallery's image aspect. You can put "square" or
 * "horizontal"
 * 
 * @return {int} the gallery's ID.
 */
Chatfuel.prototype.newGallery = function (galleryAspectRatio) {
  if (galleryAspectRatio != "square" && galleryAspectRatio != "horizontal")
    galleryAspectRatio = "square"
  return this.ChatFueledAnswer.messages.push({
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "image_aspect_ratio": galleryAspectRatio,
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
 * @param {JSON} buttons 1 button per parameter. 3 buttons max. Use sanitizeToButton 
 * for the correct fomat
 * 
 * @returns {boolean} true if the element was added. False otherwise.
 */
Chatfuel.prototype.addElementToGallery = function () {
  if (arguments.length < 5)
    return false;
  if (arguments.length > 7)
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
  return this.ChatFueledAnswer.messages[galleryID].attachment.payload.elements.push(element)-1;
};

Chatfuel.prototype.addDefaultActionToElement= function (
  galleryID,
  elementID,
  type = "web_view", 
  url,
  messenger_extensions = false,
  webview_height_ratio = "tall",
  fallback_url = "null") {
  
  var default_action = {
    "type": type,
    "url": url,
		"messenger_extensions": messenger_extensions,
		"webview_height_ratio": webview_height_ratio,
		"fallback_url": (fallback_url == "null" ? url :  fallback_url)
  }
  this.ChatFueledAnswer.messages[galleryID].attachment.payload.elements[elementID]["default_action"] = default_action;
  return true;
}

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
    }
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
  if (typeof this.ChatFueledAnswer.redirect_to_blocks === 'undefined') {
    // We don't have any message. Let's add our first message
    this.ChatFueledAnswer.redirect_to_blocks = [];
  }
  for (var i = 0; i< blocks.length; i++ )
    this.ChatFueledAnswer.redirect_to_blocks.push(blocks[i]);
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
