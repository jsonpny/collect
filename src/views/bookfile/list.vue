<template>
  <el-row class="bookfilelist">
    <div class="button-group">
      <el-button @click="add"
                 icon="el-icon-plus"
                 plain
                 type="info">增加</el-button>
      <el-button @click="edit"
                 icon="el-icon-edit"
                 plain
                 type="info">编辑</el-button>
      <el-button @click="show"
                 icon="el-icon-search"
                 plain
                 type="info">查看</el-button>
      <el-button @click="del"
                 icon="el-icon-delete"
                 plain
                 type="info">删除</el-button>
    </div>
    <div class="list-cont">
      <el-table :data="page.records"
                :header-cell-style="{'text-align' : 'center','background-color' : 'whitesmoke'}"
                @selection-change="handleSelectionChange"
                border
                highlight-current-row
                ref="table"
                stripe
                style="width: 100%">
        <el-table-column :width="40"
                         align="center"
                         show-overflow-tooltip
                         type="selection"></el-table-column>

        <el-table-column :width="60"
                         align="center"
                         label="序号"
                         show-overflow-tooltip
                         type="index"></el-table-column>
        <el-table-column label="账套所属单位名称"
                         prop="entityName"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         label="采集数据类型"
                         prop="dataType"
                         show-overflow-tooltip
                         width="120"></el-table-column>
        <el-table-column label="账套年度"
                         prop="dataYear"
                         align="center"
                         show-overflow-tooltip
                         width="120"></el-table-column>
        <el-table-column label="数据文件名"
                         prop="fileName"
                         show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="财务数据库类型"
                         prop="databaseType"
                         show-overflow-tooltip
                         width="130"></el-table-column>
        <el-table-column label="财务数据库版本"
                         prop="databaseVersion"
                         show-overflow-tooltip
                         width="130"></el-table-column>

        <el-table-column label="财务软件类型"
                         prop="softType"
                         show-overflow-tooltip
                         width="130">
        </el-table-column>
        <el-table-column label="财务软件版本"
                         prop="softVersion"
                         show-overflow-tooltip
                         width="130">
        </el-table-column>
        <el-table-column label="上传时间"
                         prop="uploadTime"
                         align="center"
                         show-overflow-tooltip
                         width="130">
          <template slot-scope="scope">{{scope.row.uploadTime}}</template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page.current"
                     :page-size="page.size"
                     :page-sizes="[10, 50, 100]"
                     :total="page.total"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     style="margin-top: 5px;"></el-pagination>
    </div>
  </el-row>
</template>

<script scope>
export default {
  name: 'bookfile-list',
  data () {
    return {
      page: { current: 1, size: 10, total: 0, records: [] },
      searchParam: { current: 1, size: 10 },
      multipleSelection: []
    }
  },
  created () {
    this.getBookFileList()
  },
  methods: {
    // 增加
    add () {
      let p = { actpoint: 'edit' }
      this.$router.push({
        path: '/bookfile/detail',
        query: { p: this.$utils.encrypt(JSON.stringify(p)) }
      })
    },
    // 加载机构列表
    getBookFileList () {
      this.$http.post('/api/bookFile/list', this.searchParam).then(res => {
        this.page = res.data.data
      })
    },
    // 编辑
    edit () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行编辑操作！')
        return false
      }
      let p = {
        actpoint: 'edit',
        instid: this.multipleSelection[0].uuid
        // instid: '5555a2a9ea5fcb1864c8eda61cb5d85b'
      }
      this.$router.push({
        path: '/bookfile/detail',
        query: { p: this.$utils.encrypt(JSON.stringify(p)) }
      })
    },
    // 删除
    del () {
      if (this.multipleSelection.length < 1) {
        this.$message.info('请至少选择一条记录进行操作！')
        return false
      }
      let uuidsArr = this.multipleSelection.map(item => item.uuid)
      let uuidsStr = uuidsArr.join()
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/api/bookFile/list/del', { uuid: uuidsStr })
            .then(res => {
              if (res.data.code === 0) {
                this.getBookFileList()
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查看
    show () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行查看操作！')
        return false
      }
      let p = { actpoint: 'look', instid: this.multipleSelection[0].uuid }
      this.$router.push({
        path: '/bookfile/detail',
        query: { p: this.$utils.encrypt(JSON.stringify(p)) }
      })
    },
    // 分页处理函数
    handleSizeChange (val) {
      this.searchParam.size = val
      this.getBookFileList()
    },
    handleCurrentChange (val) {
      this.searchParam.current = val
      this.getBookFileList()
    },
    // 列表选项数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    }

  }

}
</script>

<style lang="less" scoped>
.bookfilelist {
  padding: 20px;
  .list-cont {
    margin-top: 20px;
  }
  .yearpicker {
    width: 100%;
  }
}
</style>
