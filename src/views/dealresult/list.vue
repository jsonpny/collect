<template>
  <el-row class="bookfilelist">
    <div>
      <el-button @click="collect"
                 icon="el-icon-sell"
                 plain
                 type="info">采集</el-button>
      <el-button @click="show"
                 icon="el-icon-search"
                 plain
                 type="info">查看采集日志</el-button>
    </div>
    <div style="margin-top: 20px;">
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
        <el-table-column label="采集结果"
                         prop="dealResult"
                         align="center"
                         show-overflow-tooltip
                         width="130">
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
  name: 'dealresult-list',
  data () {
    return {
      page: { current: 1, size: 10, total: 0, records: [] },
      searchParam: { current: 1, size: 10 },
      multipleSelection: []
    }
  },
  created () {
    this.getdealresultList()
  },
  methods: {
    // 加载列表
    getdealresultList () {
      this.$http.post('/api/dealResult/list', this.searchParam).then(res => {
        this.page = res.data.data
      })
    },
    // 采集
    collect () {
      if (this.multipleSelection.length < 1) {
        this.$message.info('请至少选择一条记录进行采集！')
        return false
      }
      let uuidsArr = this.multipleSelection.map(item => item.uuid)
      let uuidsStr = uuidsArr.join()
      this.$http
        .post('/api/dealResult/activate', { uuid: uuidsStr })
        .then(res => {
          if (res.data.code === 0) {
            this.getdealresultList()
            this.$message({
              message: '采集成功',
              type: 'success'
            })
          }
        })
    },
    // 查看采集日志
    show () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行查看操作！')
        return false
      }
      this.$http
        .post('/api/dealResult/detail/baseInfo', { uuid: this.multipleSelection[0].uuid })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '查看成功',
              type: 'success'
            })
          }
        })
    },
    // 分页处理函数
    handleSizeChange (val) {
      this.searchParam.size = val
      this.getdealresultList()
    },
    handleCurrentChange (val) {
      this.searchParam.current = val
      this.getdealresultList()
    },
    // 列表选项数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style  scoped>
.bookfilelist {
  padding: 20px;
}
</style>
