<template>
  <el-row class="bookfilelist">
    <div>
      <el-button @click="show"
                 icon="el-icon-search"
                 plain
                 type="info">查看执行进度明细</el-button>
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

        <el-table-column label="数据文件名"
                         prop="fileName"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="执行完成率"
                         prop="rate"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.rate?scope.row.rate*100:0"></el-progress>
          </template>
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
      multipleSelection: [],
      timeNum: ''
    }
  },
  created () {
    this.getdealresultList()
    this.timeNum = setInterval(this.getdealresultList, 1000)
  },
  methods: {
    // 加载列表
    getdealresultList () {
      this.$http.post('/api/dealResult/list', this.searchParam).then(res => {
        this.page = res.data.data
        clearInterval(this.timeNum)
      })
    },
    // 查看进度明细
    show () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行查看操作！')
        return false
      }
      if (this.multipleSelection[0].explain) {
        let explain = this.multipleSelection[0].explain.split('\n')
        let explainArr = explain.map(item => '<p>' + item + '</p>')
        let explainStr = explainArr.join('')
        this.$alert(explainStr, '进度明细', {
          dangerouslyUseHTMLString: true
        })
      } else {
        this.$message({
          message: '没有采集日志',
          type: 'warning'
        })
      }
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
