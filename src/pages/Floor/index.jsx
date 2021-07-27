import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'
import DropDown from '../../components/DropDown'
import Switcher from '../../components/Switcher'
import { defer, from, Observable } from 'rxjs';
import {
  shareReplay
} from "rxjs/operators";

export default class index extends Component {
  options = [{
    placeholder: "1",
    value: "一层-1_1",
    pipeLineName: "一层管线"
  },
  {
    placeholder: "2",
    value: "二层(1)-1_1",
    pipeLineName: "二层管线"
  },
  {
    placeholder: "3",
    value: "三楼-1_5",
    pipeLineName: "三层管线"
  },
  {
    placeholder: "4",
    value: "标准层(1)-1_11",
    pipeLineName: "四层管线"
  },
  {
    placeholder: "5",
    value: "标准层(1)-1_12",
    pipeLineName: "五层管线"
  },
  {
    placeholder: "6",
    value: "标准层(1)-1_15",
    pipeLineName: "六层管线"
  },
  {
    placeholder: "7",
    value: "标准层(1)-1_16",
    pipeLineName: "七层管线"
  },
  {
    placeholder: "8",
    value: "标准层(1)-1_9",
    pipeLineName: "八层管线"
  },
  {
    placeholder: "9",
    value: "标准层(1)-1_10",
    pipeLineName: "九层管线"
  },
  {
    placeholder: "10",
    value: "标准层(1)-1_14",
    pipeLineName: "十层管线"
  },
  {
    placeholder: "11",
    value: "标准层(1)-1_17",
    pipeLineName: "十一层管线",
  },
  {
    placeholder: "12",
    value: "标准层(1)-1_13",
    pipeLineName: "十二层管线",
  },
  {
    placeholder: "13",
    value: "顶楼_12",
    pipeLineName: "顶层管线"
  },
  ]
  initial = {
    placeholder: "1",
    value: "一层-1_1",
    pipeLineName: "一层管线",
  }
  models = []
  pipeModels = []
  selectedFloor = {
    placeholder: "1",
    value: "一层-1_1",
  }
  group$ =  new Observable()
  state = {
    explode: false,
    gradation: false,
    pipe: false,
  }

  explodef = (val) => {
    this.setState({
      explode: val
    })
    if (!this.group$) return;
    this.group$.subscribe((group) => {
      const options = {
        spacing: 300,
        eachHeight: 290,
        duration: 5
      };

      if (val) group.disassemble(options);
      else group.assemble();

      data.changeCode(
        `const group = client.getEntityGroupByGroupPath('场景模型/主楼拆分');`,
        val ?
        "client.disassemble(group, { spacing: 300, eachHeight: 290, duration: 5 })" :
        "client.assemble(group)"
      );
    });    
  }

  gradationf = (v) => {
    this.setState({
      gradation: v
    })
    if (v) {
      // 聚焦到已选中的层数
      this.focusFloor(Number(this.selectedFloor.placeholder));
      this.pipef(false);
    } else {
      this.setVisibility(this.models, true, true);
      this.setVisibility(this.pipeModels, false, true);
    }
  }

  selectf = (v) => {
    if (!this.state.gradation) {
      return;
    }
    // 聚焦到已选中的层数
    this.focusFloor(Number(v.placeholder));
    // 此处设置层数
    this.selectedFloor = v;
  }

