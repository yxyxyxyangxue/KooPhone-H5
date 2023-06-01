<template>
  <div class="order">
    <span class="phone-mask">123****9374{{mobilemask}}</span>
    <div class="order-center">
      <div class="order-btn" @click="handleReceive"></div>
      <p class="order-info">活动时间：即日起-{{new Date().getFullYear()}}年12月31日</p>
      <div class="order-rule">
        <p class="order-title">——·活动规则·——</p>
        <div v-for="item in ruleList" :key="item.id">
          <span :class="item.type === 'title' ? 'order-subtitle' : 'order-content'">{{item.content}}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 短信验证登录 -->
  <div v-if="smsShow" class="sms-layout">
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
  <div class="mask" v-if="smsShow || dialogShow"></div>
  <!-- 提示弹窗 -->
  <div v-if="dialogShow" class="sms-layout">
    <img src="../assets/close-icon.png" alt="" class="close-icon" @click="toastConfirm('0')"/>
    <div class="sms-center">
      <div class="dialog-success" v-if="isSuccess">
        <div class="dialog-content">恭喜领取成功</div>
        <img src="../assets/success-bgd.png" alt=""/>
        <p class="">马上去体验特权吧！</p>
      </div>
      <div v-else>
        <p class="toast-title">{{toastTitle}}</p>
        <p class="toast-title" v-if="isOrder">请勿重复领取，谢谢！</p>
      </div>
      <div class="sms-btn" @click="toastConfirm('1')">确认</div>
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
  getTraffic } from '../api/index';

