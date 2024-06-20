import { useState } from 'react';

import { cloneDeep } from 'lodash';

import { useSocket } from '@/context/socket';

import { useRouter } from 'next/router';

// Define a custom hook called usePlayer
const usePlayer = (myId, roomId, peer) => {
    // Get the socket instance from the useSocket hook
    const socket = useSocket();

    // Initialize a state variable to store the players, initially an empty object
    const [players, setPlayers] = useState({});

    // Get the router instance from the useRouter hook
    const router = useRouter();

    // Create a deep copy of the players object using Lodash's cloneDeep function
    const playersCopy = cloneDeep(players);

    // Extract the player object corresponding to the current user's ID
    const playerHighlighted = playersCopy[myId];

    // Remove the current user's player object from the copy
    delete playersCopy[myId];

    // Get the non-highlighted players (i.e., all players except the current user)
    const nonHighlightedPlayers = playersCopy;

    // Define a function to leave the room
    const leaveRoom = () => {
        // Emit a 'user-leave' event on the socket with the current user's ID and room ID
        socket.emit('user-leave', myId, roomId);
        console.log("leaving room", roomId);
        // Disconnect the peer instance
        peer?.disconnect();
        // Navigate back to the root route
        router.push('/');
    };

    // Define a function to toggle the current user's audio
    const toggleAudio = () => {
        console.log("I toggled my audio");
        // Update the players state by toggling the muted property of the current user's player object
        setPlayers((prev) => {
            const copy = cloneDeep(prev);
            copy[myId].muted = !copy[myId].muted;
            return { ...copy };
        });
        // Emit a 'user-toggle-audio' event on the socket with the current user's ID and room ID
        socket.emit('user-toggle-audio', myId, roomId);
    };

    // Define a function to toggle the current user's video
    const toggleVideo = () => {
        console.log("I toggled my video");
        // Update the players state by toggling the playing property of the current user's player object
        setPlayers((prev) => {
            const copy = cloneDeep(prev);
            copy[myId].playing = !copy[myId].playing;
            return { ...copy };
        });
        // Emit a 'user-toggle-video' event on the socket with the current user's ID and room ID
        socket.emit('user-toggle-video', myId, roomId);
    };

    // Return an object with several properties:
    // - players: the current players state
    // - setPlayers: the function to update the players state
    // - playerHighlighted: the current user's player object
    // - nonHighlightedPlayers: the non-highlighted players (i.e., all players except the current user)
    // - toggleAudio: the function to toggle the current user's audio
    // - toggleVideo: the function to toggle the current user's video
    // - leaveRoom: the function to leave the room
    return {
        players,
        setPlayers,
        playerHighlighted,
        nonHighlightedPlayers,
        toggleAudio,
        toggleVideo,
        leaveRoom
    };
};

// Export the usePlayer hook as the default export
export default usePlayer;