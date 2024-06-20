import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import { usePeer } from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";
import { db } from "@/lib/firebase"; // Import Firestore instance

import Player from "@/component/Player";
import Bottom from "@/component/Bottom";

import styles from "@/styles/room.module.css";

import { useRouter } from "next/router";

const Room = () => {
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
    leaveRoom,
  } = usePlayer(myId, roomId, peer);

  // Initialize an empty array to store user IDs
  const [users, setUsers] = useState([]);

  // Set up a Firestore collection for signaling
  const signalingCollection = db.collection(`rooms/${roomId}/signaling`);

  // Set up an event listener for when a new user connects to the room
  useEffect(() => {
    if (!peer || !stream) return;
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
          [newUser]: call,
        }));
      });
    };

    // Listen for new user connections in Firestore
    signalingCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newUser = change.doc.id;
          handleUserConnected(newUser);
        }
      });
    });

    // Clean up the event listener when the component is unmounted
    return () => {
      signalingCollection();
    };
  }, [peer, setPlayers, stream]);

  // Set up event listeners for when a user toggles their audio or video
  useEffect(() => {
    if (!signalingCollection) return;
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
      users[userId]?.close();
      // Update the players state to remove the leaving user
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };

    // Listen for user events in Firestore
    signalingCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const userId = change.doc.id;
          const data = change.doc.data();
          if (data.audio) {
            handleToggleAudio(userId);
          } else if (data.video) {
            handleToggleVideo(userId);
          } else if (data.leave) {
            handleUserLeave(userId);
          }
        }
      });
    });

    // Clean up the event listener when the component is unmounted
    return () => {
      signalingCollection();
    };
  }, [players, setPlayers, signalingCollection, users]);

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