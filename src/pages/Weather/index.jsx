import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'
import { WeatherName } from '@sheencity/diva-sdk';
export default class index extends Component {

  weathers = [{
    title: "默认",
    typeName: "default",
  },
  {
    title: "晴天",
    typeName: WeatherName.Sunny,
  },
  {
    title: "多云",
    typeName: WeatherName.Overcast,
  },
  {
    title: "小雨",
    typeName: WeatherName.Rain,
  },
  {
    title: "暴雨",
    typeName: WeatherName.Storm,
  },
  {
    title: "雾霾",
    typeName: WeatherName.Smog,
  },
  {
    title: "雪天",
    typeName: WeatherName.Snow,
  },
  {
    title: "摄影棚",
    typeName: WeatherName.Studio,
  },
  ];

  switchWeather = (weather) => {
    if (!weather.typeName) return;
    diva.client.setWeather(weather.typeName).then(() => {
      data.changeCode(`client.setWether('${weather.typeName}')`);
    });
  }
  componentDidMount() {
    diva.client.applyScene("天气控制").then(() => {
      data.changeCode(`client.applyScene('天气控制')`);
    });
  }
  render() {
    const weatherArr = this.weathers.map((weather) =>
      <div key={weather.typeName} className="content" onClick={() => this.switchWeather(weather)}>
        <div className="title">{weather.title}</div>
        <div className="icon">
          <img alt="天气控制" src={require(`/src/assets/icon/weather/${weather.typeName}.png`)} />
        </div>
      </div>
    )

    return (
      <div className="weather-main">
        <ContentBlock caption="天气切换" />
        {weatherArr}
      </div>
    )
  }
}
