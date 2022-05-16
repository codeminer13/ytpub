import React, { useRef, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import ReactPlayer from 'react-player';

function App() {

  const videoRef = useRef(null);
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState(false);
  const [playPause, setPlayPause] = useState(false);
  const { status, startRecording, pauseRecording, resumeRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });

  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);

  const load = () =>{
    setUrl(url);
  }

  const startAfterTime = () => {
    setCounter(5);
    setTimeout(() => {
      console.log("Start Recording in 5 sec");
      setUrl('https://www.youtube.com/watch?v=l75z7FrYRXI');
      handlePlayPause();
      startRecording();
      //handlePlay();
      
    }, 5000);
  }

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia(
        {
          video: true
        }
      )
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handlePlay = () => {
    console.log('onPlay');
    setPlaying(true);
  }

  const handlePause = () => {
    console.log('onPause');
    setPlaying(false);
  }

  const handleStop = () => {
    console.log('onStop');
    setPlaying(false);
    setUrl(null);
  }

  const handlePlayPause = () => {
    console.log("playing");
    setPlaying(playing);
  }

  useEffect(() => {
    if (counter <= 0) {
      switch (status) {
        case 'idle':
          console.log("idle");
          setShow(false);
          setRecord(false);
          setPlayPause(false);
          getVideo();
          break;
        case 'stopped':
          console.log("stopped");
          setShow(true);
          setRecord(false);
          handleStop();
          //handlePause();
          break;
        case 'paused':
          console.log("paused");
          setShow(false);
          setRecord(true);
          setPlayPause(true);
          handlePause();
          getVideo();
        break;
        case 'recording':
          console.log("recording");
          setShow(false);
          setRecord(true);
          setPlayPause(false);
          handlePlay();
          getVideo();
          break;
        default:
          break;
      }
    }
    else{
      if(counter === 5)
      {
        setShow(false);
        getVideo();
      }
      setTimeout(() => setCounter(counter - 1), 1000);
    }
      
  }, [videoRef,  status, counter])

  return (
    <div className="App">
      {!show && <div className="camera">
        <video ref={videoRef}></video>
      </div>}
      {show && <div className="camera">
        <video src={mediaBlobUrl} controls autoPlay />
      </div>}
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          playing={playing}
          onPlay={handlePlay}
          onPause={handlePause}
          url={url}
          //url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
          width='100%'
          height='100%'
        />
      </div>
      {counter !== 0 && <div className="player-wrapper overlay">{counter}</div>}
      {/* <p>{status} : {counter}</p> */}
      {!record && <button onClick={startAfterTime}>Record/Play</button>}
      {record && <button onClick={stopRecording}>Stop</button>}     
      {!playPause && record && <button onClick={pauseRecording}>Pause</button>}
      {playPause && record && <button onClick={resumeRecording}>Play</button>}
    </div>
  );
}

export default App;
