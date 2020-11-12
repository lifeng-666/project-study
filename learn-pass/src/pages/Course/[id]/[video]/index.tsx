import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'umi';
import { Skeleton, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import {
  Player,
  BigPlayButton,
  LoadingSpinner,
  PlaybackRateMenuButton,
  ControlBar,
} from 'video-react';

import 'video-react/dist/video-react.css';

import {
  getVideo,
  getVideoProcess,
  reportVideoProcess,
  finishVideo,
} from '@/server';

import { getUrl, getVideoPreviewUrl, download } from '@/util/oss';
import { getUerInfo } from '@/util';

import { Video } from '@/type';

import Header from '@/components/Header';
import Radio from '../components/Radio';

import styles from './index.less';

interface VideoPlayer {
  seek: (arg0: number) => void;
  getState: () => {
    player: {
      duration: number;
      currentTime: number;
      paused: boolean;
      ended: boolean;
    };
  };
  subscribeToStateChange: (
    arg0: ({
      isFullscreen,
      playbackRate,
    }: {
      isFullscreen: boolean;
      playbackRate: number;
    }) => void,
  ) => void;
}

enum Rate {
  'Slow' = 2000,
  'Normal' = 1000,
  'Fast' = 500,
}

const RateToDurationMap: {
  [key: number]: Rate;
} = {
  0.5: Rate['Slow'],
  1: Rate['Normal'],
  2: Rate['Fast'],
};

const PROCESS_FINISH_FLAG = 0.8;

let playingInterval: Timeout;
let reportProcessInterval: Timeout;

let playedTime = 0;

export default () => {
  const [videoPlayer, setVideoPlayer] = useState<VideoPlayer>();
  const [video, setVideo] = useState<Video>();
  const [IsFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [intervalDuration, setIntervalDuration] = useState<Rate>(1000);

  const isStudent = getUerInfo().isStudent;
  const location = useLocation();

  const isFinishedVideo = (time: number, duration: number) => {
    if (!time || !duration) return false;
    return time / duration > PROCESS_FINISH_FLAG;
  };

  const handleFinishVideo = useCallback(() => {
    if (!video) return;
    finishVideo({ videoId: video.id }).then(() => {
      setIsFinish(true);
    });
  }, [video]);
  //初始化 获取视频
  useEffect(() => {
    const videoId = location.pathname.split('/').splice(-1);

    getVideo({ videoId: Number(videoId) }).then(({ data }: { data: Video }) => {
      playedTime = data.process;
      setVideo(data);
      setIsFinish(data.completed);
    });
    return () => {
      playedTime = 0;
    };
  }, []);

  //跳转视频到已播放完时间
  useEffect(() => {
    if (!videoPlayer || !video) return;
    try {
      videoPlayer.seek(playedTime);
    } catch (e) {
      console.error('视频跳转错误' + e);
    }
  }, [video, videoPlayer]);

  //处理全屏的样式以及根据视频速度改变计时器的间隔
  useEffect(() => {
    if (!video || !videoPlayer) return;
    videoPlayer.subscribeToStateChange(({ isFullscreen, playbackRate }) => {
      setIsFullScreen(isFullscreen);
      setIntervalDuration(RateToDurationMap[playbackRate]);
    });
  }, [video, videoPlayer]);

  //打开进度计时器和上报进度计时器
  useEffect(() => {
    if (!video || !videoPlayer || isFinish || !isStudent) return;

    const stopInterval = () => {
      playingInterval && clearInterval(playingInterval);
      reportProcessInterval && clearInterval(reportProcessInterval);
    };

    playingInterval = setInterval(() => {
      const { player } = videoPlayer.getState();
      const { duration, paused, currentTime, ended } = player;

      const checkIfFinish = () => {
        if (
          isFinishedVideo(playedTime, duration) &&
          isFinishedVideo(currentTime, duration)
        ) {
          stopInterval();
          setIsFinish(true);
          handleFinishVideo();
        }
      };

      if (!paused || ended) {
        playedTime++;
        checkIfFinish();
      }
    }, intervalDuration);

    reportProcessInterval = setInterval(() => {
      const { player } = videoPlayer.getState();
      if (!player.paused) {
        reportVideoProcess({
          videoId: video.id,
          process: playedTime,
        });
      }
    }, 10000);

    return () => {
      stopInterval();
    };
  }, [video, videoPlayer, isFinish, intervalDuration]);

  return (
    <>
      <Header title="视频" />
      <div className={styles.video}>
        <h2 className={styles.name}>
          {isStudent && <Radio completed={isFinish} />}
          <span>{video?.name}</span>
        </h2>
        <Skeleton loading={!video}>
          {video && (
            <div className={styles.videoPlayerWrapper}>
              <Player
                poster={getVideoPreviewUrl(video.path)}
                aspectRatio="16:9"
                ref={(player: VideoPlayer) => {
                  setVideoPlayer(player);
                }}
              >
                <BigPlayButton position="center" />
                <LoadingSpinner />
                <ControlBar
                  className={
                    IsFullScreen ? styles.fullControlBar : styles.controlBar
                  }
                >
                  <PlaybackRateMenuButton rates={[0.5, 1, 2]} />
                </ControlBar>
                <source src={getUrl(video.path)} />
              </Player>
            </div>
          )}
        </Skeleton>

        <p className={styles.taskStatus}>
          {isStudent && (
            <>
              <span className={styles.text}>任务情况:</span>
              {video && (
                <span className={styles.status}>
                  {isFinish ? '已' : '未'}完成
                </span>
              )}
            </>
          )}
        </p>
        <div className={styles.download}>
          <Button
            icon={<DownloadOutlined />}
            shape="circle"
            type="primary"
            size="large"
            onClick={() => {
              message.loading('正在下载...', 0.5);
              video?.path && download(video.path);
            }}
          />
        </div>
      </div>
    </>
  );
};
