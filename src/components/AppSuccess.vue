<template>
  <div class="success">
    <div class="head"> 
      <div class="phone-icon"></div>
      <span class="phone-mask" v-if="mobilemask">{{mobilemask}}</span>
    </div>
    <div class="order-center">
      <div class="order-btn success-btn" @click="handleReceive">立即使用</div>
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
   <!-- 提示弹窗 -->
  <div v-if="dialogShow" class="mask">
    <div class="sms-layout">
      <img src="../assets/close-icon.png" alt="" class="close-icon" @click="toastConfirm()"/>
      <div class="sms-center">
        <div>
          <p class="toast-title">
            <span>网络异常，请稍后再试</span>
          </p>
        </div>
        <div class="sms-btn" @click="toastConfirm()">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import {pointReporting,checkOrder} from '../api/index';
export default {
  name: 'AppSuccess',
  props: {
    msg: String
  },
  data:function() {
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
        content:['在中国移动2G/3G/4G/5G网络下（不包括手机号码处于国际及港澳台地区漫游状态、手机作为热点、利用手机设置代理服务器或VPN方式、使用CMWAP接入点方式等情况访问APP所产生的流量），下列使用场景优先消耗移动云手机定向流量（简称“免流”或“免流量”）：','在【移动云手机】的APP、H5、微信小程序内：通过“云手机”-“进入云机”进入云手机（云机）桌面后，在云手机内下载和使用各类应用。（“精彩发现”模块、“个人中心”模块和“应用上传”功能模块不在免流量范围）']
      },{
        id:14,
        type: 'title',
        content: '八、其他'
      },{
        id:15,
        type: 'content',
        content:['（1）如话费余额不足将无法开通，需用户续费后再尝试。','（2）携号转入用户可能存在信息延迟，建议在转网48小时后再参与。','（3）若当月移动云手机定向流量使用超出30GB，则超出部分默认按用户当前资费套餐执行结算。','（4）移动云手机定向流量的使用遵循各省每月流量总量封顶规则，总流量使用超出封顶额度后用户可能会断网或降速，详询本地10086','（5）用户需使用开通该30G定向流量的手机账号登录使用移动云手机客户端时，才能进行免流量。']
      },{
        id:16,
        type: 'title',
        content: '九、联系我们'
      },{
        id:17,
        type: 'content',
        content:['如有咨询或建议，可通过以下途径联系我们：','（1）移动云手机APP：移动云手机APP-个人中心-联系客服','（2）微信公众号：进入“中国移动云手机”，点击自助服务-联系我们']
      }],
      mobilemask:'',
      expireTime:'',
      mobile:'',
      timer:null,
      channelSrc:'',
      dialogShow: false
    }
  },
  created:function() {
    if(window.sessionStorage.getItem('isLogin')) {
      this.mobilemask = window.sessionStorage.getItem('mobilemask');
      this.channelSrc = window.sessionStorage.getItem('channelSrc');
      this.mobile = window.sessionStorage.getItem('mobile');
      pointReporting({},{
        userAccount: this.mobile,
        action: '云手机H5免流访问页面'
      }).then();
      this.getTime();
    } else {
      this.$router.push('/apporder');
    }
  },
  methods: {
    handleReceive:function() {
      if(!window.navigator.onLine) {
        this.dialogShow = true;
        document.documentElement.style.overflowY = 'hidden';
        return;
      }
      pointReporting({},{
          userAccount: this.mobile,
          action: '云手机H5免流点击使用'
      }).then();
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      if(!isAndroid) {
        // h5云手机页面
        window.location.href = this.channelSrc ? `https://cloudphoneh5.buy.139.com?channelSrc=${this.channelSrc}` : `https://cloudphoneh5.buy.139.com`;
      } else {
        if(window.location.search.includes('origin=1')) {
          // app内跳转
          try {
            // eslint-disable-next-line no-undef
            Android.showCloudPhoneTab();
          } catch(e) {
            console.log(e);
          }
        } else{
          try {
            window.location = 'fzs://cp-open/params';
            clearTimeout(this.timer);
            this.timer = window.setTimeout(function() {
              window.location.href = this.channelSrc ? `https://cpactiv.buy.139.com/#/newDownload?channelSrc=${this.channelSrc}` : "https://cpactiv.buy.139.com/#/newDownload";   
            }, 500);
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    getTime:function() {
      checkOrder({telephone:this.mobile}).then(res => {
          if (res.data.success && (res.data.data.status === 'TRUE' || 
        res.data.data.status === 'PROCESS' || res.data.data.status === 'CANCELING')) {
            let expireTime = res.data.data.expireTime.split('');
            expireTime.splice(4,0,'年');
            expireTime.splice(7,0,'月')
            expireTime.push('日');
            this.expireTime = expireTime.join('');
          }
      });
    },
    // 提示窗关闭
    toastConfirm:function() {
      this.dialogShow = false;
      document.documentElement.style.overflowY = 'auto';
    }
  }
}
</script>

<style scoped>
.success {
  width: 100%;
  overflow: hidden;
  background-color: rgb(141,192,255);
  background-image:url("../assets/success.jpg");
  background-repeat: no-repeat;
  background-size:100% auto;
  position: relative;
} 
.success-btn {
  background:url("../assets/btn-success.png") no-repeat center;
  background-size: contain;
} 
</style>
