import { Emissive, Marker, Model, POI, POIIcon } from '@sheencity/diva-sdk';
import { deg2rad, Euler, Quaternion, Vector3 } from '@sheencity/diva-sdk-math';
import { Component } from 'react';
import deleteImg from '../../assets/icon/overlay/delete.png';
import ContentBlock from '../../components/ContentBlock';
import DropDown from '../../components/DropDown';
import InputNumber from '../../components/InputNumber';
import { data, diva } from '../../global';
import {
  EmissionType,
  EmissiveOverlay,
  MarkerOverlay,
  OverlayType,
  POIOverlay,
  POIIconType
} from '../../models/overlay.model';
import { LocalStorageService } from "../../services/localStorage.service";
import './index.scss';

export default class index extends Component {

  state = {
    corrdinateX: 0.0,
    corrdinateY: 0.0,
    corrdinateZ: 0.0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    selectedType: {
      value: OverlayType.POI,
      placeholder: 'POI',
    },
    selectedAlign: {
      value: 'center',
      placeholder: '居中',
    },
    selectedIcon: {
      value: POIIcon.Camera,
      placeholder: '摄像头',
    },
    selectedIconType: {
      value: POIIconType.type1,
      placeholder: 'POI文字标签',
    },
    selectedEmissive: {
      value: EmissionType.type1,
      placeholder: '悬浮标记01',
    },
    content: "",
    title: "",
    color: "#ff0000",
    borderColor: "#ffffff",
    scale: 1.0,
    opacity: 1.0,
    border: 0.0,
    selectedId: null,
    emission: 1.0,
    speed: 2.0,
    typeOptions: [],
    alignOptions: [],
    emissiveOptions: [],
    iconOptions: [],
    overlays: []
  }
  store = new LocalStorageService()

  switchScene = (scene) => {
    diva.client.applyScene(scene.index).then(() => {
      data.changeCode(`client.applyScene('${scene.title}')`);
    });
  }
  componentWillMount() {
    this.setState({
      typeOptions: [
        {
          value: OverlayType.POI,
          placeholder: "POI",
        },
        {
          value: OverlayType.Marker,
          placeholder: "Marker",
        },
        {
          value: OverlayType.Emissive,
          placeholder: "Emissive",
        },
      ],
      alignOptions: [{
        value: 'center',
        placeholder: '居中'
      },
      {
        value: 'left',
        placeholder: '左对齐'
      },
      {
        value: 'right',
        placeholder: '右对齐'
      },
      ],
      iconOptions: [{
        value: POIIcon.Camera,
        placeholder: '摄像头'
      },
      {
        value: POIIcon.Location,
        placeholder: '定位'
      },
      {
        value: POIIcon.TrafficLight,
        placeholder: '红绿灯'
      },
      {
        value: POIIcon.TrashCan,
        placeholder: '垃圾桶'
      },
      {
        value: POIIcon.StreetLamp,
        placeholder: '路灯'
      },
      {
        value: POIIcon.BusStation,
        placeholder: '公交站'
      },
      {
        value: POIIcon.Exit,
        placeholder: '出口'
      },
      {
        value: POIIcon.Restaurant,
        placeholder: '餐饮'
      },
      {
        value: POIIcon.Parking,
        placeholder: '停车场'
      },
      {
        value: POIIcon.Dock,
        placeholder: '码头'
      },
      {
        value: POIIcon.Subway,
        placeholder: '地铁'
      },
      {
        value: POIIcon.Supermarket,
        placeholder: '超市'
      },
      {
        value: POIIcon.Mall,
        placeholder: '商场'
      },
      {
        value: POIIcon.Toilet,
        placeholder: '卫生间'
      },
      ],
      iconTypeOptions: [{
        value: POIIconType.type1,
        placeholder: 'POI文字标签'
      },
      {
        value: POIIconType.type2,
        placeholder: 'POI圆形标签'
      },
      {
        value: POIIconType.type3,
        placeholder: 'POI水滴'
      },
      ],
      emissiveOptions: [{
        value: EmissionType.type1,
        placeholder: '悬浮标记01'
      },
      {
        value: EmissionType.type2,
        placeholder: '圆形区域轮廓02'
      },
      {
        value: EmissionType.type3,
        placeholder: '雷达标记'
      },
      {
        value: EmissionType.type4,
        placeholder: '地面标记01'
      },
      {
        value: EmissionType.type5,
        placeholder: '圆形区域轮廓01'
      },
      {
        value: EmissionType.type6,
        placeholder: '事故标记'
      },
      {
        value: EmissionType.type7,
        placeholder: '悬浮标记02'
      },
      {
        value: EmissionType.type8,
        placeholder: '圆形区域轮廓03'
      },
      ]
    })
  }

