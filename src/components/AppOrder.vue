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
  <van-dialog v-model:show="smsShow" show-cancel-button style="padding:20px 20px 0;"
    @confirm="dialogConfirm"
    @cancel="dialogCancel"
    :before-close="onBeforeClose">
      <van-field v-model="mobile" placeholder="请输入手机号码" />
      <van-field
        v-model="smsCode"
        center
        clearable
        placeholder="请输入验证码"
      >
        <template #button>
          <van-button size="small" type="primary" @click="getSMSCode" v-if="!isGetCode">获取验证码</van-button>
          <van-button size="small" type="primary" v-else disabled>{{time}}秒后重试</van-button>
        </template>
      </van-field>
  </van-dialog>
</template>

<script>
import {
  tokenValidate,
  signEncrypt,
  checkOrder,
  getSMS,
  smsCodeCheck,
  getTraffic,
  getResponse } from '../api/index';

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
      smsShow: false,
      isGetCode: false,
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
        this.startTime = new Date().getTime();
        this.getTraffic();
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
        getResponse({
          telephone: this.mobile,
          sourceOrderNo: this.sourceOrderNo
        }).then(res => {
          // 履约回调
          if (res.success) {
            this.$router.push('/AppSuccess');
          } else {
            this.handleProcessing();
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
    onBeforeClose:function() {
      return false;
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
</style>
