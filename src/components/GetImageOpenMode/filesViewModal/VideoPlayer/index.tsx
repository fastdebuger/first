import React, {useEffect, useState} from 'react';
import FlvJs from 'flv.js';
import DPlayer from 'dplayer';
import {connect} from "dva";

interface IVideoPlayer {
  url: string;//视频的链接
}

const VideoPlayer: React.FC<IVideoPlayer> = (props: any) => {
  const {url} = props;
  const [key,setKey]=useState<number>(0);
  const getVideo = () => {
    if (document.getElementById('video') && url) {
      const dp = new DPlayer({
        container: document.getElementById('video'),
        // playbackSpeed: [1], //可选的播放速率，可以设置成自定义的数组
        video: {
          url,
          type: 'customFlv',
          customType: {
            customFlv(video: HTMLMediaElement) {
              const flvPlayer = FlvJs.createPlayer({
                type: 'mp4',
                url: url,
              });
              flvPlayer.attachMediaElement(video);
              flvPlayer.load();
            },
          },
        },
      });
      dp.play();
    }else {
      //第一次进入没有加载dom，获取不到播放器的div，则控制key，再次重新调用该方法
      setKey(key + 1)
    }
  }

  useEffect(() => {
    getVideo();
  }, [url,key]);


  return <>
    <div style={{
      width: '100%',
      height: '80%',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}>
      <div style={{width: '100%'}} id="video"/>
    </div>
  </>
}
export default connect()(VideoPlayer);
