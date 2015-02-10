# Catdown

## A sane and pluggable Markdown editor.

Catdown is a Markdown editor for the web. It's designed to be simple to install, configure, extend and use.

Built on the excellent [CodeMirror](http://codemirror.net) and not dependent on jQuery.

### Installation

Install it with npm.

```bash
$ npm install --save catdown
```

### Usage

Assume the following HTML for all examples.

```html
<head>
    <link rel="stylesheet" href="node_modules/catdown/styles/dist/catdown.css">
</head>
<body>
    <textarea id="md-editor"></textarea>
    <section id="md-preview"></section>
</body>
```

#### The most common use case

The following is all you need to make a fully functioning Catdown editor with a live preview.

```js
// Import Catdown
var Catdown = require("catdown");

// Create an editor
var editor = new Catdown({
    textarea: document.getElementById("md-editor"),
    preview: docuent.getElementById("md-preview")
});
```

#### A thorough example

```js
var Catdown = require("catdown");

// Make a new editor
var editor = new Catdown({
    // Bind your DOM elements
    textarea: document.getElementById("md-editor"),
    preview: document.getElementById("md-preview"),

    // Import some useful plugins. Equivalent to using
    // editor.use([require("catdown-wordcount"), ...])
    plugins: [
        require("catdown-wordcount"),
        require("catdown-scrollsync")
    ],

    // Setup some events. Equivalent to using
    // editor.on("wordcount", fn);
    events: {
        "wordcount": function(num, str){
            document.getElementById("word-count").innerHTML = str;
        }
    }
});
```

### API

In the following, assume `editor` is an instance of Catdown.

#### Methods

**`editor.set(markdown);`**

* Set content of the editor.

**`editor.value();`**

* Get the current value of the editor.

**`editor.toHTML();`**

* Parse the current value of the editor as HTML using the instances `parser`.

**`editor.focus([tail]);`**

* Focus the editor. If `true` is passed, focusses at the end of the editor.

**`editor.render();`**

* Render the preview.

**`editor.setKeys(hash);`**

* Add a hash of key handlers to the instance. Keys should be key combinations like "`Shift-Ctrl-X`," values should be functions which will be bound to the instance.
```js
{
	"Ctrl-B": function(){
    	this._surroundSelection("**");
    }
}
```

**`editor.on(event, handler);`**

* Typical events. Call a handler function, automatically bound to the Catdown instance, every time the event is triggered. For example `editor.on("ready", readyFunction;` Multiple event names can be used, eg. `editor.on("ready change", fn)`.

#### Properties

**`editor.$textarea`**

* The textarea DOM element.

**`editor.$editor`**

* The CodeMirror DOM element.

**`editor.$scroll`**

* The scrolling DOM element of the CodeMirror element.

**`editor.keymap`**

* Hash of key bindings currently active on editor.

**`editor.editor`**

* The `CodeMirror` instance that the Catdown instance is based on. Catdown has some shorthand functions like `#setKeys` and `#value` that delegate to this, but you can access it directly if you need more advanced functionality.

> Note: it's generally better to use `Catdown#setKeys` instead of `CM.setOption("extraKeys")`, as the former extends the current keymap instead of replacing it entirely.


### Options

* `textarea` - A textarea element to create the CodeMirror editor from. Can be a DOM node or a jQuery object. Defaults to a new textarea element.

* `preview` - An element to hold the converted HTML live. Can be a DOM node or a jQuery object. Defaults to null.

* `parser` - A synchronous function that accepts a Markdown string and returns a HTML string. Defaults to [`marked`](https://www.github.com/chjj/marked).

* `plugins` - A plugin function, plugin hash containing `handler` and `options` keys, or an array of either of those. For example:
```js
[
	require("catdown-scrollsync"),
    {
    	handler: require("catdown-hash"),
        options: {}
    }
]
```

* `events` - A hash of event handlers. The context of each will be set to the Catdown instance. For example:
```js
{
    "render": function(html){
        console.log(html);
    }
}
```



### Plugins

Since Catdown is designed to be super modular and hackable, most of its functionality is derived from plugins. Even core functionality like rendering and default key handlers is stored in a plugin called `catdown-core`. You can view the source [here](https://www.github.com/zuren/catdown-core).

#### Using existing plugins

Plugins can be used when you create the editor, for example:

```js
var editor = new Catdown({
	// ...
    plugins: [
    	// In an object syntax
        {
        	handler: require("catdown-wordcount"),
            options: {}
        },
        
    	// Just as a function, if you have no options.
    	require("catdown-hash")
    ]
});
```

Plugins can also be bound to an existing editor, using the same syntax.

```js
// A function and optionally an options hash.
editor.use(require("catdown-scrollsync"), {
	/* options */
});

// An object containing handler and options keys.
editor.use({
	handler: fn,
    options: {}
});

// An array of either syntax.
editor.use([
	myPluginFn,
    {
    	handler: blah,
        options: {
        	name: "Richard"
        }
    }
]);
```

#### Writing a plugin

The plugin syntax is really simple, and gives you complete freedom.

Your plugin will be called with the following arguments:

* `options` is whatever value was passed when the plugin was added. Defaults to `{}`.
* `editor` is a reference to the CodeMirror instance.
* `helpers` is a utility module used by Catdown. See [the utils file](https://github.com/zuren/catdown/blob/master/lib/utils.js).

A completely useless plugin might look like this:

```js
var jumpingPlugin = module.exports = function(options, editor, helpers){	
	// Plugins are called with the Catdown instance as context.
	// this instanceof Catdown === true
	
	// Add a controller to the instance.
	this.jump = function(num){
		// Trigger an event with some arguments.
		num = num || 2;
		this.signal("jump", num);
	}

	// And listen to the event.
	this.on("jump", function(num){
		console.log("Jumped " + num + " times!");
	});
}
```

Then you could use it like this:

```js
editor.jump(5); // => "Jumped 5 times!"
```

If you decide to write a plugin, and I'd hope it's better than that one, publish it on npm as `catdown-YOURMODULE` so everyone else can find it.

### Styling

Catdown requires styling. Unfortunately NPM isn't great for CSS, so it's probably best to copy the catdown stylesheet at `/styles/dist/catdown.css` to somewhere more convenient. If you want to make do, you can import the default `catdown` theme like this:

```html
<link rel="stylesheet" href="/node_modules/catdown/styles/dist/catdown.css">
```

Or just use a default CodeMirror stylesheet. You can download them [here](https://github.com/codemirror/CodeMirror/tree/master/theme) or use a CDN:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/4.12.0/theme/monokai.min.css">
```

If you use a theme other than the default "catdown" theme, you have to define it upon initialisation. For example:

```js
var editor = new Catdown({
	// ...
    theme: "monokai"
});
```

### Credits

[CodeMirror](http://github.com/codemirror/CodeMirror) is the heart of Catdown, so a **huge** thanks to creator [Marijn Haverbeke](https://github.com/marijnh) and all the contributors. CodeMirror is awesome!

### Contribution

Want to help?

* Make a plugin, slap on the `catdown-` prefix and publish it on NPM. Send me a link if you do!

* Review the code. Get in touch with me if you have any queries or suggestions, and file an issue if you find any bugs or oversights.

### [License](https://github.com/zuren/catdown/blob/master/LICENSE)

MIT. Do what you like with it, credit is always nice.