import { showFailToast, showSuccessToast } from 'vant';
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
        content:'1、用户对象'
      },{
        id:1,
        type: 'content',
        content:'仅限中国移动用户（不含WAP不限量套餐用户、副卡用户、物联网卡用户）'
      },{
        id:2,
        type: 'title',
        content:'2、活动时间'
      },{
        id:3,
        type: 'content',
        content:`即日起～${new Date().getFullYear()}年12月31日`
      },{
        id:4,
        type: 'title',
        content:'3、奖品说明'
      },{
        id:5,
        type: 'content',
        content:'云手机定向流量：用户每月可享0元30GB云手机-进入云机内使用（不含应用上传）免流量。具体适用范围见第7点。'
      },{
        id:6,
        type: 'title',
        content:'4、定向流量有效期'
      },{
        id:7,
        type: 'content',
        content:'云手机客户端（）'
      }],
      isLogin: false,
      isOrder: false,
      isSuccess:false,
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
      time: 60,
      trafficTimer:null
    }
  },
  created:function() {
    this.getToken();
  },
  methods: {
    // 获取url上的token
    getToken:function() {
      this.token = window.location.search.split('=')[1];
      if (this.token) {
        this.checkToken('default');
      } else {
        this.getMobileToken();
      }
    },
    // 校验token是否有效
    checkToken:function(type) {
      let params = {
        appType: '5',
        token: this.token,
        userInformation: type === 'default' ? '' : this.userInformation
      };
      // 校验token是否有效
      tokenValidate(params).then(res => {
        if (res.success) {
          this.mobilemask = res.data.msmsdnmask;
          this.mobile = res.data.msisdn;
          this.isLogin = true;
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
        showFailToast(err.errMssage);
      });
    },
    // 校验是否已订购
    checkOrder:function() {
      checkOrder({telephone:this.mobile}).then(res => {
        if (res.success) {
          this.isOrder = true;
          this.$router.push('/AppSuccess');
        }
      },err => {
        showFailToast(err.errMssage);
      })
    },
    // 4G,5G取号
    getMobileToken:function() {
      let sign = window.ywAuth.getSign({appid: '5', version: '1.0'});
      let params = {
        originSignature: sign
      }
      signEncrypt(params).then(res => {
        // 加密后的签名拉去授权页，用户同意后，拿到token
        if(res.success) {
          window.ywAuth.getTokenInfo({
            data: {
              version: '1.0',
              appId: '', //移动提供 TODO
              sign: res.data.signature,
              authPageType: '1',
              expandParams: 'phoneNum=18811222211', //联调随便写，生产可以不填
              ieTest: '0' //0启用测试地址，生产不传
            },
            success:(result) => {
              this.token = result.token;
              this.userInformation = result.userInformation;
              this.checkToken('mobile');
            },
            err:function(err) {
              showFailToast(err.YDData.message);
            }
          })
        }
      },err => {
        showFailToast(err.errMssage);
      });
    },
    // 点击 0元领取
    handleReceive:function() {
      if (this.isLogin) {
        checkOrder({telephone:this.mobile}).then(res => {
          if (res.success) {
            this.isOrder = true;
            this.dialogShow = true;
            this.toastTitle = '您已成功领取免流权益，';
          } else {
            this.startTime = new Date().getTime();
            this.getTraffic();
          }
        },err => {
          showFailToast(err.errMssage);
        })
      } else {
        // 弹出短信验证码弹窗
        this.smsShow = true;
      }
    },
    // 领取流量
    getTraffic:function() {
      getTraffic({telephone:this.mobile}).then(res => {
        if (res.success) {
          this.sourceOrderNo = res.data.sourceOrderNo;
          this.handleProcessing();
        }
      },
      err => {
        showFailToast(err.errMssage);
      })
    },
    // 定时器轮询调用接口
    handleProcessing:function() {
      clearTimeout(this.trafficTimer);
      // 超过多久超时
      if (new Date().getTime() - this.startTime > 60 * 1000) {
        clearTimeout(this.trafficTimer);
        showFailToast('连接超时');
        return;
      }

      this.trafficTimer = setTimeout(() => {
        checkOrder({
          telephone: this.mobile
        }).then(res => {
          // 履约回调
          if (res.success) {
            this.dialogShow = true;
            this.isSuccess = true;
          } else {
            this.handleProcessing();
          }
        },err => {
          const toastMap = {
            '001': '免流权益领取失败，请稍后再试',
            '002': '您的号码暂时无法参与，感谢您的支持！',
            '003': '您已成功领取免流权益，',
            '004': '网络异常，请稍后再试',
            '005': '亲，您来晚了，活动已结束'
          };
          this.dialogShow = true;
          this.toastTitle = toastMap[err.errCode];
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
        msisdn: this.mobile
      }
      getSMS(smsParams).then(res => {
        if (res.success) {
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
        }
      },err => {
        showFailToast(err.errMssage);
      })
    },
    // 校验验证码
    smsCodeCheck:function() {
      let checkParams = {
        authtype:'DUP',
        loginid:this.mobile,
        loginidtype: '1',
        password: this.smsCode
      }
      smsCodeCheck(checkParams).then(res => {
        if (res.success) {
          this.smsShow = false;
          this.mobilemask = res.data.msisdn;
        } else {
          showFailToast('请输入正确的验证码');
        }
      },
      err => {
        showFailToast(err.errMssage);
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
    },
    // 提示窗关闭/确认
    toastConfirm:function(type) {
      this.dialogShow = false;
      this.isSuccess = false;
      if (this.isSuccess && type === '1') {
        this.$router.push('/AppSuccess');
      }
    },
    // 获取当月最后一天日期
    getLastDay:function(){
      var year = new Date().getFullYear(); 
      var month = new Date().getMonth() + 1; 
      var lastDate = new Date(year, month , 0).getDate();
      month = month < 10 ? '0' + month : month ;
      let day = `${year}年${month}月${lastDate}日`;
      return day;
    }
  }
} 
</script>

<style scoped>
.order {
  width: 100%;
  height: 100%;
  background:url("../assets/home.jpg") no-repeat;
  background-size:100% 100%;
  position: relative;
}
.sms-layout {
  position: absolute;
  top:26%;
  left:50%;
  transform: translateX(-50%);
  z-index:9;
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
