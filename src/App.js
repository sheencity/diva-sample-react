import React,{Component, Suspense, lazy} from 'react';
import {BrowserRouter} from 'react-router-dom'
import { Route } from 'react-router-dom';
import './App.scss'
import Header from "./components/Header";
import Nan from "./components/Nan";
import CodeView from "./components/CodeView";
import {
  diva
} from './global';
import { Subject } from 'rxjs';
 import {
  debounceTime
} from "rxjs/operators";
import Customize from './pages/Customize';

// 通过懒加载导入各个模块
const Scene = lazy(() => import('./pages/Scene'));
const Video = lazy(() => import('./pages/Video'));
const Global = lazy(() => import('./pages/Global'));
const Weather = lazy(() => import('./pages/Weather'));
const Date = lazy(() => import('./pages/Date'));
const Floor = lazy(() => import('./pages/Floor'));
const Overlay = lazy(() => import('./pages/Overlay'));
const State = lazy(() => import('./pages/State'));
const Monitor = lazy(() => import('./pages/Monitor'));
const Lamp = lazy(() => import('./pages/Lamp'));
const AirConditioner = lazy(() => import('./pages/AirConditioner'));
// 创建并暴露App组件

export default class App extends Component{

  state = {
    isRouter: false,
    exampleCode: false
  }
  changeResolution = new Subject();
  updateResolution = ()=> {
    const width = this.backendContainer.current.clientWidth;
    const height = this.backendContainer.current.clientHeight;
    diva.client.setResolution({
      width,
      height,
    });
  }

  async componentDidMount(){
    if (this.backendContainer.current) {
      //初始话 webRtc 链接
      await diva.init(this.backendContainer.current);
      //  设置服务后端分辨率
      this.updateResolution();
      // 监听显示区域的改变 
      const resizeObserver = new ResizeObserver(() => {
        this.changeResolution.next(true);
      });
      resizeObserver.observe(this.backendContainer.current);
      this.changeResolution
        .pipe(debounceTime(200))
        .subscribe(this.updateResolution);
        this.setState(
          {isRouter: true}
        )
    }
  }

  componentWillUnmount(){
    this.changeResolution.unsubscribe();
  }

  render(){
  
    //获取DOM元素
    this.backendContainer = React.createRef();

    let router = null;
    if(this.state.isRouter){
      router = <div>
                {/* <Redirect to="/scene"></Redirect> */}
                <Route path="/scene" component = {Scene}/>
                <Route path="/video" component = {Video}/>
                <Route path="/global" component = {Global}/>
                <Route path="/weather" component = {Weather}/>
                <Route path="/floor" component = {Floor}/>
                <Route path="/date" component = {Date}/>
                <Route path="/Overlay" component = {Overlay}/>
                <Route path="/state" component = {State}/>
                <Route path="/Monitor" component = {Monitor}/>
                <Route path="/lamp" component = {Lamp}/>
                <Route path="/airconditioner" component = {AirConditioner}/>
                <Route path="/customize" component = {Customize}/>
              </div>
    }
    let codeArea = null;
    if(this.state.exampleCode){
      codeArea = <div className="codeView">
                    <CodeView/>
                  </div>
    }
    return(
      <div className="win">
      <div id="backendContainer" ref={this.backendContainer} className="backend-container"></div>
      <main className={this.state.exampleCode?'includeCodeArea': null}>
      <BrowserRouter>
       <Suspense fallback={<div>Loading...</div>}>
          <header>
            <Header getExampleCode={(exampleCode)=>this.setState({exampleCode: exampleCode})}/>
          </header>
          <article>
            <nav>
              <Nan />
            </nav>
            <div className="router">
              {router}
            </div>
            {codeArea}
          </article>
        </Suspense>
      </BrowserRouter>
      </main>
    </div>
    )



  }
}