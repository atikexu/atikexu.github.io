document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const remoteVideo1 = document.getElementById('remoteVideo1');
    const remoteVideo2 = document.getElementById('remoteVideo2');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localVideo.srcObject = stream;

            const peer = new Peer({ key: 'your-peerjs-api-key', host: 'your-peerjs-server-url', secure: true });

            peer.on('open', (id) => {
                console.log('My peer ID is: ' + id);

                // Call peer2
                const call1 = peer.call('peer2', stream);
                setupCallListeners(call1, remoteVideo1);

                // Call peer3
                const call2 = peer.call('peer3', stream);
                setupCallListeners(call2, remoteVideo2);
            });

            peer.on('call', (call) => {
                // Answer the call
                call.answer(stream);
                setupCallListeners(call, remoteVideo1);
            });
        })
        .catch((error) => console.error('Error accessing media devices:', error));

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
