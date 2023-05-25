<template>
  <div class="order">
    <van-button type="primary" @click="handleReceive">0元领取</van-button>
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
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button size="small" type="primary" @click="getSMSCode" v-if="!isGetCode">发送验证码</van-button>
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
  getTraffic,
  getSMS,
  smsCodeCheck } from '../api/index';

import { showFailToast, showSuccessToast } from 'vant';
import 'vant/es/toast/style';

export default {
  name: 'AppOrder',
  props: {
    msg: String
  },
  data: function() {
    return {
      isLogin: false,
      isOrder: false,
      smsShow: false,
      isGetCode: false,
      token:'',
      userInformation:'',
      mobile: '',
      smsCode:'',
      time: 60
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
      let head = {
        idtype:'',
        apptype:''
      };
      let params = {
        token: this.token,
        userInformation: type === 'default' ? '' : this.userInformation
      };
      // 校验token是否有效
      tokenValidate(head, params).then(res => {
        if (res.header.resultcode === '103000') {
          // TODO 登录成功，校验是否已订购
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
        console.log(err);
      });
    },
    // 4G,5G取号
    getMobileToken:function() {
      let sign = window.ywAuth.getSign({appid: '1', version: '1.0'});
      let params = {
        sign: sign
      }
      signEncrypt(params).then(res => {
        // 加密后的签名拉去授权页，用户同意后，拿到token
        if(res.sign) {

          window.ywAuth.getTokenInfo({
            data: {
              version: '1.0',
              appId: '', //移动提供 TODO
              sign: res.sign,
              authPageType: '1',
              expandParams: 'phoneNum=18811222211',
              ieTest: '0'
            },
            success:(res) => {
              this.token = res.token;
              this.userInformation = res.userInformation;
              // TODO 这里的返参userInformation传给校验接口
              this.checkToken('mobile');
            },
            err:function(err) {
              //TODO,弹窗弹出提示
              console.log(err.YDData.message);
            }
          })
        }
      },err => {
        console.log(err);
      });
    },
    // 判断是否已领取
    checkOrder() {
      checkOrder().then(res => {
        if (res.success) {
          this.isOrder = true;
        }
      });
    },
    // 点击 0元领取
    handleReceive:function() {
      if (this.isLogin) {
        if (this.isOrder) {
          // TODO 跳转到生效页
          this.$router.push('/AppSuccess');
        } else {
          this.getTraffic();
        }
      } else {
        // 弹出短信验证码弹窗
        this.smsShow = true;
      }
    },
    // 领取流量
    getTraffic:function() {
      getTraffic().then(res => {
        // 定时器轮询调
        if (res.success) {
          this.$router.push('/AppSuccess');
        }
      },
      err => {
        console.log(err);
      })
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
      getSMS().then(res => {
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
        showFailToast(err);
      })

    },
    // 校验验证码
    smsCodeCheck:function() {
      smsCodeCheck(this.smsCode).then(res => {
        if (res.success) {
          // TODO 验证码验证成功
          this.smsShow = false;
          this.checkOrder();
        } else {
          // TODO 验证码验证失败
          showFailToast('请输入正确的验证码');
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
    },
    onBeforeClose:function() {
      return false;
    }
  }
}
</script>

<style scoped>
.order {
  width: 100%;
  height: 100%;
}

</style>
