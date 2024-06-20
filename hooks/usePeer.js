import { useSocket } from "@/context/socket";

import { useRouter } from "next/router";

const { useState, useEffect, useRef } = require("react");

// Define a custom hook called usePeer
const usePeer = () => {
    // Get the socket instance from the useSocket hook
    const socket = useSocket();

    // Get the roomId query parameter from the router
    const roomId = useRouter().query.roomId;

    // Initialize a state variable to store the peer instance, initially set to null
    const [peer, setPeer] = useState(null);

    // Initialize a state variable to store the local peer id, initially set to an empty string
    const [myId, setMyId] = useState('');

    // Create a ref to keep track of whether the peer has been set or not
    const isPeerSet = useRef(false);

    // Use the useEffect hook to initialize the peer instance when the component mounts
    useEffect(() => {
        // If the peer has already been set or the roomId or socket are not available, return early
        if (isPeerSet.current || !roomId || !socket) return;
        isPeerSet.current = true;

        // Define an async function to initialize the peer instance
        let myPeer;
        (async function initPeer() {
            // Import the PeerJS library dynamically
            myPeer = new (await import('peerjs')).default();

            // Set the peer instance to the state variable
            setPeer(myPeer);

            // Add an event listener for the 'open' event on the peer instance
            myPeer.on('open', (id) => {
                console.log(`your peer id is ${id}`);
                // Set the local peer id state variable
                setMyId(id);
                // Emit a 'join-room' event on the socket with the roomId and local peer id
                socket?.emit('join-room', roomId, id);
            });
        })();
    }, [roomId, socket]);

    // Return an object with two properties, `peer` and `myId`, which are the current peer instance and local peer id
    return {
        peer,
        myId
    };
};

// Export the usePeer hook as the default export
export default usePeer;