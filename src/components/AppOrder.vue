<template>
  <div class="order">
    <div class="head"> 
      <div class="phone-icon"></div>
      <span class="phone-mask" v-if="mobilemask">{{mobilemask}}</span>
    </div>
    <div class="order-center">
      <div class="order-btn" @click="handleReceive">0元领取</div>
      <p class="order-info">
        <span>每月可享30G移动云手机定向流量</span>
        <span v-if="expireTime">，有效期至{{expireTime}}</span>
      </p>
      <p class="order-info pb16">
        <span>成功领取</span>
        <span class="order-em"> 可在移动云手机APP、H5和微信小程序享受免流服务</span>
      </p>
      <div class="order-rule">
        <p class="order-title">——·活动规则·——</p>
        <div class="order-body">
          <div v-for="item in ruleList" :key="item.id">
            <span class="order-subtitle" v-if="item.type === 'title'">{{item.content}}</span>
            <div v-for="(child,index) in item.content" v-else :key="child">
              <span :class="['order-content',index === 1 && item.id===13 && 'order-strong']">{{child}}</span>
            </div> 
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 短信验证登录 -->
  <div v-if="smsShow" class="mask">
    <div class="sms-layout">
      <img src="../assets/close-icon.png" alt="" class="close-icon" @click="dialogCancel"/>
      <div class="sms-center">
        <img src="../assets/sms-bgd.png" alt="" class="sms-bgd"/>
        <p>登录</p>
        <van-cell-group inset>
          <van-field v-model="mobile" label="" placeholder="请输入手机号" class="sms-input"/>
        </van-cell-group>
        <van-field
          v-model="smsCode"
          center
          clearable
          placeholder="请输入验证码"
          class="sms-cell code-input"
        >
          <template #button>
            <van-button size="small" type="primary" @click="getSMSCode" v-if="!isGetCode">获取验证码</van-button>
            <van-button size="small" type="primary" v-else disabled>{{time}}秒后重试</van-button>
          </template>
        </van-field>
        <div class="sms-btn" @click="dialogConfirm">确认</div>
      </div>
    </div>
  </div>
  <!-- 提示弹窗 -->
  <div v-if="dialogShow" class="mask">
    <div class="sms-layout">
      <img src="../assets/close-icon.png" alt="" class="close-icon" @click="toastConfirm('0')"/>
      <div class="sms-center">
        <div class="dialog-success" v-if="isSuccess">
          <div class="dialog-content">恭喜领取成功</div>
          <img src="../assets/success-bgd.png" alt=""/>
          <p>具体开通情况/时间以短信通知为准</p>
        </div>
        <div v-else>
          <p class="toast-title">
            <span>{{toastTitle}}</span>
            <span class="toast-info" v-if="isRepeat">请勿重复领取，谢谢！</span>
          </p>
        </div>
        <div class="sms-btn" @click="toastConfirm('1')">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  tokenValidate,
  signEncrypt,
  checkOrder,
  getSMS,
  smsCodeCheck,
  getTraffic,
  pointReporting} from '../api/index';

import { showFailToast, showSuccessToast,showLoadingToast, closeToast } from 'vant';
import 'vant/es/toast/style';

