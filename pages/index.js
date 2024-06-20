import Navbar from '@/component/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

// Define the Home component
const Home = () => {
  // Initialize the meeting link state variable and set it to an empty string
  const [meetingLink, setMeetingLink] = useState('');

  // Get the router instance from the Next.js router hook
  const router = useRouter();

  // Define a function to create a new meeting and generate a unique meeting ID
  const handleCreateMeeting = () => {
    const newMeetingId = uuidv4();
    const newMeetingLink = `${window.location.origin}/meeting/${newMeetingId}`;
    setMeetingLink(newMeetingLink);
  };

  // Define a function to copy the meeting link to the clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  // Define a function to visit the meeting link
  const handleVisitLink = () => {
    router.push(meetingLink);
  };

  // Render the Home component
  return (
    <div className="flex h-screen flex-col">
      {/* Render the Navbar component */}
      <Navbar />
      <div className="flex items-center justify-center flex-1">
        <div className="p-8 rounded shadow-lg w-full md:w-1/2">
          {/* Display a welcome message */}
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome to the Google Meet Clone</h1>
          {/* Check if the meeting link is set */}
          {!meetingLink ? (
            // If the meeting link is not set, render a button to create a new meeting
            <div className="flex justify-center">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-1/3"
                onClick={handleCreateMeeting}
              >
                Create Meeting
              </button>
            </div>
          ) : (
            // If the meeting link is set, render the meeting link and buttons to copy and visit it
            <div className="px-4 flex flex-col items-center">
              <p className="mb-4 text-center">Share this link to invite others to your meeting:</p>
              <p className="border border-gray-300 border-dashed px-2 w-full">
                {meetingLink}
              </p>
              <div className="flex items-center mb-4 gap-8 mt-4 w-full justify-center">
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded w-full"
                  onClick={handleCopyLink}
                >
                  Copy Link
                </button>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded w-full"
                  onClick={handleVisitLink}
                >
                  Visit Meeting
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the Home component as the default export
export default Home;