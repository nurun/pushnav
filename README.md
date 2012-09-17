- - -


#Pushnav


*Pushnav* is a plugin that automates ajax navigation using html5 push-state.

- - -

###Compatibility:
- Firefox 4+
- Chrome 8+
- Opera 11.5
- Safari 5.0+
- Safari iOS 4.3+


###Dependencies:
- jQuery 1.7.2 (http://jquery.com/)
- History.js (https://github.com/balupton/history.js)
- jQuery URL Decoder 1.0 (http://urldecoderonline.com/)
 


##Documentation in progress

The documentation is still a work in progress.

## Usage

Simply download all dependencies (with the right version). You have to add dependencies to your project like this:
``` javascript
<script src="js/libs/jquery-1.7.2.min.js"></script>
<script src="js/libs/jquery.urldecoder.min.js"></script>
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

## Events
#### Events available

| event                 | When it occurs?                                                                     |
|:----------------------|:------------------------------------------------------------------------------------|
| pushnav_statechange   | When the state change (*Triggered* ***before*** *we load* ***new content***)        |
| pushnav_contentchange | When the content is loaded with ajax and the content is already affected to the DOM |
  
#### How to listen
``` javascript
$(window).bind("pushnav_contentchange", function(event, params) {
   // Insert your script here
});
```
  
  


