- - -


#Pushnav

Version: Alpha

*Pushnav* is a plugin that automates ajax navigation using html5 push-state.

- - -

### Compatibility:

##### HTML5 Browser
- Firefox 4+
- Chrome 8+
- Opera 11.5
- Safari 5.0+
- Safari iOS 4.3+

##### HTML4 Browser
- Internet Explorer 7+


### Dependencies:
- jQuery 1.7.2 (http://jquery.com/)
- History.js (You have to use our version)
- jQuery URL Decoder 1.0 (http://urldecoderonline.com/)

## Still Missing:
- Get back the native anchor behaviour (we disable it to make the plugin works under IE)
- Write the documentation for the transitions


##Documentation in progress

The documentation is still a work in progress.

## Usage

Simply download all dependencies (with the right version). You have to add dependencies to your project like this:
``` javascript
<script src="js/libs/jquery-1.7.2.min.js"></script>
<script src="js/libs/jquery.urldecoder.min.js"></script>
<script src="js/libs/jquery.history.min.js"></script>
```




Pushnav is packaged as a single javascript file which can be loaded either as a script tag in the browser. Simply download the latest stable release from GitHub and add it to your project like this:
``` javascript
<script src="js/pushnav.js"></script>
```


#### Initialization

The general way to setup it is as follows
``` javascript
$.pushnav({

     // Define the default Ajax refresh target (used when they is no target defined)
     defaultTarget: ".pushnav_defaulttarget"     
  
});
```

To instantiate a link, you just have to add data-ajax-target with the DOM selector (a class or id) as value :
``` javascript
<a href="example/description.html" data-ajax-target="#content">Axafiy link</a>
```


####Plugin's options
| Option        | Default value          | Description                                                                        |
|:--------------|:-----------------------|:-----------------------------------------------------------------------------------|
| defaultTarget | .pushnav-defaulttarget | Define the **default Ajax refresh target** (*used when they is no target defined*) |
| disableNotModern | false | Lets **disable** the plugin on browsers that **do not support pushstate** |
| debug | false | Throw debug trace (in the **console.log**)|

## Events
#### Events available

| event                 | When it occurs?                                                                     |
|:----------------------|:------------------------------------------------------------------------------------|
| state_change.pushnav   | When the state change (*Triggered* ***before*** *we load* ***new content***)        |
| content_change.pushnav | When the content is loaded with ajax and the content is already affected to the DOM |
  
#### How to listen
``` javascript
$(window).bind("pushnav_contentchange", function(event, params) {
   // Insert your script here
});
```

## Notice
To make the plugin compatible with Internet Explorer, we disabled the native anchor behaviour (*the page doesn't scroll to the anchor position*).For all anchor href in the current page, we dynamically add this at the end "?isAjax=false&swaptarget=currentpage_url"

If you create dynamically traditionnal anchor tag, you have to add "?isAjax=false&swaptarget=currentpage_url", like this:
``` javascript
<a href="#myAnchor?isAjax=false&swaptarget=currentpage_url">Anchor Link</a>
```



## Authors
- Julie Cardinal
- Mathieu Sylvain

## License
Licensed under the MIT license.