  /**
   * 创建覆盖物
   */
  create = async () => {
    if (this.state.selectedType.value === OverlayType.POI) {
      const overlay = new POIOverlay();
      overlay.icon = this.state.selectedIcon.value;
      overlay.iconType = this.state.selectedIconType.value;
      overlay.corrdinateX = this.state.corrdinateX;
      overlay.corrdinateY = this.state.corrdinateY;
      overlay.corrdinateZ = this.state.corrdinateZ;
      overlay.content = this.state.content;
      overlay.color = this.state.color;
      overlay.scale = this.state.scale;
      overlay.opacity = this.state.opacity;
      const poiOverlay = new POI({
        icon: overlay.icon,
        title: overlay.content,
        backgroundColor: overlay.color,
        opacity: overlay.opacity,
        scale: new Vector3(overlay.scale, overlay.scale, overlay.scale),
        resource: {
          name: overlay.iconType,
        },
        coord: new Vector3(
          overlay.corrdinateX,
          overlay.corrdinateY,
          overlay.corrdinateZ
        ),
        id: overlay.id,
        name: this.uniqueName("poi"),
        autoSize: false,
      });
      await poiOverlay.setClient(diva.client);
      poiOverlay.focus(1000, -Math.PI / 6);
      this.store.storeOverlay(overlay);
      data.changeCode(
        `const overlay = new POI(config_learnMoreInTutorial);`,
        `await overlay.setClient(diva.client);`
      );
    } else if (this.state.selectedType.value === OverlayType.Marker) {
      const overlay = new MarkerOverlay();
      overlay.corrdinateX = this.state.corrdinateX;
      overlay.corrdinateY = this.state.corrdinateY;
      overlay.corrdinateZ = this.state.corrdinateZ;
      overlay.title = this.state.title;
      overlay.content = this.state.content;
      overlay.align = this.state.selectedAlign.value;
      overlay.color = this.state.color;
      overlay.scale = this.state.scale;
      overlay.opacity = this.state.opacity;
      overlay.borderWidth = this.state.border;
      overlay.borderColor = this.state.borderColor;
      const markerOverlay = new Marker({
        id: overlay.id,
        title: overlay.title,
        content: overlay.content,
        // @ts-ignore
        align: overlay.align,
        border: {
          color: overlay.borderColor,
          width: overlay.borderWidth,
        },
        backgroundColor: overlay.color,
        opacity: overlay.opacity,
        scale: new Vector3(overlay.scale, overlay.scale, overlay.scale),
        coord: new Vector3(
          overlay.corrdinateX,
          overlay.corrdinateY,
          overlay.corrdinateZ
        ),
        resource: {
          name: "文字标签",
        },
        name: this.uniqueName("marker"),
        autoSize: false,
      });
      await markerOverlay.setClient(diva.client);
      markerOverlay.focus(1000, -Math.PI / 6);
      this.store.storeOverlay(overlay);
      data.changeCode(
        `const overlay = new Marker(config_learnMoreInTutorial);`,
        `await overlay.setClient(diva.client);`
      );
    } else if (this.state.selectedType.value === OverlayType.Emissive) {
      const overlay = new EmissiveOverlay();
      overlay.icon = this.state.selectedEmissive.value;
      overlay.corrdinateX = this.state.corrdinateX;
      overlay.corrdinateY = this.state.corrdinateY;
      overlay.corrdinateZ = this.state.corrdinateZ;
      overlay.color = this.state.color;
      overlay.emission = this.state.emission;
      overlay.speed = this.state.speed;
      overlay.rotationX = this.state.rotationX;
      overlay.rotationY = this.state.rotationY;
      overlay.rotationZ = this.state.rotationZ;
      overlay.scale = this.state.scale;
      const emissiveOverlay = new Emissive({
        emissionColor: overlay.color,
        emissionStrength: overlay.emission,
        speed: overlay.speed,
        coord: new Vector3(
          overlay.corrdinateX,
          overlay.corrdinateY,
          overlay.corrdinateZ
        ),
        rotation: Quaternion.FromEuler(
          new Euler(
            ...deg2rad([
              overlay.rotationX,
              overlay.rotationY,
              overlay.rotationZ,
            ])
          )
        ),
        scale: new Vector3(overlay.scale, overlay.scale, overlay.scale),
        resource: {
          name: overlay.icon,
        },
        id: overlay.id,
        name: this.uniqueName('effect'),
      });
      await emissiveOverlay.setClient(diva.client);
      emissiveOverlay.focus(1000, -Math.PI / 6);
      this.store.storeOverlay(overlay);
      data.changeCode(
        `const overlay = new Emissive(config_learnMoreInTutorial);`,
        `await overlay.setClient(diva.client);`
      );
    }
    this.setState({
      overlays: this.store.getAllOverlays()
    })
    this.reset();
  }

