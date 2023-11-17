document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.createElement('video');
    localVideo.autoplay = true;
    localVideo.muted = true;

    const videosContainer = document.getElementById('videosContainer');
    videosContainer.appendChild(localVideo);

    let peer;

    function connect() {
        const peerIdInput = document.getElementById('peerIdInput');
        const peerId = peerIdInput.value.trim();

        if (peerId === "") {
            alert("Ingrese un código de acceso válidooooooo");
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideo.srcObject = stream;

                peer = new Peer();
                peer.on('open', (id) => {
                    console.log('My peer ID is: ' + id);

                    // Llamar a todos los demás pares
                    callAllRemotePeers(peerId, stream);
                });

                peer.on('call', (call) => {
                    console.log('Incoming call from ' + call.peer);

                    // Responder a la llamada
                    call.answer(stream);
                    setupCallListeners(call, call.peer);
                });
            })
            .catch((error) => console.error('Error accessing media devices:', error));
    }

    function callAllRemotePeers(peerId, stream) {
        // Llamar a todos los demás pares
        peer.listAllPeers((peers) => {
            peers.forEach((remotePeer) => {
                if (remotePeer !== peer.id) {
                    const call = peer.call(remotePeer, stream);
                    setupCallListeners(call, remotePeer);
                }
            });
        });
    }

    function setupCallListeners(call, remotePeerId) {
        const remoteVideo = document.createElement('video');
        remoteVideo.autoplay = true;

        // Stream received, show it in the remote video element
        call.on('stream', (remoteStream) => {
            console.log('Stream received from ' + remotePeerId);
            remoteVideo.srcObject = remoteStream;
            videosContainer.appendChild(remoteVideo);
        });

        // Handle call closing
        call.on('close', () => {
            console.log('Call closed with ' + remotePeerId);
            remoteVideo.srcObject = null;
            videosContainer.removeChild(remoteVideo);
        });
    }

    window.connect = connect;
});
