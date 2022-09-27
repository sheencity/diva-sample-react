import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'
import DropDown from '../../components/DropDown'
import { RenderingStyleMode } from '@sheencity/diva-sdk';

export default class index extends Component {
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
    value: RenderingStyleMode.Highlight,
    placeholder: '高亮'
  },
  {
    value: RenderingStyleMode.Emission,
    placeholder: '自发光'
  }
  // {
  //   value: RenderingStyleMode.Hidden,
  //   placeholder: "隐藏"
  // },
  ]
  state = {
    selected: null,
    equipments: [{
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
    ],
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
      case RenderingStyleMode.Highlight:
        selected = {
          value: RenderingStyleMode.Highlight,
          placeholder: '高亮',
        };
        break;
      case RenderingStyleMode.Emission:
        selected = {
          value: RenderingStyleMode.Emission,
          placeholder: '自发光'
        };
        break;
      // case RenderingStyleMode.Hidden:
      //   selected = {
      //     value: RenderingStyleMode.Hidden,
      //     placeholder: "隐藏"
      //   };
      //   break;
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

  onChange = async (event, equipment) => {
    this.setState({
      equipments: this.state.equipments.map((e) => (e.title === equipment.title ? { ...e, selected: event } : e)),
    });
    const [model] = await diva.client.getEntitiesByName(equipment.title);
    if (!model || !event.value) return;
    const type = event.value;
    let code = `model.setRenderingStyleMode(RenderingStyleMode.${
      type.slice(0, 1).toUpperCase() + type.slice(1)
    }`;
    if (type === RenderingStyleMode.Emission) {
      model.setRenderingStyleMode(type, {
        color: "#20fdfa99",
        strength: 0.2,
      });
      code += `, { color: '#20fdfa99', strength: 0.2 })`;
    } else {
      model.setRenderingStyleMode(type);
      code += `)`;
    }
    data.changeCode(code);
  };
  async componentDidMount() {
    diva.client.applyScene("状态演示").then(() => {
      data.changeCode(`client.applyScene('状态演示')`);
    });
    const equipments = this.state.equipments.map((equipment) => this.addSelected(equipment));
    this.setState({ equipments });
    
    const highlightStyleOpt = {
      color: '#20fdfa99',
      border: {
        color: '#20fdfa',
        width: 2,
      },
    }
    diva.client.setHighlightStyle(highlightStyleOpt);
  }
  componentWillUnmount() {
    this.state.equipments.forEach(async (equi) => {
      const [model] = await diva.client.getEntitiesByName(equi.title);
      model.setRenderingStyleMode(RenderingStyleMode.Default);
    });
  }
  render() {
    const equipmentArr = this.state.equipments.map((equipment, i) => {
      return (
        <div key={equipment.title} className="drop-block">
          <div className={['drop-item', this.state.selected === i ? 'selected' : null].join(' ')}>
            <span>{equipment.title}</span>
            <div className="drop-down">
              <DropDown options={this.options} selectedItem={equipment.selected} disabled={false} select={(event) => this.onChange(event, equipment)} />
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
