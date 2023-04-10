import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const KVSPlayer = (props) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls = new Hls();
    const video = videoRef && videoRef.current;
    if (video) {
      hls.loadSource(props.hlsURL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      // on hls session ends
      hls.on(Hls.Events.MEDIA_COMPLETE, () => {
        // Load new link when the video has finished playing
        console.log("Media Ended");
        hls.destroy();
        const newHlsURL = props.getHlsURL(); // Get the new HLS URL
        hls = new Hls();
        hls.loadSource(newHlsURL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      });
    }
  return ()=>{
    hls.destroy()
  }
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay controls width={640} height={480}></video>
    </div>
  );
};

export default KVSPlayer;