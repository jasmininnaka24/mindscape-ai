import React, { useState, useEffect } from 'react';
import { useClient } from '../../../settings';

export const Controls = (props) => {
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  useEffect(() => {
    // Subscribe to user-published event when component mounts
    client.on('user-published', handleUserPublished);

    // Clean up event listeners when component unmounts
    return () => {
      client.off('user-published', handleUserPublished);
    };
  }, [client]);

  const handleUserPublished = async (user, mediaType) => {
    if (user && mediaType) {
      if (mediaType === 'video') {
        // Handle remote user published video track
        // You can use the user.uid to identify different remote users
        // For simplicity, I'll assume only one remote user
        const remoteVideoTrack = user.videoTrack;
        const remoteAudioTrack = user.audioTrack;
  
        // Play the remote video track if it exists
        if (remoteVideoTrack) {
          remoteVideoTrack.play(document.getElementById('remoteVideoContainer'));
        }
  
        // If the remote user publishes audio only, play the remote audio track
        if (remoteAudioTrack && !remoteVideoTrack) {
          remoteAudioTrack.play();
        }
      }
    }
  };
  

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  const toggleMute = async (type) => {
    if (type === 'audio') {
      await tracks[0].setMuted(!trackState.audio);
      setTrackState((prevState) => ({ ...prevState, audio: !prevState.audio }));
    } else if (type === 'video') {
      await tracks[1].setMuted(!trackState.video);
      setTrackState((prevState) => ({ ...prevState, video: !prevState.video }));
    }
  };

  return (
    <div>
      <div className="flex">
        <button
          className={`${trackState.audio ? 'mbg-700' : 'mbg-300'} px-4 py-1 rounded`}
          onClick={() => toggleMute('audio')}
        >
          {trackState.audio ? 'Mic On' : 'Mic Off'}
        </button>

        <button
          className={`${trackState.video ? 'mbg-700' : 'mbg-300'} px-4 py-1 rounded`}
          onClick={() => toggleMute('video')}
        >
          {trackState.video ? 'Video On' : 'Video Off'}
        </button>

        <button
          className="mbg-700 px-4 py-1 rounded"
          onClick={() => leaveChannel()}
        >
          Leave
        </button>
      </div>

      <div id="remoteVideoContainer"></div>
    </div>
  );
};
