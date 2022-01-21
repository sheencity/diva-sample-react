import { RenderingStyleMode } from '@sheencity/diva-sdk';
import React, { Component } from 'react';
import './index.scss';
import { diva, data } from '../../global';
import ContentBlock from '../../components/ContentBlock';
import monitorImg from '../../assets/icon/monitor/refresh.png';

export default class index extends Component {
  monitors = [
    {
      title: '测试设备01',
      url: 'rtmp://xxxxxxxxxxxxxxxxxx',
    },
    {
      title: '测试设备02',
      url: 'rtmp://xxxxxxxxxxxxxxxxxx',
    }
  ];
  state = {
    monitorEquis: [
      {
        title: '测试设备03',
        url: 'https://www.sheencity.com',
      },
      {
        title: '测试设备04',
        url: 'https://www.sheencity.com',
      }
    ]
  };
  models = new Map();
  monitorHandlers = [];
  // 存在弹窗的模型
  widgetModel = null;

  removeWidget = async () => {
    if (this.widgetModel) await this.widgetModel.setWebWidget(null);
  }
  setWidget = async (monitor, url) => {
    if (typeof monitor === 'string') {
      monitor = await this.getModelByName(monitor);
    }
    if (!url) return;
    await monitor.setWebWidget(new URL(url), {
      width: 500,
      height: 280,
      mouseInput: true,
      keyboardInput: true,
    });
    this.widgetModel = monitor;
    data.changeCode(
      `model.setWebWidget(new URL('${url}'), { width: 500, height: 280, mouseInput: true, keyboardInput: true })`
    );
  };

  refresh = async (monitorEqui) => {
    try {
      await this.removeWidget();
    } catch {
      console.log('当前模型无可清除的 web 组件');
    }
    await this.setWidget(monitorEqui.title, monitorEqui.url);
  }
  selectMonitor = async (name) => {
    await (await this.getModelByName(name)).focus(1000, - Math.PI / 6);
    data.changeCode(`model.focus(1000, - Math.PI / 6)`);
  }
  getModelByName = async (name) => {
    let model = this.models.get(name);
    if (!model) {
      model = (await diva.client.getEntitiesByName(name))[0];
      this.models.set(name, model);
    }
    return model;
  }
  stopPropagation = ($event) => {
    $event.stopPropagation();
  }

  async componentDidMount() {
    const totalMonitors = this.monitors.concat(this.state.monitorEquis);
    console.log(totalMonitors);
    diva.client.applyScene('监控设备').then(() => {
      data.changeCode(`client.applyScene('监控设备')`);
    });
    for (let i = 0; i < totalMonitors.length; i++) {
      const model = await this.getModelByName(totalMonitors[i].title);
      const handle = (model) => {
        const url = totalMonitors.find((m) => m.title === model.name).url;
        this.setWidget(model, url);
      };
      model.setRenderingStyleMode(RenderingStyleMode.Default);
      model.addEventListener('click', () => handle(model));
      this.monitorHandlers.push(handle);
    }
  }

  async componentWillUnmount() {
    await this.removeWidget();
    this.monitors.forEach(async (m, i) => {
      const model = await this.getModelByName(m.title);
      model.removeEventListener('click', this.monitorHandlers[i]);
    });
  }

  inputChange = (value, i) => {
    const tempMonitor = [...this.state.monitorEquis];
    this.setState({
      monitorEquis: tempMonitor.map((item, index) => {
        return index === i ? { ...item, url: value } : item
      })
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
    );

    const monitorEquisArr = this.state.monitorEquis.map((monitorEqui, index) =>
      <div key={monitorEqui.title}>
        <div className="refresh-block" onClick={() => this.selectMonitor(monitorEqui.title)}>
          <div className="refresh-item">
            <span>{monitorEqui.title}</span>
            <div className="refresh-icon" onClick={() => this.refresh(monitorEqui)}>
              <img src={monitorImg} alt="设备弹窗演示" />
            </div>
          </div>
          <input value={monitorEqui.url}
            onClick={(event) => this.stopPropagation(event)}
            onKeyDown={(event) => this.stopPropagation(event)}
            onChange={(event) => this.inputChange(event.target.value, index)}
          />
        </div>
      </div>
    );

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
