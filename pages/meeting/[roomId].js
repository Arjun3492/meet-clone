import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";

import Player from "@/component/Player";
import Bottom from "@/component/Bottom";

import styles from "@/styles/room.module.css";

import { useRouter } from "next/router";

const Room = () => {
    // Get the socket instance from the context
    const socket = useSocket();

    // Get the room ID from the URL query parameters
    const { roomId } = useRouter().query;

    // Get the peer instance and my ID from the usePeer hook
    const { peer, myId } = usePeer();

    // Get the media stream instance from the useMediaStream hook
    const { stream } = useMediaStream();

    // Get the player state and functions from the usePlayer hook
    const {
        players,
        setPlayers,
        playerHighlighted,
        nonHighlightedPlayers,
        toggleAudio,
        toggleVideo,
        leaveRoom
    } = usePlayer(myId, roomId, peer);

    // Initialize an empty array to store user IDs
    const [users, setUsers] = useState([]);

    // Set up an event listener for when a new user connects to the room
    useEffect(() => {
        if (!socket || !peer || !stream) return;
        const handleUserConnected = (newUser) => {
            console.log(`user connected in room with userId ${newUser}`);

            // Make a call to the new user and set up a peer connection
            const call = peer.call(newUser, stream);

            // Set up an event listener for when the call is answered and a stream is received
            call.on("stream", (incomingStream) => {
                console.log(`incoming stream from ${newUser}`);
                // Update the players state with the new user's stream
                setPlayers((prev) => ({
                    ...prev,
                    [newUser]: {
                        url: incomingStream,
                        muted: true,
                        playing: true,
                    },
                }));

                // Update the users state with the new user's call object
                setUsers((prev) => ({
                    ...prev,
                    [newUser]: call
                }))
            });
        };
        socket.on("user-connected", handleUserConnected);

        // Clean up the event listener when the component is unmounted
        return () => {
            socket.off("user-connected", handleUserConnected);
        };
    }, [peer, setPlayers, socket, stream]);

    // Set up event listeners for when a user toggles their audio or video
    useEffect(() => {
        if (!socket) return;
        const handleToggleAudio = (userId) => {
            console.log(`user with id ${userId} toggled audio`);
            // Update the players state to reflect the user's new audio state
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                copy[userId].muted = !copy[userId].muted;
                return { ...copy };
            });
        };

        const handleToggleVideo = (userId) => {
            console.log(`user with id ${userId} toggled video`);
            // Update the players state to reflect the user's new video state
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                copy[userId].playing = !copy[userId].playing;
                return { ...copy };
            });
        };

        const handleUserLeave = (userId) => {
            console.log(`user ${userId} is leaving the room`);
            // Close the call object for the leaving user
            users[userId]?.close()
            // Update the players state to remove the leaving user
            const playersCopy = cloneDeep(players);
            delete playersCopy[userId];
            setPlayers(playersCopy);
        }
        socket.on("user-toggle-audio", handleToggleAudio);
        socket.on("user-toggle-video", handleToggleVideo);
        socket.on("user-leave", handleUserLeave);
        return () => {
            socket.off("user-toggle-audio", handleToggleAudio);
            socket.off("user-toggle-video", handleToggleVideo);
            socket.off("user-leave", handleUserLeave);
        };
    }, [players, setPlayers, socket, users]);

    // Set up an event listener for when a peer call is received
    useEffect(() => {
        if (!peer || !stream) return;
        peer.on("call", (call) => {
            const { peer: callerId } = call;
            // Answer the call and set up a peer connection
            call.answer(stream);

            // Set up an eventlistener for when the call is answered and a stream is received
            call.on("stream", (incomingStream) => {
                console.log(`incoming stream from ${callerId}`);
                // Update the players state with the new user's stream
                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: incomingStream,
                        muted: true,
                        playing: true,
                    },
                }));

                // Update the users state with the new user's call object
                setUsers((prev) => ({
                    ...prev,
                    [callerId]: call
                }))
            });
        });
    }, [peer, setPlayers, stream]);

    // Set up an event listener for when my own stream is ready
    useEffect(() => {
        if (!stream || !myId) return;
        console.log(`setting my stream ${myId}`);
        // Update the players state with my own stream
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: stream,
                muted: true,
                playing: true,
            },
        }));
    }, [myId, setPlayers, stream]);

    // Render the Room component
    return (
        <>
            <div className={styles.activePlayerContainer}>
                {playerHighlighted && (
                    <Player
                        url={playerHighlighted.url}
                        muted={playerHighlighted.muted}
                        playing={playerHighlighted.playing}
                        isActive
                    />
                )}
            </div>
            <div className={styles.inActivePlayerContainer}>
                {Object.keys(nonHighlightedPlayers).map((playerId) => {
                    const { url, muted, playing } = nonHighlightedPlayers[playerId];
                    return (
                        <Player
                            key={playerId}
                            url={url}
                            muted={muted}
                            playing={playing}
                            isActive={false}
                        />
                    );
                })}
            </div>
            <Bottom
                muted={playerHighlighted?.muted}
                playing={playerHighlighted?.playing}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                leaveRoom={leaveRoom}
            />
        </>
    );
};

export default Room;