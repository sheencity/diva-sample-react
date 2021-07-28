import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'
import DropDown from '../../components/DropDown'
import { RenderingStyleMode } from '@sheencity/diva-sdk';

export default class index extends Component {

  equipments = [{
    title: "空调",
    state: RenderingStyleMode.Default,
  },
  {
    title: "电视机",
    state: RenderingStyleMode.Default,
  },
  {
    title: "路由器",
    state: RenderingStyleMode.Default,
  },
  {
    title: "冰箱",
    state: RenderingStyleMode.Default,
  },
  ]

  options = [{
    value: RenderingStyleMode.Default,
    placeholder: "默认"
  },
  {
    value: RenderingStyleMode.Alarm,
    placeholder: "报警"
  },
  {
    value: RenderingStyleMode.Translucence,
    placeholder: "半透"
  },
  {
    value: RenderingStyleMode.Hidden,
    placeholder: "隐藏"
  },
  ]

  initial = {
    value: RenderingStyleMode.Default,
    placeholder: "默认"
  }
  state = {
    selected: null
  }

  addSelected = (equipment) => {
    let selected;
    switch (equipment.state) {
      case RenderingStyleMode.Default:
        selected = {
          value: RenderingStyleMode.Default,
          placeholder: "默认"
        };
        break;
      case RenderingStyleMode.Alarm:
        selected = {
          value: RenderingStyleMode.Alarm,
          placeholder: "报警"
        };
        break;
      case RenderingStyleMode.Translucence:
        selected = {
          value: RenderingStyleMode.Translucence,
          placeholder: "半透",
        };
        break;
      case RenderingStyleMode.Hidden:
        selected = {
          value: RenderingStyleMode.Hidden,
          placeholder: "隐藏"
        };
        break;
      default:
        selected = {
          value: RenderingStyleMode.Default,
          placeholder: "默认"
        };
        break;
    }
    return {
      ...equipment,
      selected
    };
  }

  onChange = async (equi,equipment) => {
    const [model] = await diva.client.getEntitiesByName(equipment.title);
    if (!model) return;
    const type = equi.value;
    model.setRenderingStyleMode(type);
    data.changeCode(
      `model.setRenderingStyleMode(RenderingStyleMode.${type.slice(0, 1).toUpperCase() + type.slice(1)
      })`
    );
  }
  async componentDidMount() {
    diva.client.applyScene("状态演示").then(() => {
      data.changeCode(`client.applyScene('状态演示')`);
    });
  }
  componentWillUnmount() {
    this.equipments.forEach(async (equi) => {
      const [model] = await diva.client.getEntitiesByName(equi.title);
      model.setRenderingStyleMode(RenderingStyleMode.Default);
    });
  }
  render() {
    this.equipments = this.equipments.map((equipment) => this.addSelected(equipment))
    const equipmentArr = this.equipments.map((equipment, i) => {
    return (
      <div key={equipment.title} className="drop-block">
        <div className={['drop-item', this.state.selected === i ? 'selected' : null].join(' ')}>
          <span>{equipment.title}</span>
          <div className="drop-down">
            <DropDown options={this.options} initvalue={this.initial} disabled={false} select={(equi) => this.onChange(equi,equipment)} />
          </div>
        </div>
      </div>
    )

    }
    )

    return (
      <div className="state-main">
        <ContentBlock caption="设备状态" />
        {equipmentArr}
      </div>
    )
  }
}