  uniqueName = (prefix) => {
    return '' + prefix + '_' + new Date().toISOString();
  }

  /**
   * 删除覆盖物
   */
  del = async ($event, overlay) => {
    $event.stopPropagation();
    this.store.deleteOverlay(overlay);
    this.setState({
      overlays: this.store.getAllOverlays()
    })
    /**@type {Model} */
    const entity = await diva.client.getEntityById(overlay.id);
    await entity.setClient(null);
    data.changeCode(`entity.setClient(null)`);
  }

  /**
   * 创建覆盖物之后重置所有配置
   */
  reset = () => {
    this.setState({
      corrdinateX: 0.0,
      corrdinateY: 0.0,
      corrdinateZ: 0.0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      title: "",
      content: "",
      color: "#ff0000",
      scale: 1.0,
      opacity: 1.0,
      border: 0.0,
      borderColor: '#ffffff',
      emission: 1.0,
      speed: 2.0,
      selectedIcon: {
        value: POIIcon.Camera,
        placeholder: '摄像头',
      },
      selectedIconType: {
        value: POIIconType.type1,
        placeholder: 'POI文字标签',
      },
      selectedEmissive: {
        value: EmissionType.type1,
        placeholder: '悬浮标记01',
      },
      selectedAlign: {
        value: 'center',
        placeholder: '居中',
      },
    })
  }
  /**
   * 聚焦覆盖物
   */
  selectOverlay = async (overlay) => {
    this.setState({
      selectedId: overlay.id
    });
    /**@type {Model} */
    const entity = await diva.client.getEntityById(overlay.id);
    entity.focus(1000, -Math.PI / 6);
    data.changeCode(`model.focus(1000, -Math.PI / 6)`);
  }
  /**
   * 拾取世界坐标
   */
  pickup = async () => {
    const handler = (event) => {
      const wordPosition = event.detail.position;
      this.setState({
        corrdinateX: wordPosition[0],
        corrdinateY: wordPosition[1],
        corrdinateZ: wordPosition[2],
      })
      document.body.style.cursor = 'default';
    };
    diva.client.addEventListener('click', handler, { once: true });
    document.body.style.cursor = 'crosshair';
  }

  mouseupStop = (e) => {
    e.stopPropagation();
  }

  /**
   * 阻止事件冒泡
   * @param $event
   */
  onKeyDown = ($event) => {
    $event.stopPropagation();
  }
  setSelectedType = (item) => {
    this.setState({
      selectedType: item
    })
  }
  setSelectedAlign = (item) => {
    this.setState({
      selectedAlign: item
    })
  }
  setSelectedEmissive = (item) => {
    this.setState({
      selectedEmissive: item
    })
  }
  setSelectedIcon = (item) => {
    this.setState({
      selectedIcon: item
    })
  }
  setSelectedIconType = (item) => {
    this.setState({
      selectedIconType: item
    })
  }

