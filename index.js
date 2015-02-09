"use strict";

var utils = require("./lib/utils.js"),
    marked = require("marked"),
    CodeMirror = require("./lib/codemirror");

// Constructor
var Catdown = function(opts){
    // Pull textarea from opts. Unwrap if it's a jQuery object.
    this.$textarea = utils.unwrapElement(opts.textarea || document.createElement("textarea"));

    // Create a CodeMirror instance from $textarea
    this.editor = CodeMirror.fromTextArea(this.$textarea, {
        mode: "gfm", // Use Github flavoured Markdown
        lineWrapping: true,
        theme: opts.theme || "catdown"
    });

    // Create references to editor el and vertical-scroll el
    this.$editor = this.editor.display.wrapper;
    this.$scroll = this.$editor.childNodes[1];

    // Allow people to replace the default markdown parser.
    // Must be a function that accepts markdown and returns a HTML string.
    this.parser = opts.parser || marked;

    // Import the core plugins, passing along the options hash.
    // This is where most of the functionality is.
    this.use(require("../catdown-core/"), opts);

    // Set initial value
    if(opts.value) this.set(opts.value);

    // If a plugins hash is passed, use each plugin
    if(opts.plugins) this.use(opts.plugins);

    // Setup any events in the options hash, binding the methods to instance.
    for(var ev in opts.events) this.on(ev, opts.events[ev].bind(this));

    // Once we're done, send a ready event.
    // Although nothing is async, it's a good convention.
    this.signal("ready");

    // Signal a change event every time the editor instance changes.
    this.editor.on("change", function(){
        this.signal("change");
    }.bind(this));

    // Focus on initialisation.
    this.focus();
}

// Use a plugin on the instance.
Catdown.prototype.use = function(plugins){
    // If first arg is a function, convert to
    // preferred object syntax. This allows a
    // shorthand '.use(fn, opts)' syntax.
    if(typeof plugins === "function"){
        plugins = [{
            handler: plugins,
            options: arguments[1] || {}
        }];
    }

    // Ensure it's an array so we can iterate.
    if(!Array.isArray(plugins)) plugins = [plugins];

    // Call each, bound to editor
    for(var i = 0; i < plugins.length; i++){
        var plugin = plugins[i],
            // If there isn't a handler param, assume function shorthand
            // use([fn]) instead of use([{handler: fn, options: {}}])
            handler = plugin.handler || typeof plugin === "function" && plugin,
            opts = plugin.options || {};

        // Pass plugin options, CM instance and general utils.
        handler.call(this, opts, this.editor, utils);
    }
}

// Shorthand for editor set value
Catdown.prototype.set = function(){
    return this.editor.setValue.apply(this.editor, arguments);
}

// Shorthand for editor value
Catdown.prototype.value = function(){
    return this.editor.getValue();
}

// Get HTML output of editor value using any
// parsing function that accepts a Markdown string
Catdown.prototype.toHTML = function(){
    return this.parser(this.value());
}

// If tail, set cursor at end of document.
Catdown.prototype.focus = function(tail){
    this.editor.focus();
    if(tail) this.editor.setCursor(this.editor.lineCount(), 0);
}

// Export the constructor
module.exports = Catdown;