<template>
  <div id="app">
    <div id="nav">
      <el-menu :default-active="activeIndex"
               class="el-menu-demo"
               mode="horizontal">
        <el-menu-item index="1">
          <router-link to="/bookfile">采集文件管理</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/dealresult">采集队列管理</router-link>
        </el-menu-item>
        <!-- <el-menu-item index="3">
          <router-link to="/entitybook">账套对应关系查看</router-link>
        </el-menu-item> -->
      </el-menu>
    </div>
    <router-view />
  </div>
</template>
<script>
import qs from 'qs'
import moment from 'moment'
let base64 = require('js-base64').Base64

export default {
  name: 'app',
  data: function () {
    return {
      activeIndex: '1',
      loginAuthorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZSI6WyJzdGF0cyIsImRhdGEiLCJtYWlubGVhZGVyIiwib2ZmbGVhZGVyIiwicmVjdGlmeSIsImFkbWluIiwicGxhbiIsInF1YWxpdHkiLCJhdWRpdG9yIiwic3lzIl0sImlzcyI6IklDU1MiLCJleHAiOjMyODA4OTI2ODMsInB3YyI6IjAiLCJpYXQiOjE1NzU4NTk5NzksIm4iOiLns7vnu5_nrqHnkIblkZgiLCJvbiI6IuS4nOmjjuaxvei9pumbhuWbouaciemZkOWFrOWPuCIsInB3Y21zZyI6IjAifQ.lO4UEDpVgO1Gua0oMj7QuC9mOUfdNb-usSu4cdzM0VuMzpR9x8Qu9E98l2KfZqi7tGSPI0SfV19h81gu98upDA'
    }
  },
  created () {
    // sessionStorage.setItem('a', this.loginAuthorization)
    // this.login()
  },
  methods: {
    login () {
      this.$http
        .post('/root/login', {
          loginname: 'admin163',
          password: base64.encode('1234567')
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: [
            function (data) {
              return qs.stringify(data, {
                serializeDate: timestamp => {
                  let utcTime = moment(timestamp).format('YYYY/MM/DD HH:mm:ss')
                  return utcTime
                }
              })
            }
          ]
        })
        .then(res => {
          if (res.data.code === 0 || res.data.code === 2) {
            // 登录成功跳转
            this.$router.push('/bookfile')
          }
        })
    }

  }
}
</script>

<style lang="less" scoped>
.el-submenu__title .item {
  position: absolute;
  top: -18px;
  right: 28px;
}
.submenu-item .item {
  bottom: 4px;
}
.el-menu--horizontal .el-menu-item,
.el-menu--horizontal .el-menu-item i {
  font-size: 18px;
}
.el-menu--horizontal .el-menu-item a {
  text-decoration: none;
  display: block;
  height: 100%;
}
.el-menu--horizontal .el-menu-item.is-active a {
  color: #66b1ff;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: #ecf5ff;
  color: #66b1ff;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover i {
  color: #66b1ff;
}
.el-message-box__header {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
}
</style>
