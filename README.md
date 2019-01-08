# ChatFuel JSON API NodeJS library (TESTING)
This library enables you to create the right JSON format for the Chatfuel JSON API.

This library can be used ES5 with compatible Node versions. 

Chatfuel is an easy to use Messenger Bot creation platform.

## Chatfuel JSON API
The Chatfuel JSON API is well documented on the Chatfuel.com website. It can be found [here](https://docs.chatfuel.com/api/json-api/json-api).

## Install

Soon to come... 

## Library usage
This library helps you only to create the right JSON format. The result must then be read by Chatfuel API.

### Getting started

```js
var Chatfuel = require("chatfuel-jsonify");
```

### Create an object

```js
var chatfuelled = new Chatfuel();
```

Now you can start creating your final JSON result using the methods described below.

### Methods

#### .addMessage (message)

> Use this response to send one text message.

| Attribute | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| message   | string | yes      | The message that will be shown to the user |
##### Example

```js
chatfuelled.addMessage("Test message 1");
```

 #### .addImage (url)

> Use this response to send image files. Messenger supports JPG, PNG and GIF images. If you are having issues with GIF rendering, please try to reduce the file size.

| Attribute | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| url       | string | yes      | The image url |

##### Example

```js
chatfuelled.addImage("https://media.giphy.com/media/3oz8xPKZN7EwfcD0ys/giphy.gif");
```

#### .addFile (url)

> Use this response to send any other files, which are no larger than 25 MB.

| Attribute | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| url       | string | yes      | The file url |

#### .newGallery()

Create a new empty horizontal scrollable gallery. You need to add one element minimum using  **.addElementToGallery** (described below)

**Return** Gallery's ID

##### Example

```js
var newGallery = chatfuelled.newGallery();
```

#### .sanitizeToButton (request_type, target, title)

Created a JSONified buttons for Chatfuel. Must be used with **.addElementToGallery** or **.addButtons**. You can set buttons to link to a block in the dashboard, open a website, or send another request to your backend. 

Messenger also supports specialised buttons:

- The Call button dials a phone number when tapped.
- The Share button opens a share dialog in Messenger enabling people to share the bot message with their friends. (Gallery template only)

| Attribute    | Type   | Required | Description                                                  |
| ------------ | ------ | -------- | ------------------------------------------------------------ |
| request_type | string | yes      | **Must be one of these**: <br />- web_url: URL<br />- show_block: redirect to block<br />- json_plugin_url: send another request to your backend<br />- phone_number: call a phone number<br />- [ONLY ON GALLERY] element_share: To share the current element |
| target       | string | yes      | Must be:<br />- _if _request_type_ = _show_block:_  a list of block names (["block 1", "block 2"]) or<br />- if _request_type_ = _web_url_ OR _json_plugin_url_: a web link or<br />- if _request_type_ = _phone_number_: a phone number (format: +19268881413). |
| title        | string | yes      | Button's title. Will be shown over the button.               |

##### Example

```js
chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/", "Go to Goole")
```

#### .addElementToGallery (gallery_id, title, img_url, description, buttons...)

Add a new element to _gallery_id_. An element is by a title, an image, a description and buttons to request input from the user. Each element can have up to 5 buttons.

| Attribute   | Type   | Required | Description                                                  |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| gallery_id  | int    | yes      | The gallery ID. Use _.newGallery()_ to get a new id          |
| title       | string | yes      | The title of the gallery                                     |
| img_url     | string | yes      | The image url                                                |
| description | string | yes      | Some description for the _subtitle_ tag                      |
| button1     | JSON   | yes      | 1 to 5 buttons added as parameters. Use _.sanitizeToButton()_ for each button to generate the needed code. See the example below |
| ...         |        | no       |                                                              |
| button5     | JSON   | no       |                                                              |

##### Example

```js
chatfuelled.addElementToGallery(
  newGallery,
  "My first gallery",
  "https://www.jqueryscript.net/images/jQuery-Plugin-For-Stacked-Polaroid-Image-Gallery-Photopile.jpg",
  "My amazing description",
  chatfuelled.sanitizeToButton("web_url", "https://www.jqueryscript.net/gallery/jQuery-Plugin-For-Stacked-Polaroid-Image-Gallery-Photopile.html", "jQuery Gallery plugin"),
  chatfuelled.sanitizeToButton("show_block", ["Bye 1", "Bye 2"], "bye")
);
```

#### .addButtons (message, buttons...)

Use this function to add buttons to your responses. Buttons are limited to 3 items per message.

| Attribute | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| message   | string | yes      | The message that will be shown to the user over the button   |
| button1   | JSON   | yes      | The JSON representation of the button. Use _.sanitizeToButton()_ for each button to generate the needed code. See the example below |
| button2   | JSON   | no       | Same.                                                        |
| button3   | JSON   | no       | Same.                                                        |

##### Example

```js
chatfuelled.addButtons(
  "my amazing buttons",
  chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/", "Go to Goole"),
  chatfuelled.sanitizeToButton("web_url", "https://www.google.ch/maps", "Go to Maps"),
  chatfuelled.sanitizeToButton("show_block", ["Bye 1", "Bye 2"], "BYE 3")
);
```

#### .addUserAttributes (name, value)

Set user attributes without having the user to tap any button.

| Attribute | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| name      | string | yes      | Attribute's name  |
| value     | string | yes      | Attribute's value |

##### Example

```js
chatfuelled.addUserAttributes("age","30");
```

## TODO

- Add exceptions support
- Add logs (warn, error, info)