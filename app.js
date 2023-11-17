document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const remoteVideo1 = document.getElementById('remoteVideo1');
    const remoteVideo2 = document.getElementById('remoteVideo2');
    let peer;

    function connect() {
        const peerIdInput = document.getElementById('peerIdInput');
        const peerId = peerIdInput.value.trim();

        if (peerId === "") {
            alert("Ingrese un código de acceso válido");
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideo.srcObject = stream;

                peer = new Peer();
                peer.on('open', (id) => {
                    console.log('My peer ID is: ' + id);

                    // Call the remote peers
                    const call1 = peer.call(peerId + '1', stream);
                    setupCallListeners(call1, remoteVideo1);

                    const call2 = peer.call(peerId + '2', stream);
                    setupCallListeners(call2, remoteVideo2);
                });

                peer.on('call', (call) => {
                    // Answer the call
                    call.answer(stream);
                    setupCallListeners(call, remoteVideo1);
                });
            })
            .catch((error) => console.error('Error accessing media devices:', error));
    }

    function setupCallListeners(call, remoteVideo) {
        // Stream received, show it in the remote video element
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });

        // Handle call closing
        call.on('close', () => {
            remoteVideo.srcObject = null;
        });
    }
});
