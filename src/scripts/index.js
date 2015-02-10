var Catdown = require("catdown");

var editor = new Catdown({
    textarea: document.getElementById("md-editor"),
    preview: document.getElementById("md-preview"),
    plugins: [
        require("catdown-scrollsync")
    ]
});