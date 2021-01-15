import axios from 'axios';
import * as uuid from "uuid/v4";

class Services {

    roomId = new URL(window.location.href).searchParams.get('room');
    senderId = parseInt(new URL(window.location.href).searchParams.get('id'));
    lastMsgId = -1;
    /**
     * For debug purpose, it is possible to edit the base-url variable "url", to use a different server.
     * For example:
     * url = 'http://localhost:3000';
     */
    url = '';

    messages(first) {
        console.log(this.roomId + ' ' + this.senderId)
        var user = this.senderId;
        return new Promise((ok, fail) => {
            axios
                .get(this.url + '/chat/api/rooms/' + this.roomId + '/' + this.senderId)
                .then(res => {
                    if (first && res.data.data.messages.length > 0) {
                        this.lastMsgId = res.data.data.messages[res.data.data.messages.length - 1].id;
                    }
                    if (res.data.data.users.filter(function (e) { return e.id === user; }).length === 0) {
                        throw this.error;
                    }
                    return ok(res.data);
                }).catch(err => fail(err));
        });
    }

    sendMessage(msg) {
        var u = uuid();
        msg.sender.id = this.senderId;
        msg.clientId = u;
        return new Promise((ok, fail) => {
            axios
                .post(this.url + '/chat/api/rooms/' + this.roomId + '/messages/', msg)
                .then(res => {
                    if (res.data.data.id > this.lastMsgId) {
                        this.lastMsgId = res.data.data.id;
                    }
                    return ok(res.data.data);
                })
                .catch(err => fail(err));
        });
    }

    checkMessages() {
        return new Promise((ok, fail) => {
            axios
                .get(this.url + '/chat/api/rooms/' + this.roomId + '/messages/' + this.lastMsgId + '/' + this.senderId)
                .then(res => {
                    if (res.data.data.messages.length > 0) {
                        this.lastMsgId = res.data.data.messages[res.data.data.messages.length - 1].id;
                    }
                    return ok(res.data);
                }).catch(err => fail(err));
        });
    }

    sendFile() {
        let formData = new FormData();
        let fileData = document.querySelector('input[type="file"]').files[0];
        formData.append('file', fileData);
        formData.append('senderId', this.senderId);
        formData.append('clientId', uuid());
        formData.append('type', 'file');

        return new Promise((ok, fail) => {
            axios
                .post(this.url + '/chat/api/rooms/' + this.roomId + '/files/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    return ok(res.data.data);
                })
                .catch(err => fail(err));
        });
    }

    getFile(fileId) {
        return new Promise((ok, fail) => {
            axios
                .get(this.url + '/chat/api/rooms/file/' + fileId)
                .then(res => {
                    return ok(res.data.data);
                })
                .catch(err => fail(err));
        })
    }

    getHref(id) {
        return this.url + '/chat/api/rooms/file/' + id;
    }
}

export const services = new Services();