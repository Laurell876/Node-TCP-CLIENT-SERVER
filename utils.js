class SocketMessage {
    constructor(type, message, data) {
        this.type = type.toLowerCase();
        this.message = message;
        this.data = data;
    }
}

module.exports = {
    SocketMessage
}