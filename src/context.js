let contextData = {};

function set(key, value) {
    contextData[key] = value;
}

function get(key) {
    return contextData[key];
}

module.exports = {
    set,
    get
};
