//Just Kidding..
String.prototype.toKebabCase = function() {
    return this.toLowerCase().replace(/\s+/g, '-');
};
String.prototype.trimAll = function() {
    return this.replace(/\s+/g, '');
};
String.prototype.wordCount = function() {
    return this.split(/\s+/).filter(Boolean).length;
};

String.prototype.reverse = function() {
    return this.split('').reverse().join('');
};

String.prototype.set = function (callback) {
    return callback(this);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.reverseWords = function() {
    return this.split(' ').reverse().join(' ');
};

String.prototype.toCamelCase = function() {
    return this.split(' ').map((word, index) => {
        return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
};

String.prototype.repeatStr = function(count) {
    return this.repeat(count);
};

Number.prototype.double = function (num) {
    return this * num;
};

Number.prototype.set = function (callback) {
    return callback(this);
}