import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock';

import { Elevator, ElevatorController, Vector3 } from '@sheencity/diva-sdk';
import DropDown from '../../components/DropDown';

export default class index extends Component {

  lifts = [{
    title: '一号梯',
  },
  {
    title: '二号梯',
  },
  {
    title: '三号梯',
  },
  {
    title: '四号梯',
  },
  ]
  options = [{
    value: '1',
    placeholder: '1'
  },
  {
    value: '2',
    placeholder: '2'
  },
  {
    value: '3',
    placeholder: '3'
  },
  {
    value: '4',
    placeholder: '4'
  },
  {
    value: '5',
    placeholder: '5'
  },
  {
    value: '6',
    placeholder: '6'
  },
  {
    value: '7',
    placeholder: '7'
  },
  {
    value: '8',
    placeholder: '8'
  },
  {
    value: '9',
    placeholder: '9'
  },
  {
    value: '10',
    placeholder: '10'
  },
  {
    value: '11',
    placeholder: '11'
  },
  {
    value: '12',
    placeholder: '12'
  },
  ]
  initvalue = {
    value: '1',
    placeholder: '1'
  }
  liftModels = []
  controllers = []
  currentLift = [1, 1, 1, 1]
  step = 299.7
  state = {
    checked: false
  }

  selectLift = async (option,i) => {
    const value = Number(option.value);
        this.controllers[i].land(`f${value}`);
        data.changeCode(`elevatorController.land('f${value}')`);
  }
  addSelected = (lift, i) => {
    let selected = {
      value: this.currentLift[i].toString(),
      placeholder: this.currentLift[i].toString(),
    };
    return {
      ...lift,
      selected
    };
  }
  
  async componentDidMount() {
    diva.client.applyScene('电梯演示');
    data.changeCode(`client.applyScene('电梯演示')`);
    this.lifts = this.lifts.map((lift, index) => this.addSelected(lift, index));
    for (let i = 0; i < 4; i++) {
      const [model] = await diva.client.getEntitiesByName(
        this.lifts[i].title
      );
      const coord = await model.getCoordinate();
      const controller = new ElevatorController({
        // 初始化电梯控制器
        landings: {
          f1: new Vector3(coord.x, coord.y, 987),
          f2: new Vector3(coord.x, coord.y, 987 + this.step),
          f3: new Vector3(coord.x, coord.y, 987 + this.step * 2),
          f4: new Vector3(coord.x, coord.y, 987 + this.step * 3),
          f5: new Vector3(coord.x, coord.y, 987 + this.step * 4),
          f6: new Vector3(coord.x, coord.y, 987 + this.step * 5),
          f7: new Vector3(coord.x, coord.y, 987 + this.step * 6),
          f8: new Vector3(coord.x, coord.y, 987 + this.step * 7),
          f9: new Vector3(coord.x, coord.y, 987 + this.step * 8),
          f10: new Vector3(coord.x, coord.y, 987 + this.step * 9),
          f11: new Vector3(coord.x, coord.y, 987 + this.step * 10),
          f12: new Vector3(coord.x, coord.y, 987 + this.step * 11),
          f13: new Vector3(coord.x, coord.y, 987 + this.step * 12),
        },
        speed: 500,
      });
      const lift = new Elevator({
        model,
        signal: controller.signal
      }); // 初始化电梯
      this.liftModels.push(lift);
      this.controllers.push(controller);
    }
  }
  componentWillUnmount() {

  }
  render() {
    const liftArr = this.lifts.map((lift, i) =>
      <div key={lift.title} className="drop-block">
        <div className="drop-item">
          <span>{lift.title}</span>
          <div>
            <DropDown options={this.options} initvalue={this.initvalue} disable={false} type={i} select={(option) => { this.selectLift(option,i) }} disabled={false} />
            <span style={{ marginLeft: '4px' }}>层</span>
          </div>
        </div>
      </div>
    )

    return (
      <div className="cus-main">
        <ContentBlock caption="数字孪生电梯演示" />
        {liftArr}
      </div>
    )
  }
}
