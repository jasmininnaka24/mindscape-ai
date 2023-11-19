import React from 'react';
import { AgoraVideoPlayer } from 'agora-rtc-react';

export const Video = (props) => {
  const { users, tracks } = props;

  return (
    <div className='min-h-100vh'>
      {/* Local video track */}
      <AgoraVideoPlayer videoTrack={tracks[1]} style={{ height: "50vh", width: "50vh", mirror: true }} />

      {/* Remote users' video tracks */}
      {users.length > 0 && users.map((user) => {
        if (user.videoTrack) {
          return (
            <div key={user.uid}>
              <AgoraVideoPlayer videoTrack={user.videoTrack} style={{ height: "50vh", width: "50vh", mirror: false }} />
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};