export default {
  name: 'AppOrder',
  props: {
    msg: String
  },
  data: function() {
    return {
      ruleList:[{
        id:0,
        type: 'title',
        content: '一、用户对象'
      },{
        id:1,
        type: 'content',
        content:['仅限中国移动用户（不含不限量套餐用户、副卡用户、物联网卡用户）']
      },{
        id:2,
        type: 'title',
        content:'二、开展时间'
      },{
        id:3,
        type: 'content',
        content:[`即日起～2023年12月31日（如延期开展，另行通知）`]
      },{
        id:4,
        type: 'title',
        content:'三、定向流量说明'
      },{
        id:5,
        type: 'content',
        content:['（1）名称：移动云手机0元30GB定向流量包','（2）流量内容：移动云手机定向流量，30GB/月，不结转，当月清零','（3）资费：0元']
      },{
        id:6,
        type: 'title',
        content:'四、定向流量有效期'
      },{
        id:7,
        type: 'content',
        content:['生效以10086短信通知为准，自生效之日起至2023年12月31日。']
      },{
        id:8,
        type: 'title',
        content: '五、定向流量查询'
      },{
        id:9,
        type: 'content',
        content:['用户可通过10086或【中国移动APP-套餐余量】中查询移动云手机定向流量当月的使用量。（不同省查询路径可能有所差异）']
      },{
        id:10,
        type: 'title',
        content: '六、定向流量退订'
      },{
        id:11,
        type: 'content',
        content:['用户可通过拨打10086或【中国移动APP-已订业务】进行退订，退订次月生效。']
      },{
        id:12,
        type: 'title',
        content: '七、定向流量适用范围'
      },{
        id:13,
        type: 'content',
        content:['在中国移动2G/3G/4G/5G网络下（不包括手机号码处于国际及港澳台地区漫游状态、手机作为热点、利用手机设置代理服务器或VPN方式、使用CMWAP接入点方式等情况访问APP所产生的流量），下列使用场景优先消耗移动云手机定向流量（简称“免流”或“免流量”）：','在【移动云手机】的APP、H5、微信小程序内：通过“云手机”-“进入云机”进入云手机（云机）桌面后，在云手机内下载和使用各类应用。（“精彩发现”模块、“个人中心”模块和“应用上传”功能不在免流量范围）']
      },{
        id:14,
        type: 'title',
        content: '八、其他'
      },{
        id:15,
        type: 'content',
        content:['（1）如话费余额不足将无法开通，需用户续费后再尝试。','（2）携号转入用户可能存在信息延迟，建议在转网48小时后再参与。','（3）若当月移动云手机定向流量使用超出30GB，则超出部分默认按用户当前资费套餐执行结算。','（4）移动云手机定向流量的使用遵循各省每月流量总量封顶规则，总流量使用超出封顶额度后用户可能会断网或降速，详询本地10086。','（5）用户需使用开通该30G定向流量的手机账号登录使用移动云手机客户端时，才能进行免流量。']
      },{
        id:16,
        type: 'title',
        content: '九、联系我们'
      },{
        id:17,
        type: 'content',
        content:['如有咨询或建议，可通过以下途径联系我们：','（1）移动云手机APP：移动云手机APP-个人中心-联系客服','（2）微信公众号：进入“中国移动云手机”，点击自助服务-联系我们']
      }],
      messageMap:{
        'kp.freetraffic.0000':'系统异常',
        'kp.freetraffic.0001':'非法参数',
        'kp.freetraffic.0002':'请求移动网络失败',
        'kp.freetraffic.1000':'无效的token',
        'kp.freetraffic.1001':'发送短信验证码失败',
        'kp.freetraffic.1002':'登录失败',
        'kp.freetraffic.2000':'下单失败',
        'kp.freetraffic.2001':'下单结果未返回',
        'kp.freetraffic.2002':'幂等校验失败，请重试',
        'kp.freetraffic.9999':'未知异常'
      },
      isLogin: false,
      isOrder: false,
      isSuccess:false,
      isRepeat:false,
      smsShow: false,
      dialogShow: false,
      isGetCode: false,
      toastTitle:'',
      token:'',
      userInformation:'',
      mobilemask: '',
      mobile: '',
      smsCode:'',
      sourceOrderNo: '',
      startTime: '',
      expireTime:'',
      time: 60,
      trafficTimer:null,
      channelSrc:''
    }
  },
  created:function() {
    if (!window.sessionStorage.getItem('isLogin')) {
      this.getToken();
    } else {
      this.mobilemask = window.sessionStorage.getItem('mobilemask');
      this.mobile = window.sessionStorage.getItem('mobile');
      this.isLogin = window.sessionStorage.getItem('isLogin');
      pointReporting({},{
        userAccount: this.mobile,
        action: '云手机H5免流访问页面'
      }).then();
      this.checkOrder();
    }
    if (window.location.search.includes('channelSrc=')) {
        let search = window.location.search.split('&');
        search.forEach(item => {
          if(item.includes('channelSrc')) {
            this.channelSrc = item.split('=')[1];
          }
        })
    }
  },
  methods: {
    // 获取url上的token
    getToken:function() {
      if(window.location.search.includes('token=')) {
        let search = window.location.search.split('&');
        search.forEach(item => {
          if(item.includes('token')) {
            this.token = item.split('=')[1];
          }
        })
        this.checkToken('default');
      } else {
        this.getMobileToken();
      }
    },
    // 校验token是否有效
    checkToken:function(type) {
      let params = {
        appId: type === 'default' ? '001326' : '000621',
        appType: '5',
        token: this.token,
        userInformation: type === 'default' ? '' : this.userInformation
      };
      // 校验token是否有效
      tokenValidate(params).then(res => {
        if (res.data.success) {
          pointReporting({},{
            userAccount: res.data.data.msisdn,
            action: '云手机H5免流访问页面'
          }).then();
          pointReporting({},{
            userAccount: res.data.data.msisdn,
            action: '云手机H5免流登录成功'
          }).then();
          if(type === 'default') {
            pointReporting({},{
              userAccount: res.data.data.msisdn,
              action: '云手机H5免流单点登录成功'
            }).then();
          } else {
            pointReporting({},{
              userAccount: res.data.data.msisdn,
              action: '云手机H5免流4G/5G取号登录成功'
            }).then();
          }
          this.mobilemask = res.data.data.msisdnmask;
          this.mobile = res.data.data.msisdn;
          this.isLogin = true;
          window.sessionStorage.setItem('mobilemask', this.mobilemask);
          window.sessionStorage.setItem('mobile', this.mobile);
          window.sessionStorage.setItem('isLogin', this.isLogin);
          this.checkOrder();
        } else {
          // 登录失败
          if (type === 'default') {
            // url token校验失败，4g取号
            this.getMobileToken();
          }
        }
      },
      err => {
        if(err.data.errCode) {
          showFailToast(this.messageMap[err.data.errCode]);
        }
      });
    },
    // 校验是否已订购
    checkOrder:function() {
      checkOrder({telephone:this.mobile}).then(res => {
        if (res.data.success && 
        (res.data.data.status === 'TRUE' || 
        res.data.data.status === 'PROCESS' || res.data.data.status === 'CANCELING')) {
          let expireTime = res.data.data.expireTime.split('');
          expireTime.splice(4,0,'年');
          expireTime.splice(7,0,'月')
          expireTime.push('日');
          this.expireTime = expireTime.join('');
          this.isOrder = true;
          window.sessionStorage.setItem('expireTime', this.expireTime);
          window.sessionStorage.setItem('channelSrc', this.channelSrc);
          this.$router.push('/appsuccess');
        }
      },err => {
        if(err.data.errCode) {
          showFailToast(this.messageMap[err.data.errCode]);
        }
      })
    },
    // 4G,5G取号
    getMobileToken:function() {
      let sign = window.ywAuth.getSign({appid: '000621', version: '1.2'});
      let params = {
        originSignature: sign
      }
      signEncrypt(params).then(res => {
        // 加密后的签名拉去授权页，用户同意后，拿到token
        if(res.data.success) {
          window.ywAuth.getTokenInfo({
            data: {
              version: '1.2',
              appId: '000621',
              sign: res.data.data.signature,
              expandParams: `phoneNum=${encodeURIComponent(18878352653)}`, //联调随便s写，生产可以不
              isTest: '0' //0启用测试地址，生产不传
            },
            success:(result) => {
              this.token = result.token;
              this.userInformation = result.userInformation;
              this.checkToken('mobile');
            },
            err:function(err) {
              showFailToast(err.YDData.message);
            }
          });
        } else {
          showFailToast(this.messageMap[res.data.errCode]);
        }
      },err => {
        if(err.data.errCode) {
          showFailToast(this.messageMap[err.data.errCode]);
        }
      });
    },
    // 点击 0元领取
    handleReceive:function() {
      this.isSuccess = false;
      this.isRepeat = false;
      if (this.isLogin) {
        pointReporting({},{
          userAccount: this.mobile,
          action: '云手机H5免流点击领取'
        }).then();
        checkOrder({telephone:this.mobile}).then(res => {
          if (res.data.success && (res.data.data.status === 'TRUE' || 
        res.data.data.status === 'PROCESS' || res.data.data.status === 'CANCELING')) {
            let expireTime = res.data.data.expireTime.split('');
            expireTime.splice(4,0,'年');
            expireTime.splice(7,0,'月')
            expireTime.push('日');
            this.expireTime = expireTime.join('');
            this.isOrder = true;
            this.dialogShow = true;
            document.documentElement.style.overflowY = 'hidden';
            this.isRepeat = true;
            this.toastTitle = '您已成功领取免流权益，';
          } else {
            this.startTime = new Date().getTime();
            this.getTraffic();
          }
        },err => {
          if(err.data.errCode) {
            showFailToast(this.messageMap[err.data.errCode]);
          }
        })
      } else {
        // 弹出短信验证码弹窗
        this.smsShow = true;
        document.documentElement.style.overflowY = 'hidden';
      }
    },
    // 领取流量
    getTraffic:function() {
      showLoadingToast({
        duration:0,
        forbidClick:true,
        message:'请稍后...'
      });
      getTraffic({telephone:this.mobile}).then(res => {
        if (res.data.success) {
          pointReporting({},{
            userAccount: this.mobile,
            action: '云手机H5免流领取成功'
          }).then();
          closeToast();
          this.dialogShow = true;
          document.documentElement.style.overflowY = 'hidden';
          this.isSuccess = true;
        } else {
          closeToast();
          this.dialogShow = true;
          document.documentElement.style.overflowY = 'hidden';
          this.toastTitle = '免流权益领取失败，请稍后再试';
        }
      },
      err => {
        if(err.data.errCode) {
          closeToast();
          showFailToast(this.messageMap[err.data.errCode]);
        }
      })
    },
    // 定时器轮询调用接口
    handleProcessing:function() {
      clearTimeout(this.trafficTimer);
      // 超过5秒超时
      if (new Date().getTime() - this.startTime > 5 * 1000) {
        closeToast();
        clearTimeout(this.trafficTimer);
        showFailToast('领取超时');
        return;
      }

      this.trafficTimer = setTimeout(() => {
        checkOrder({
          telephone: this.mobile
        }).then(res => {
          // 履约回调
          if (res.data.success) {
            this.expireTime = res.data.data.expireTime;
            if (res.data.data.status === 'TRUE') {
              closeToast();
              clearTimeout(this.trafficTimer);
              this.dialogShow = true;
              document.documentElement.style.overflowY = 'hidden';
              this.isSuccess = true;
            } else if (res.data.data.status === 'PENDING') {
              this.handleProcessing();
            } else {
              closeToast();
              clearTimeout(this.trafficTimer);
              const toastMap = {
                'PROCESS': '您已成功领取免流权益，',
                'CANCELING': '您已成功领取免流权益，',
                'FALSE': '免流权益领取失败，请稍后再试'
              };
              this.dialogShow = true;
              document.documentElement.style.overflowY = 'hidden';
              this.toastTitle = toastMap[res.data.data.status];
              this.isRepeat = res.data.data.status !== 'FALSE';
            }
          } else {
            closeToast();
            clearTimeout(this.trafficTimer);
            this.dialogShow = true;
            document.documentElement.style.overflowY = 'hidden';
            this.toastTitle = '免流权益领取失败，请稍后再试';
          }
        },err => {
          if(err.data.errCode) {
            closeToast();
            clearTimeout(this.trafficTimer);
            showFailToast(this.messageMap[err.data.errCode]);
          }
        })
      }, 3000);
    },
    // 获取验证码
    getSMSCode:function() {
      if(!this.mobile) {
        showFailToast('请输入手机号码');
        return;
      }
      let mobileRules = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
      if(!mobileRules.test(this.mobile)) {
        showFailToast('请输入正确的手机号码');
        return;
      }
      let smsParams = {
        apptype:'5',
        msisdn: this.mobile
      }
      getSMS(smsParams).then(res => {
        if (res.data.success) {
          showSuccessToast('验证码发送成功');
          this.isGetCode = true;
          let timer = setInterval(() => {
            this.time--;
            if(this.time === 0) {
              clearInterval(timer);
              this.isGetCode = false;
              this.time = 60;
            }
          },1000);
        } else {
          showFailToast(this.messageMap[res.data.errCode]);
        }
      },err => {
        if(err.data.errCode) {
          showFailToast(this.messageMap[err.data.errCode]);
        }
      })
    },
    // 校验验证码
    smsCodeCheck:function() {
      let checkParams = {
        authtype:'DUP',
        apptype: '5',
        loginid:this.mobile,
        loginidtype: '1',
        password: this.smsCode
      }
      smsCodeCheck(checkParams).then(res => {
        if (res.data.success) {
          this.smsShow = false;
          document.documentElement.style.overflowY = 'auto';
          let msisdn = res.data.data.msisdn;
          this.mobile = res.data.data.msisdn;
          pointReporting({},{
            userAccount: res.data.data.msisdn,
            action: '云手机H5免流访问页面'
          }).then();
          pointReporting({},{
            userAccount: res.data.data.msisdn,
            action: '云手机H5免流登录成功'
          }).then();
          pointReporting({},{
              userAccount: res.data.data.msisdn,
              action: '云手机H5免流短验登录成功'
          }).then();
          msisdn = msisdn.split('');
          msisdn.splice(3,4,'****');
          msisdn = msisdn.join('');
          this.mobilemask = msisdn;
          showSuccessToast('登录成功');
          this.isLogin = true;
          window.sessionStorage.setItem('mobilemask', this.mobilemask);
          window.sessionStorage.setItem('mobile', this.mobile);
          window.sessionStorage.setItem('isLogin', this.isLogin);
          this.checkOrder();
        } else {
          showFailToast(this.messageMap[res.data.errCode]);
        }
      },
      err => {
        if(err.data.errCode) {
          showFailToast(this.messageMap[err.data.errCode]);
        }
      })
    },
    // 验证码确认事件
    dialogConfirm:function() {
      if(!this.mobile) {
        showFailToast('请输入手机号码');
        return;
      }
      let mobileRules = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
      if(!mobileRules.test(this.mobile)) {
        showFailToast('请输入正确的手机号码');
        return;
      }
      if(!this.smsCode) {
        showFailToast('请输入验证码');
        return;
      }
      this.smsCodeCheck();
    },
    // 验证码取消事件
    dialogCancel:function() {
      this.time = 60;
      this.isGetCode = false;
      this.mobile = '';
      this.smsCode = '';
      this.smsShow = false;
      document.documentElement.style.overflowY = 'auto';
    },
    // 提示窗关闭/确认
    toastConfirm:function(type) {
      this.dialogShow = false;
      document.documentElement.style.overflowY = 'auto';
      if (this.isSuccess && type === '1') {
        window.sessionStorage.setItem('mobilemask', this.mobilemask);
        window.sessionStorage.setItem('expireTime', this.expireTime);
        window.sessionStorage.setItem('channelSrc', this.channelSrc);
        this.$router.push('/appsuccess');
      }
    },
  }
} 
</script>

