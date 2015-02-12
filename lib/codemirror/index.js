// Import and export Codemirror
var CodeMirror = module.exports = require("codemirror");

// Define a few CodeMirror modes and addons
require("./addons/overlay")(CodeMirror);
require("./addons/searchCursor")(CodeMirror);
require("./keymap/sublime")(CodeMirror);
require("./modes/markdown")(CodeMirror);
require("./modes/gfm")(CodeMirror);
require("./modes/javascript")(CodeMirror);