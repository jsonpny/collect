<template>
  <div id="app">
    <!-- <div id="nav">
      <el-menu :default-active="activeIndex"
               class="el-menu-demo"
               mode="horizontal">
        <el-menu-item index="1">
          <router-link to="/bookfile">采集文件管理</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/dealresult">采集队列管理</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/entitybook">账套对应关系查看</router-link>
        </el-menu-item>
      </el-menu>
    </div> -->
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
  data: function () {
    return {
      activeIndex: '1',
      src: '',
      args: ''
    }
  },
  created () {
    this.src = this.$refs['myframe'].src
    this.args = this.getQueryArgs(this.src)
    sessionStorage.setItem('a', this.args.authorization)
    // if (this.args.name === 'dealresult') this.activeIndex = '2'
    this.$router.push({ name: this.args.name })
  },
  methods: {
    getQueryArgs (url) {
      var qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : '')
      var args = {}
      var items = qs.length ? qs.split('&') : []
      var item = null
      var name = null
      var value = null
      var i = 0
      var len = items.length

      for (i = 0; i < len; i++) {
        item = items[i].split('=')
        name = decodeURIComponent(item[0])
        value = decodeURIComponent(item[1])
        if (name.length) {
          args[name] = value
        }
      }
      return args
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