  async componentDidMount() {
    this.setState({
      overlays: this.store.getAllOverlays()
    })
    await diva.client.applyScene('覆盖物');
    data.changeCode(`client.applyScene('覆盖物')`);
    if (this.state.overlays.length > 0) {
      this.state.overlays.map(async (overlay) => {
        const entity = await diva.client.getEntityById(overlay.id);
        entity.setVisibility(true);
      });
    }
  }
  render() {
    const overlayArr = this.state.overlays.map((overlay) =>
      <div key={overlay.id} className="overlay-list" onClick={() => this.selectOverlay(overlay)}>
        <div className={['overlay-item', this.state.selectedId === overlay.id ? 'selected' : null].join(' ')} >

          <span>{overlay.type === 'poi' ? overlay.content : overlay.type === 'Marker' ? overlay.title : overlay.icon}</span>
          <div className="overlay-info">
            <span>
              {overlay.type === "poi"
                ? "POI"
                : overlay.type === "Marker"
                ? "Marker"
                : "Emissive"}
            </span>
            <div
              className="overlay-delete"
              onClick={(event) => this.del(event, overlay)}
            >
              <img alt="删除" src={deleteImg} />
            </div>
          </div>
        </div>
      </div>
    )

    let markerTitle = null;
    let markerAlign = null;
    let markerBorderColor = null;
    let markerBorder = null;
    //判断是否为Marker类型
    if (this.state.selectedType.value === 'Marker') {
      markerTitle = <div className="input-item">
        <span>标题</span>
        <input onKeyDown={(event) => this.onKeyDown(event)} value={this.state.title} type="text" onChange={(event) => { this.setState({ title: event.target.value }) }} placeholder="请输入文字" />
      </div>
      markerAlign = <div className="drop-item" style={{ marginTop: '12px' }} >
        <span>对齐方式</span>
        <div>
          <DropDown key="markerAlign" options={this.state.alignOptions} selectedItem={this.state.selectedAlign} select={(select) => this.setSelectedAlign(select)} disabled={false} />
        </div>
      </div >
      markerBorderColor = <div className="input-item">
        <span>边框颜色</span>
        <input value={this.state.borderColor} onChange={(event) => { this.setState({ borderColor: event.target.value }) }} type="color" />
      </div>
      markerBorder = <div className="input-item">
        <span>边框大小</span>
        <InputNumber key="markerBorder" min={0} max={1} value={this.state.border} input={(value) => this.setState({ border: value })} />
      </div >
    }
    let emissiveOverlayContent = null;
    let emissiveOverlayOption = null;
    let emissiveOverlayRotation = null;
    let emissiveOverlayOpacity = null;
    let emissiveOverlayEmission = null;
    let emissiveOverlaySpeed = null;
    //判断是否为emissiveOverlay类型
    if (this.state.selectedType.value !== 'emissiveOverlay') {
      emissiveOverlayContent = <div className="input-item" style={{ height: (this.state.selectedType.value === 'poi' ? '24px' : '48px') }}>
        <span>内容</span>
        <textarea cols={4} onKeyDown={(event) => this.onKeyDown(event)} value={this.state.content} onChange={(event) => { this.setState({ content: event.target.value }) }} placeholder="请输入文字"></textarea>
      </div >
      emissiveOverlayOpacity = <div className="input-item">
        <span>不透明度</span>
        <InputNumber key="emissiveOverlayOpacity" min={0} max={100} value={this.state.opacity} input={(value) => this.setState({ opacity: value })} />
      </div >
    } else {
      emissiveOverlayOption = <div className="drop-item" style={{ marginTop: '12px' }}>
        <span>类型</span>
        <div>
          <DropDown key="emissiveOverlayOption" options={this.state.emissiveOptions} selectedItem={this.state.selectedEmissive} select={(select) => this.setSelectedEmissive(select)} disabled={false} />
        </div>
      </div >
      emissiveOverlayRotation = <div className="input-item">
        <span>旋转</span>
        <div className="coordinate-items">
          <div className="coordinate-item">
            <span>X</span><input value={this.state.rotationX} onKeyDown={(event) => this.onKeyDown(event)} onChange={(event) => { this.setState({ rotationX: event.target.value }) }} type="number" />
          </div>
          <div className="coordinate-item">
            <span>Y</span><input value={this.state.rotationY} onKeyDown={(event) => this.onKeyDown(event)} onChange={(event) => { this.setState({ rotationY: event.target.value }) }} type="number" />
          </div>
          <div className="coordinate-item">
            <span>Z</span><input value={this.state.rotationZ} onKeyDown={(event) => this.onKeyDown(event)} onChange={(event) => { this.setState({ rotationZ: event.target.value }) }} type="number" />
          </div>
        </div>
      </div>
      emissiveOverlayEmission = <div className="input-item">
        <span>自发光强度</span>
        <InputNumber key="emissiveOverlayEmission" min={0} value={this.state.emission} input={(value) => this.setState({ emission: value })} />
      </div >
      emissiveOverlaySpeed = <div className="input-item">
        <span>速度</span>
        <InputNumber key="emissiveOverlaySpeed" min={0} value={this.state.speed} input={(value) => this.setState({ speed: value })} />
      </div >
    }
    let iconOption = null;
    let iconTypeOption = null;
    //判断是否为poi类型
    if (this.state.selectedType.value === 'poi') {
      iconTypeOption = <div className="drop-item" style={{ marginTop: '12px' }}>
        <span>类型</span>
        <div>
          <DropDown key="iconTypeOption" options={this.state.iconTypeOptions} selectedItem={this.state.selectedIconType} select={(select) => this.setSelectedIconType(select)} disabled={false} />
        </div>
      </div >
      iconOption = <div className="drop-item" style={{ marginTop: '12px' }}>
        <span>图标</span>
        <div>
          <DropDown key="iconOption" options={this.state.iconOptions} selectedItem={this.state.selectedIcon} select={(select) => this.setSelectedIcon(select)} disabled={false} />
        </div>
      </div >
    }


    return (
      <div className="overlay-main">
        <ContentBlock caption="创建覆盖物" />
        <div className="overlay-block">
          <div className="drop-item">
            <span>种类</span>
            <div>
              <DropDown key="typeOptions" options={this.state.typeOptions} selectedItem={this.state.selectedType} select={(select) => this.setSelectedType(select)} disable={false} />
            </div>
          </div>
          <div className="btn-item">
            <span>坐标拾取</span>
            <button onClick={this.pickup} onMouseUp={this.mouseupStop}>拾取</button>
          </div>
          <div className="input-item">
            <span>坐标</span>
            <div className="coordinate-items">
              <div className="coordinate-item">
                <span>X</span>
                <input onKeyDown={(event) => this.onKeyDown(event)} value={this.state.corrdinateX} type="number" onChange={(event) => { this.setState({ corrdinateX: event.target.value }) }} />
              </div>
              <div className="coordinate-item">
                <span>Y</span>
                <input onKeyDown={(event) => this.onKeyDown(event)} value={this.state.corrdinateY} type="number" onChange={(event) => { this.setState({ corrdinateY: event.target.value }) }} />
              </div>
              <div className="coordinate-item">
                <span>Z</span>
                <input onKeyDown={(event) => this.onKeyDown(event)} value={this.state.corrdinateZ} type="number" onChange={(event) => { this.setState({ corrdinateZ: event.target.value }) }} />
              </div>
            </div>
          </div>
          {markerTitle}
          {emissiveOverlayContent}
          {markerAlign}
          {emissiveOverlayOption}
          {iconTypeOption}
          {iconOption}
          <div className="input-item">
            <span>颜色</span>
            <input value={this.state.color} onChange={(event) => { this.setState({ color: event.target.value }) }} type="color" />
          </div>

          {emissiveOverlayRotation}
          <div className="input-item">
            <span>缩放</span>
            <InputNumber key="scale" min="0" max={100} value={this.state.scale} input={(value) => this.setState({ scale: value })} />
          </div >
          {emissiveOverlayOpacity}
          {markerBorder}

          {markerBorderColor}
          {emissiveOverlayEmission}
          {emissiveOverlaySpeed}

          <div className="btn-item">
            <span></span>
            <button onClick={this.create}>创建</button>
          </div >
        </div>
        <div style={{ marginTop: '20px' }}>
          <ContentBlock caption="覆盖物列表" />
          {overlayArr}
        </div>
      </div >
    )
  }
}
