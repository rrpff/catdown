var CodeMirror = module.exports = require("codemirror");

// Define CodeMirror modes and addons
require("./addons/overlay")(CodeMirror);
require("./modes/markdown")(CodeMirror);
require("./modes/gfm")(CodeMirror);
require("./modes/javascript")(CodeMirror);