<style scoped>
.order {
  width: 100%;
  overflow: hidden;
  background-color: rgb(141,192,255);
  background-image: url('../assets/home.jpg');
  background-repeat: no-repeat;
  background-size: 100% auto;
  position: relative;
}
.sms-layout {
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  z-index:101;
}
.sms-center {
  background-color:#fff;
  border-radius: 0.625rem;
  padding: 2rem 0.875rem 1.625rem;
  width: 17rem;
  box-sizing: border-box;
  position: relative;
  clear: both;
}
.close-icon {
  width:1.625rem;
  height:1.625rem;
  padding-bottom:0.625rem;
  float: right;
}
.sms-bgd {
  width:100%;
  position: absolute;
  top: 0;
  left: 0;
}
.sms-layout p {
  font-size: 1rem;
  color: #000;
  font-weight: 500;
  text-align: center;
  margin:0;
  padding-bottom:1.875rem;    
  z-index: 1;
  position: relative;
}
.sms-input {
  border-bottom: 0.0625rem solid rgb(169,211,253);
}
.sms-cell {
  margin:0 1rem 2.5rem;
  box-sizing: border-box;
  width: 86%;
  padding-right: 0;
}
.sms-cell.van-cell::before {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  bottom:0;
  left:0.25rem;
  height:0.0625rem;
  width:53%;
  background-color: rgb(169,211,253);
}
.sms-cell.van-cell::after {
  display: none;
}
.sms-layout .sms-center .toast-title {
  font-size:0.75rem;
  text-align: center;
  color:rgba(0,0,0,0.8);
  padding-top:1.75rem;
  padding-bottom:2.5rem;
}
.sms-layout .sms-center .toast-info {
  display: inline-block;
}
.dialog-success {
  font-size:1rem;
  color:rgb(237,147,38);
  text-align: center;
  line-height: 1.2;
}
.dialog-success img {
  width:100%;
  background-size:100% auto;
}
.dialog-success p {
  font-size:0.75rem;
  text-align: center;
  color:rgba(0,0,0,0.8);
  padding-bottom: 1.375rem;
}
.dialog-success .dialog-content {
  position: relative;
  top:0.625rem;
}
</style>
