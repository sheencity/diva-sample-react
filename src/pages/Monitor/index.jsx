import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'

import monitorImg from '../../assets/icon/monitor/refresh.png'
import { RenderingStyleMode } from '@sheencity/diva-sdk';
export default class index extends Component {

  monitors = [{
    title: '测试设备01',
    url: 'rtmp://xxxxxxxxxxxxxxxxxx',
  },
  {
    title: '测试设备02',
    url: 'rtmp://xxxxxxxxxxxxxxxxxx',
  }
  ]
  monitorEquis = [{
    title: '测试设备03',
    url: 'https://www.sheencity.com',
  },
  {
    title: '测试设备04',
    url: 'https://www.sheencity.com',
  }
  ]
  models = new Map()
  monitorHandlers = []

  removeWidget = async (name) => {
    await (await this.getModelByName(name)).setWebWidget(null);

  }
  setWidget = async (monitor, url) => {
    if (typeof monitor === 'string') {
      monitor = await this.getModelByName(monitor);
    }
    if (!url) return;
    await monitor.setWebWidget(new URL(url), 500, 280);
    data.changeCode(`model.setWebWidget(new URL('${url}'), 500, 280)`);
  }

  refresh = async (monitorEqui) => {
    try {
      await this.removeWidget(monitorEqui.title);
    } catch {
      console.log('当前模型无可清除的 web 组件');
    }
    await this.setWidget(monitorEqui.title, monitorEqui.url);
  }
  selectMonitor = async (name) => {
    await (await this.getModelByName(name)).focus(1000, -Math.PI / 6);
    data.changeCode(`model.focus(1000, -Math.PI / 6)`);
  }
  getModelByName = async (name) => {
    let m = this.models.get(name);
    if (!m) {
      m = (await diva.client.getEntitiesByName(name))[0];
      this.models.set(name, m);
    }
    return m;
  }
  stopPropagation = ($event) => {
    $event.stopPropagation();
  }

  async componentDidMount() {
    const monitors = [{
      title: '测试设备01',
      url: 'rtmp://xxxxxxxxxxxxxxxxxx',
    },
    {
      title: '测试设备02',
      url: 'rtmp://xxxxxxxxxxxxxxxxxx',
    },
    {
      title: '测试设备03',
      url: 'https://www.sheencity.com',
    },
    {
      title: '测试设备04',
      url: 'https://www.sheencity.com',
    }
    ];
    diva.client.applyScene('监控设备').then(() => {
      data.changeCode(`client.applyScene('监控设备')`);
    });
    this.models = new Map();
    this.monitorHandlers = [];
    for (let i = 0; i < monitors.length; i++) {
      const model = await this.getModelByName(monitors[i].title);
      const handle = (model) => {
        const url = monitors.find((m) => m.title === model.name).url;
        this.setWidget(model, url);
      };
      model.setRenderingStyleMode(RenderingStyleMode.Default);
      model.addEventListener('click', () => {
        handle(model)
      });
      this.monitorHandlers.push(handle);
    }
  }
  componentWillUnmount(){
    this.monitors.forEach(async (m, i) => {
      const model = await this.getModelByName(m.title);
      model.removeEventListener('click', this.monitorHandlers[i]);
    });
  }
  render() {

    const monitorsArr = this.monitors.map((monitor) =>
      <div key={monitor.title}>
        <div className="drop-block" >
          <div className="content-block" onClick={() => this.selectMonitor(monitor.title)}>
            <div className="content-item" >
              <span>{monitor.title}</span>
            </div>
          </div>
        </div>
      </div>
    )

    const monitorEquisArr = this.monitorEquis.map((monitorEqui) =>
      <div key={monitorEqui.title}>
        <div className="refresh-block" onClick={() => this.selectMonitor(monitorEqui.title)}>
          <div className="refresh-item">
            <span>{monitorEqui.title}</span>
            <div className="refresh-icon" onClick={() => this.refresh(monitorEqui)}>
              <img src={monitorImg} alt="设备弹窗演示" />
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="monitor-main">
        <ContentBlock caption="监控视频演示" />
        {monitorsArr}
        <div style={{ marginTop: '20px' }}>
          <ContentBlock caption="设备弹窗演示" />
          {monitorEquisArr}
        </div>
      </div>
    )
  }
}
