var Catdown = require("catdown");

var editor = new Catdown({
    textarea: document.getElementById("catdown-editor"),
    preview: document.getElementById("html-preview"),
    plugins: [
        require("catdown-scrollsync")
    ]
});