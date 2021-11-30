import React, { Component } from 'react'
import './index.scss'
import {
  diva, data
} from '../../global';
import ContentBlock from '../../components/ContentBlock'
import { WeatherName } from '@sheencity/diva-sdk';
export default class index extends Component {
  state = {
    date: '',
    time: '',
  }
  seasons = [{
    title: "春",
    value: "2021-03-21",
    name: "spring",
  },
  {
    title: "夏",
    value: "2021-06-22",
    name: "summer",
  },
  {
    title: "秋",
    value: "2021-11-01",
    name: "autumn",
  },
  {
    title: "冬",
    value: "2021-12-21",
    name: "winter",
  },
  {
    title: "冬 (雪)",
    value: "2021-12-21",
    name: "winterSnow",
  },
  ]
  noons = [{
    title: "早晨",
    value: 8,
    name: "morning",
  },
  {
    title: "中午",
    value: 12,
    name: "noon",
  },
  {
    title: "傍晚",
    value: 17,
    name: "afternoon",
  },
  ]


  switchSeason = async (season) => {
    await diva.client.setDate(new Date(season.value));
    if (season.name === "winterSnow") {
      await diva.client.setWeather(WeatherName.Snow);
    } else {
      await diva.client.setWeather(WeatherName.Default);
    }
    if (season.name === "winterSnow") {
      data.changeCode(
        `client.setDate(new Date('${season.value}'));`,
        `client.setWeather('snow')`
      );
    } else if (season.name === "autumn") {
      // 秋季需要设置 11-01， 代码显示 09-23
      data.changeCode(`client.setDate(new Date('2021-09-23'))`);
    } else {
      data.changeCode(`client.setDate(new Date('${season.value}'))`);
    }
  }

  switchNoon = (noon) => {
    diva.client.setTime(this.getTime(noon.value, 0));
    data.changeCode(
      "const now = new Date();",
      `const time = (now.setHours(${noon.value}), now);`,
      "client.setTime(time);"
    );
  }

  onDateChange = (event) => {
    this.setState({
      date: event.target.value
    })
    const date = new Date(event.target.value);
    diva.client.setDate(date);
    data.changeCode(`client.setDate(new Date('${date}'))`);
  }

  onTimeChange = (event) => {
    this.setState({
      time: event.target.value
    })
    const time = new Date();
    const timers = [...(event.target.value.split(":").map((val) => parseInt(val, 10)))];
    time.setHours(
      Number(timers[0]), Number(timers[1])
    );
    diva.client.setTime(time);
    data.changeCode(`client.setTime(new Date('${time}'))`);
  }

  componentDidMount() {
    this.setState({
      date: this.getDate("date"),
      time: this.getDate("time"),
    });
    diva.client.setDate(new Date());
    diva.client.setTime(new Date());
    diva.client.applyScene("日期时间").then(() => {
      data.changeCode(`client.applyScene('日期时间')`);
    });
  }

  getTime = (hour, min) => {
    const now = new Date();
    now.setHours(hour, min, 0, 0);
    return now;
  }

  getDate = (type) => {
    const date = new Date();
    if (type === "date") {
      return `${date.getFullYear()}-${this.format(date.getMonth() + 1)}-${this.format(
        date.getDate()
      )}`;
    } else if (type === "time") {
      return `${this.format(date.getHours())}:${this.format(date.getMinutes())}`;
    }
  }

  format = (v) => {
    return v < 10 ? `0${v}` : `${v}`;
  }

  render() {
    const seasonsArr = this.seasons.map((season) =>
      <div key={season.name} className="content" onClick={() => this.switchSeason(season)}>
        <div className="title">{season.title}</div>
        <div className="icon">
          <img alt="预设四季" src={require(`/src/assets/icon/date/${season.name}.png`)} />
        </div>
      </div>
    )
    const noonsArr = this.noons.map((noon) =>
      <div key={noon.title} className="content" onClick={() => this.switchNoon(noon)}>
        <div className="title">{noon.title}</div>
        <div className="icon">
          <img alt="预设四季" src={require(`/src/assets/icon/date/${noon.name}.png`)} />
        </div>
      </div>
    )
    return (
      <div className="date-main">
        <ContentBlock caption="预设四季" />
        {seasonsArr}
        <div style={{ marginTop: '20px' }}>
          <ContentBlock caption="预设时间" />
          {noonsArr}
        </div >
        <div style={{ marginTop: '20px' }}>
          <ContentBlock caption="自定义" />
          <div className="date-block">
            <div className="date-select">
              <span className="date-title">日期</span>
              <input type="date" onChange={this.onDateChange} value={this.state.date} />
            </div>
            <div className="date-select date-time">
              <span>时间</span>
              <input type="time" onChange={this.onTimeChange} value={this.state.time} />
            </div>
          </div>
        </div>
      </div >
    )
  }
}
