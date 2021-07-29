import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'

import sceneImg from '../../assets/icon/scene/scene.png'
export default class index extends Component {

  scenes = [{
    title: "测试场景01",
    index: 0,
  },
  {
    title: "测试场景02",
    index: 1,
  },
  {
    title: "测试场景03",
    index: 2,
  },
  {
    title: "测试场景04",
    index: 3,
  },
  {
    title: "测试场景05",
    index: 4,
  },
  {
    title: "测试场景06",
    index: 5,
  },
  {
    title: "测试场景07",
    index: 6,
  },
  {
    title: "测试场景08",
    index: 7,
  },
  {
    title: "测试场景09",
    index: 8,
  },
  {
    title: "测试场景10",
    index: 9,
  },
  ];

  switchScene = (scene) => {
    diva.client.applyScene(scene.index).then(() => {
      data.changeCode(`client.applyScene('${scene.title}')`);
    });
  }
  componentDidMount() {
    diva.client.applyScene("半鸟瞰").then(() => {
      data.changeCode(`client.applyScene('半鸟瞰')`);
    });
  }
  render() {
    const scenesArr = this.scenes.map((scene) =>
      <div key={scene.index} className="content" onClick={() => this.switchScene(scene)}>
        <div className="title">{scene.title}</div>
        <div className="icon">
          <img alt="场景切换" src={sceneImg} />
        </div>
      </div>
    )

    return (
      <div className="scene-main">
        <ContentBlock caption="场景切换" />
        {scenesArr}
      </div>
    )
  }
}
