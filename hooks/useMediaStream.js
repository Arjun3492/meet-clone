import { useState, useEffect, useRef } from 'react';

// Define a custom hook called useMediaStream
const useMediaStream = () => {
    // Initialize a state variable to store the media stream, initially set to null
    const [state, setState] = useState(null);

    // Create a ref to keep track of whether the stream has been set or not
    const isStreamSet = useRef(false);

    // Use the useEffect hook to initialize the media stream when the component mounts
    useEffect(() => {
        // If the stream has already been set, return early
        if (isStreamSet.current) return;
        // Set the isStreamSet ref to true to indicate that the stream is being set
        isStreamSet.current = true;

        // Define an async function to initialize the media stream
        (async function initStream() {
            try {
                // Use the navigator.mediaDevices.getUserMedia API to request access to the user's camera and microphone
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });
                console.log("setting your stream");
                // Set the state variable to the obtained media stream
                setState(stream);
            } catch (e) {
                console.log("Error in media navigator", e);
            }
        })();
    }, []);

    // Return an object with a single property, `stream`, which is the current media stream
    return {
        stream: state
    };
};

// Export the useMediaStream hook as the default export
export default useMediaStream;