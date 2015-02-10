// Clone an object
exports.clone = function(obj){
    return Object.keys(obj).reduce(function(res, key){
        res[key] = obj[key];
        return res;
    }, {});
}

// Extend object with defaults where missing
exports.defaults = function(defs, settings){
    return Object.keys(settings).reduce(function(res, key){
        res[key] = settings[key];
        return res;
    }, exports.clone(defs));
}

// Apply wherever a user supplies a DOM element.
// Catdown uses native JS, but jQuery objects are allowed.
// If it's a jQuery element it'll extract the first element.
exports.unwrapElement = function(elem){
    return elem.nodeType ? elem : elem[0];
}