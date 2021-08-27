import React, { Component } from "react";
import "./index.scss";
import { diva, data } from "../../global";
import ContentBlock from "../../components/ContentBlock";
import Switcher from "../../components/Switcher";

import { DeviceController } from "@sheencity/diva-sdk";

export default class index extends Component {
  state = {
    lightDecs: [
      {
        title: "测试灯光01",
        state: true,
      },
      {
        title: "测试灯光02",
        state: true,
      },
      {
        title: "测试灯光03",
        state: true,
      },
      {
        title: "测试灯光04",
        state: true,
      },
    ],
  };
  lights = [];
  lightControllers = [];

  onSwitch = (event, index) => {
    this.setState({
      lightDecs: this.state.lightDecs.map((item, _index) =>
        _index === index ? { title: item.title, state: !item.state } : item
      ),
    });
    if (this.lightControllers.length === 0) return;
    event
      ? this.lightControllers[index].turnOn()
      : this.lightControllers[index].turnOff();
    data.changeCode(`device.${event ? "turnOn()" : "turnOff()"}`);
  };

  onClick = async (index) => {
    if (!this.lights[index]) return;
    await this.lights[index].focus(1000, -Math.PI / 6);
    data.changeCode(`device.focus(1000, -Math.PI / 6)`);
  };
  async componentDidMount() {
    diva.client.applyScene("灯光控制");
    // 初始化设备的初始状态
    this.state.lightDecs.forEach(async (lightDec) => {
      const lightController = new DeviceController();
      const [light] = await diva.client.getEntitiesByName(lightDec.title);
      light.bind(lightController.signal); // 绑定控制器
      lightController.turnOn();
      this.lights.push(light);
      this.lightControllers.push(lightController);
    });
    setTimeout(() => {
      data.changeCode(`client.applyScene('灯光控制')`);
    }, 0);
  }
  componentWillUnmount() {}
  render() {
    const lightDecArr = this.state.lightDecs.map((lightDec, i) => {
      return (
        <div key={lightDec.title} onClick={() => this.onClick(i)}>
          <div className="switch-block">
            <div className="switch-item">
              <Switcher
                checked={lightDec.state}
                label={lightDec.title}
                switch={(checked) => this.onSwitch(checked, i)}
              />
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="lamp-main">
        <ContentBlock caption="灯光控制" />
        {lightDecArr}
      </div>
    );
  }
}
