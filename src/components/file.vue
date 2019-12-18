<!--
 文书组件，actpoint: look 查看，不显示操作类按钮，如上传，删除，生成等；edit 编辑 显示全部功能按钮
          upload: 显示上传按钮
          title: 标题，默认为附件列表
          instid: 必须，文件对应实体id
 -->
<template>
  <div>
    <el-row style="margin-bottom: 10px;margin-left:20px;">
      <span style="font-family: Microsoft YaHei; font-weight: bold;float: left;">文件</span>

      <template v-if="lc_upload && lc_actpoint==='edit'">
        <el-upload class="upload-bookfile"
                   ref="upload"
                   :before-remove="beforeRemove"
                   :on-remove="handleRemove"
                   :on-success="success"
                   action="/finance/api/bookFile/detail/file/save"
                   :headers="headers"
                   :data="{ uuid: this.lc_instid }"
                   :file-list="fileList">
          <el-button slot="trigger"
                     size="mini"
                     type="primary"
                     class="el-icon-upload2 icon-cursor"
                     style="float:right;">上传</el-button>
          <div slot="tip"
               class="el-upload__tip">备注:只能上传zip文件，且不超过1GB</div>
        </el-upload>
      </template>

      <!-- 文件展示区域 -->
      <template v-if="lc_actpoint==='look'">
        <template v-for="rowdata in this.fileList">
          <el-row class="file-style content-style"
                  v-bind:key="rowdata.id"
                  v-if="rowdata.name">
            <el-col :offset="1"
                    :span="21">
              <el-col :span="20">
                <span>
                  <i class="el-icon-document"></i>
                  {{rowdata.name}}
                </span>
                <el-button @click="del(rowdata)"
                           size="mini"
                           v-if="lc_actpoint==='edit'"
                           class="delbtn">
                  <i class="el-icon-delete icon-cursor"
                     v-if="lc_actpoint==='edit'">删除</i>
                </el-button>
              </el-col>
              <el-col :span="4">
                <span style="color: grey;">{{rowdata.editdate}}</span>
              </el-col>
            </el-col>
          </el-row>
        </template>

      </template>

    </el-row>

  </div>
</template>

<script>
export default {
  name: 'file',
  props: [
    'actpoint',
    'instid',
    'title',
    'upload'
  ],
  data () {
    return {
      dialogVisible: false,
      lc_actpoint: this.actpoint,
      lc_title: this.title,
      lc_upload: this.upload,
      fileList: [],
      headers: { authorization: sessionStorage.getItem('a') }
    }
  },
  computed: {
    lc_instid: function () {
      return this.instid
    }
  },
  watch: {
    lc_instid: function () {
      this.getData()
    }
  },
  methods: {
    // 获取文件
    getData () {
      if (this.lc_instid === null) {
        return
      }
      this.$http
        .post('/api/bookFile/detail/baseInfo', {
          uuid: this.lc_instid
        })
        .then(res => {
          if (res.data.code === 0 && res.data.data.fileName) {
            let { fileName: name, uuid } = res.data.data
            this.fileList.splice(0, 1, { name, uuid })
          }
        })
    },
    // 上传成功后
    success (response, file, fileList) {
      if (response.code === 0) {
        let { fileName: name, uuid } = response.data
        this.fileList.splice(0, 1, { name, uuid })
        this.$message({ message: file.name + '上传完毕', type: 'success' })
      } else {
        this.$message({ message: file.name + '上传失败', type: 'error' })
      }
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove (file, fileList) {
      this.$http
        .post('/api/bookFile/detail/file/del', {
          uuid: file.uuid
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({ message: '删除成功', type: 'success' })
            this.fileList.splice(0, 1)
          }
        })
    },
    del (file) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {

        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }

  },
  mounted () {
    if (!this.lc_title) this.lc_title = '文件'
    if (!this.lc_upload) this.lc_upload = false
    if (!this.lc_actpoint) this.lc_actpoint = 'look'
    this.getData()
  }
}
</script>

<style lang="less">
.el-upload.el-upload--text {
  float: right;
  margin-right: 40px;
  position: relative;
  top: -40px;
}
.el-upload__tip {
  margin-top: 40px;
  color: red;
  padding-left: 70px;
  font-size: 16px;
}
.el-upload-list {
  width: 30%;
  padding-left: 70px;
  .el-upload-list__item {
    font-size: 16px;
  }
}
.delbtn {
  margin-left: 30px;
  margin-bottom: 2px;
}
.file-style {
  margin-top: 40px;
}
.el-upload-list__item.is-success .el-upload-list__item-name:hover {
  color: #333;
}
</style>
