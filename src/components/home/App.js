import React, { Component } from 'react';

import Swiper from 'swiper/dist/js/swiper.js'
 
import 'swiper/dist/css/swiper.min.css'
import './assets/index.css'
import Footer from '../../footer/Footer'

import banner2 from './assets/2.png';
import floor_1 from './assets/floor_1.png';
import floor_2 from './assets/floor_2.png';
import floor_3 from './assets/floor_3.png';
import floor_4 from './assets/floor_4.png';
import floor_2_1 from './assets/Transaction_process.png';
import floor_2_2 from './assets/introduce.png';
import floor_2_3 from './assets/Group 29.png';
import floor_2_4 from './assets/Group 30.png';
import cb from './assets/cb.png';
import ccb from './assets/ccb.png';
import  download from '../../img/app.png';
class App extends Component {
    componentDidMount () {
    
        var mySwiper = new Swiper('.swiper-container', {
          autoplay: true,
          loop: true,
          pagination : {
              el: '.swiper-pagination',
          }
        });
    }
  render() {
    return (
      <React.Fragment>
        <div className="banner">
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {/* <div className="swiper-slide">
                        <img src={banner1} alt=''/>
                    </div> */}
                    <div className="swiper-slide">
                        <img src={banner2} alt=''/>
                    </div>
                </div>
                <div className='swiper-pagination'></div>
            </div>
        </div>

        <div className="floor">
            <div className="contenner">
                <ul className="row">
                    <li className="col-md-3">
                        <img src={floor_2} alt='' />
                        <p className="floor_title">真实交易</p>
                        <p className="floor_nr">资金第三方托管，专款专用</p>
                    </li>
                    <li className="col-md-3">
                        <img src={floor_1} alt=''/>
                        <p className="floor_title">资金安全</p>
                        <p className="floor_nr">100%实盘交易</p>
                    </li>
                    <li className="col-md-3">
                        <img src={floor_3} alt=''/>
                        <p className="floor_title">超低门槛</p>
                        <p className="floor_nr">灵活使用，500元即可交易</p>
                    </li>
                    <li className="col-md-3">
                    
                        <img src={floor_4} alt=''/>
                        <p className="floor_title">专业服务</p>
                        <p className="floor_nr">一对一专属客服，全程服务</p>
                    </li>
                </ul>
            </div>
        </div>

        <div className="foor_2">
            <div className="contenner">
                <div className="row">
                    <div className="foor_2_title">
                        <h2>交易流程</h2>
                        <div className="foor_2_heng">

                        </div>
                    </div>
                    <div className="foor_2_img">
                        <img src={floor_2_1} alt=''/>
                        <div className="row">
                            <p><span className="nub">01</span ><span className='nei'>下载APP,完成开户</span><span className="foor_2_heng"></span><span className="nub">02</span ><span className='nei'>实名认证，充值入金</span><span className="foor_2_heng"></span><span className="nub">03</span ><span className='nei'>选择品种，进行交易</span></p>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>

        <div className="foor_3">
            <div className="contenner">
                <div className="row">
                    <div className="foor_2_title">
                        <h2>5重保障最大力度保障您的利益</h2>
                        <div className="foor_2_heng">

                        </div>
                    </div>

                    <div className="foor_3_title">
                        <p><span className="foo">资金安全</span><span className="shu"></span><span className="foo">风控体系</span><span className="shu"></span><span className="foo">网站安全</span><span className="shu"></span><span className="foo">运行稳定</span><span className="shu"></span><span className="foo">真实交易</span></p>
                    </div>

                    <img src={floor_2_2} alt='' className="dbma"/>
                </div>
            </div>
        </div>
        
        <div className="foor_4">
            <div className="contenner">
                <div className="foor_2_title">
                    <h2>合作伙伴</h2>
                    <div className="foor_2_heng">

                    </div>
                </div>

                <div className="row w7m0">
                    <div className="col-md-3 ">
                        <img src={floor_2_3} alt=''/>
                    </div>
                    <div className="col-md-3 ">
                        <img src={floor_2_4} alt=''/>
                    </div>
                    <div className="col-md-3 ">
                        <img src={cb} alt=''/>
                        
                    </div>
                    <div className="col-md-3  nmr">
                        <img src={ccb} alt=''/>
                        
                    </div>
                </div>
              
            </div>
        </div>

        < img src = {
            download
        }
        style = {
            {
                position: 'fixed',
                top: '50%',
                right: '0',
                width: '167px',
                transform: 'translateY(-50%)',
                zIndex:999
            }
        }
        alt = ""
        srcSet = "" />
        <Footer/>
      </React.Fragment>
    );
  }
}

export default App;
