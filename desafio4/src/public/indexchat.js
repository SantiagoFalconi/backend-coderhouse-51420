const socket = io();

let user;
let chatBox = document.getElementById('chatbox');

Swal.fire({
    title: "Identifícate",
    input: "text",
    inputValidator: (value) => {
        return !value && "¡Necesitas escribir un nombre de usuario para comenzar a chatear!"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user)
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
});