import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'
import videoImg from '../../assets/icon/video/play.png'
export default class index extends Component {

  videos = [{
    title: "测试路径01",
    index: 0
  },
  {
    title: "测试路径02",
    index: 1
  },
  {
    title: "测试路径03",
    index: 2
  },
  {
    title: "测试路径04",
    index: 3
  },
  {
    title: "测试路径05",
    index: 4
  },
  {
    title: "测试路径06",
    index: 5
  },
  {
    title: "测试路径07",
    index: 6
  },
  {
    title: "测试路径08",
    index: 7
  },
  {
    title: "测试路径09",
    index: 8
  },
  {
    title: "测试路径10",
    index: 9
  },
  ];

  toggleVideo = async (video) => {
    await diva.client.stopCameraTrack();
    await diva.client.playCameraTrack(video.index);
    data.changeCode(`client.playCameraTrack('${video.title}')`);
  }
  componentDidMount() {
    diva.client.applyScene("半鸟瞰").then(() => {
      data.changeCode(`client.applyScene('半鸟瞰')`);
    })
  }
  componentWillUnmount() {
    diva.client.stopCameraTrack();
  }
  render() {
    const videoArr = this.videos.map((video) =>
      <div key={video.index} className="content" onClick={() => this.toggleVideo(video)}>
        <div className="title">{video.title}</div>
        <div className="icon">
          <img alt="漫游路径" src={videoImg} />
        </div>
      </div>
    )

    return (
      <div className="video-main">
        <ContentBlock caption="漫游路径" />
        {videoArr}
      </div>
    )
  }
}
