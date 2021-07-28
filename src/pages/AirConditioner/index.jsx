import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock';
import Switcher from '../../components/Switcher';

import { DeviceController } from '@sheencity/diva-sdk';

export default class index extends Component {

  airDecs = [{
    title: '测试空调01',
    state: false,
  },
  {
    title: '测试空调02',
    state: false,
  },
  {
    title: '测试空调03',
    state: false,
  },
  {
    title: '测试空调04',
    state: false,
  },
  ];
  airs = []
  airControllers = []

  state = {
    checked: false
  }

  onClick = async(index) => {
    if (!this.airs[index]) return;
    await this.airs[index].focus(1000, -Math.PI / 6);
    data.changeCode(`device.focus(1000, -Math.PI / 6)`);
  }

  onSwitch = async (checked,index) => {
    if (this.airControllers.length === 0) return;
      checked ? this.airControllers[index].turnOn() : this.airControllers[index].turnOff();
      data.changeCode(`device.${checked ? 'turnOn()' : 'turnOff()'}`);
  }
  async componentDidMount() {
    diva.client.applyScene('空调控制');
    // 初始化设备的初始状态
    this.airDecs.forEach((airDec) => (airDec.state = false));
    this.airDecs.forEach(async (airDec) => {
      const airController = new DeviceController();
      const [air] = await diva.client.getEntitiesByName(airDec.title);
      air.bind(airController.signal); // 绑定控制器
      airController.turnOff();
      this.airs.push(air);
      this.airControllers.push(airController);
    })
    setTimeout(() => {
      data.changeCode(`client.applyScene('空调控制')`)
    }, 0);
  }
  componentWillUnmount() {
    this.airControllers.forEach((airController) => airController.turnOff());
  }
  render() {
    const airDecArr = this.airDecs.map((airDec, i) => {
    return (
      <div key={airDec.title}>
        <div className="switch-block" onClick={() => this.onClick(i)}>
          <div className="switch-item">
            <Switcher label={airDec.title} switch={(checked) => this.onSwitch(checked,i)}/>
          </div>
        </div>
      </div>
    )

    }
    )

    return (
      <div className="air-main">
        <ContentBlock caption="设备状态" />
        {airDecArr}
      </div>
    )
  }
}
