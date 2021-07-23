import React,{Component, Suspense, lazy} from 'react';
import {BrowserRouter} from 'react-router-dom'
import { Route, Redirect } from 'react-router-dom';
import './App.scss'
import Header from "./components/Header";
import Nan from "./components/Nan";
import {
  diva
} from './global';
import { Subject } from 'rxjs';
 import {
  debounceTime
} from "rxjs/operators";
// 通过懒加载导入各个模块
const Scene = lazy(() => import('./pages/Scene'));


// 创建并暴露App组件

export default class App extends Component{


  state = {
    isRouter: false
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
                <Redirect to="/scene"></Redirect>
                <Route path="/scene" component = {Scene}/>
              </div>
    }

    
    return(
      <div className="win">
      <div id="backendContainer" ref={this.backendContainer} className="backend-container"></div>
      <main>
      <BrowserRouter>
       <Suspense fallback={<div>Loading...</div>}>
          <header>
            <Header />
          </header>
          <article>
            <nav>
              <Nan />
            </nav>
            <div className="content">
              {router}
            </div>
          </article>
        </Suspense>
      </BrowserRouter>
      </main>
    </div>
    )



  }
}