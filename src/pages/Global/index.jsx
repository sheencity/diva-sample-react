import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import { MovementMode } from '@sheencity/diva-sdk';
import ContentBlock from '../../components/ContentBlock'
import DropDown from '../../components/DropDown'
import Switcher from '../../components/Switcher'

export default class index extends Component {

  state = {
    selectedMode: {
      value: "false",
      placeholder: "飞行",
    }
  }

  options = [{
    value: "false",
    placeholder: "飞行",
  },
  {
    value: "true",
    placeholder: "人视",
  },
  ]

  select = (v) => {
    diva.client.setMovementMode(
      // eslint-disable-next-line eqeqeq
      v.value == "true" ? MovementMode.ThirdPerson : MovementMode.Fly
    );
    data.changeCode(
      `client.setMovementMode(${
      // eslint-disable-next-line eqeqeq
      v.value == "true" ? "MovementMode.ThirdPerson" : "MovementMode.Fly"
      })`
    );
    this.setState({ selectedMode: v });
  }

  swit = (v) => {
    this.compass = v;
    diva.client.setCompass(v);
    data.changeCode(`client.setCompass(${v})`);
  }
  async componentDidMount() {
    await diva.client.applyScene("全局配置");
    this.compass = data.compass;
    diva.client.setCompass(this.compass);
    data.changeCode(`client.setCompass(${this.compass})`);
    setTimeout(() => {
      data.changeCode(`client.applyScene('全局配置')`);
    }, 0);
  }
  componentWillUnmount() {
    diva.client.setMovementMode(MovementMode.Fly);
  }
  render() {
    return (
      <div className="global-main">
        <ContentBlock caption="操作帮助" />
        <div className="help-block">
          <div className="title">鼠标操作帮助</div>
          <div className="help-item">
            <span>左键</span>
            <span>触发事件</span>
          </div>
          <hr />
          <div className="help-item">
            <span>右键</span>
            <span>旋转</span>
          </div>
          <hr />
          <div className="help-item">
            <span>中键</span>
            <span>绕屏幕中心旋转</span>
          </div>
          <hr />
          <div className="help-item">
            <span>Shift + 中键</span>
            <span>平移</span>
          </div>
        </div>
        <div className="help-block">
          <div className="title">键盘操作帮助</div>
          <div className="help-item">
            <span>W,S,A,D</span>
            <span>前，后，左，右</span>
          </div>
          <hr />
          <div className="help-item">
            <span>Q,E</span>
            <span>垂直升降</span>
          </div>
        </div>
        <div className="special">
          <ContentBlock caption="其他设置" />
          <div className="global-block">
            <div className="drop-item">
              <span>模式</span>
              <div>
                <DropDown options={this.options} selectedItem={this.state.selectedMode} disable={false} select={(option) => { this.select(option) }} />
              </div>
            </div>
            <div className="switch-item">
              <Switcher label="罗盘" switch={(checked) => this.swit(checked)} />
            </div>
          </div>
        </div >
      </div >
    )
  }
}