  pipef = (v) => {
    if (!this.state.gradation) {
      return;
    }
    this.setState({
      pipe: v
    })
    // 此处设置显示管线
    const currentPipe = this.pipeModels.filter(
      (pipeModel) =>
      pipeModel.name ===
      this.options[Number(this.selectedFloor.placeholder) - 1].pipeLineName
    );
    if (this.state.gradation && v) {
      this.setVisibility(currentPipe, true);
    } else {
      this.setVisibility(currentPipe, false);
    }
  }
  focusFloor = async (floor) => {
    // 显示当前层数模型
    const modelToFocus = this.models.filter(
      (model) => model.name === this.options[floor - 1].value
    );
    // 隐藏其他层数模型
    const modelToHide = this.models.filter(
      (model) => model.name !== this.options[floor - 1].value
    );
    // 显示当前层数管道
    const pipeToShow = this.pipeModels.filter(
      (pipeModel) => pipeModel.name === this.options[floor - 1].pipeLineName
    );
    // 隐藏其他层数的管道
    const pipeToHide = this.pipeModels.filter(
      (pipeModel) => pipeModel.name !== this.options[floor - 1].pipeLineName
    );

    // 聚焦当前楼层
    await this.focus(modelToFocus[0]);
    await this.setVisibility(modelToFocus, true);
    await this.setVisibility(modelToHide, false);
    await this.setVisibility(pipeToHide, false);
    await this.setVisibility(pipeToShow, this.state.pipe ? true : false);
    data.changeCode(
      `client.setVisibility(${[
      ...modelToFocus.map((model) => `'${model.id}'`),
    ]}, true)`
    );
  }

  // 聚焦方法
  focus = async (model) => {
    await model.focus(5000, -Math.PI / 6);
    data.changeCode(`model.focus(5000, -Math.PI / 6)`);
  }
  // 显示隐藏方法
  setVisibility = async (models, visible, leave) => {
    models.map((model) => model.setVisibility(visible));
    if (!leave) {
      data.changeCode(
        `client.setVisibility(${[
          ...models.map((model) => `'${model.id}'`),
        ]}, ${visible})`
      );
    }
  }
  // 获取模型方法
  getModel = async (name)=>{
    const [model] = await diva.client.getEntitiesByName(name);
    return model;
  }
  // 设置路径显示隐藏
  SetPathVisibility = (v)=>{
    const pathIndexArray = [0, 1, 2, 3, 4];
    pathIndexArray.forEach((i) => {
      diva.client.setPathVisibility(i, v);
    });
  }

  async componentDidMount() {
    await diva.client.applyScene("楼层展示");
    data.changeCode(`client.applyScene('楼层展示')`);
    this.options.forEach(async (option) => {
      const model = await this.getModel(option.value);
      const pipeModel = await this.getModel(option.pipeLineName);
      // 获取所有楼层模型以及管道模型
      this.models.push(model);
      this.pipeModels.push(pipeModel);
    });
    this.SetPathVisibility(false);
    const getGroup = () =>
      from(diva.client.getModelGroupByGroupPath("场景模型/主楼拆分"));
    this.group$ = defer(getGroup).pipe(shareReplay(1));
  }
  componentWillUnmount() {
    if (this.group$) {
      this.group$.subscribe((group) => group.assemble());
    }
    // 显示所有楼层，隐藏所有管道，并且不显示示例代码
    this.setVisibility(this.models, true, true);
    this.setVisibility(this.pipeModels, false, true);
    this.SetPathVisibility(true);
  }
  render() {
    return (
      <div className="floor-main">
        <ContentBlock caption="楼层展示" />
        <div className="switch-block">
          <div className="switch-item">
            <Switcher label="炸开" disabled={false} checked={this.state.explode} switch={(explode) => this.explodef(explode)} />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <ContentBlock caption="楼层展示" />
          <div className="switch-block">
            <div className="switch-item">
              <Switcher label="分层聚焦" disabled={false} checked={this.state.gradation} switch={(gradation) => this.gradationf(gradation)} />
            </div>
          </div>
          <div className="drop-block" style={{ zIndex: 100 }}>
            <div className="drop-item">
              <span>聚焦楼层</span>
              <div>
                <DropDown options={this.options} initvalue={this.initial} select={(selected) => { this.selectf(selected) }} disabled={!this.state.gradation} />
                <span style={{ marginLeft: '4px' }}>层</span>
              </div>
            </div>
          </div>
          <div className="switch-block">
            <div className="switch-item">
              <Switcher label="显示管线" disabled={!this.state.gradation} checked={this.state.pipe} switch={(pipe) => this.pipef(pipe)} />
            </div>
          </div >
        </div >
      </div>  
      )
  }
}
