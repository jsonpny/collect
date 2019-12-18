<template>
  <el-row class="bookfilelist">
    <div>
      <el-button @click="add"
                 icon="el-icon-plus"
                 plain
                 type="info">增加</el-button>
      <el-button @click="edit"
                 icon="el-icon-edit"
                 plain
                 type="info">编辑</el-button>
      <el-button @click="del"
                 icon="el-icon-delete"
                 plain
                 type="info">删除</el-button>
      <el-button @click="show"
                 icon="el-icon-search"
                 plain
                 type="info">查看</el-button>
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
        <el-table-column :width="100"
                         align="center"
                         label="单位编码"
                         prop="orgcode"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :width="120"
                         label="单位简称"
                         prop="shortname"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :min-width="120"
                         label="单位名称"
                         prop="orgname"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :min-width="100"
                         label="所属单位"
                         prop="porgname"
                         show-overflow-tooltip></el-table-column>
        <el-table-column filter-placement="bottom-end"
                         label="操作"
                         prop="isused"
                         show-overflow-tooltip
                         width="80">
          <template slot-scope="scope">
            <el-button :type="scope.row.isused === '0' ? 'primary' : 'success'"
                       @click.stop="handleOpenOrClosed(scope.$index, scope.row)"
                       size="mini">{{scope.row.isused === "0" ?'启用':'禁用'}}</el-button>
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
  name: 'entitybook-list',
  data () {
    return {
      page: { current: 1, size: 10, total: 0, records: [] },
      searchParam: { current: 1, size: 10 },
      multipleSelection: [],
      filterText: '',
      defaultProps: { children: 'children', label: 'label' }
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    // 加载机构列表
    getOrgList () {
      this.$http.post('/api/entityBook/list', this.searchParam).then(res => {
        this.page = res.data.data
      })
    },
    // 启用/禁用
    handleOpenOrClosed (index, row) {
      let { uuid, isused: isUsed } = row
      isUsed = isUsed === '0' ? '1' : '0'
      let objData = { uuid, isUsed }
      this.$http
        .post('/api' + this.$route.path + 'enableordisable', objData)
        .then(res => {
          if (res.data.code === 0) {
            this.getOrgList()
            this.getOrgTree()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
    },
    // 增加单位
    add () {
      let p = {
        actpoint: 'edit',
        porgid: this.searchParam.porgid,
        porgname: this.searchParam.porgname
      }
      this.$router.push({
        path: '../detail/',
        query: { p: this.$utils.encrypt(JSON.stringify(p)) }
      })
    },
    // 编辑单位
    edit () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行编辑操作！')
        return false
      }
      let p = {
        actpoint: 'edit',
        instid: this.multipleSelection[0].uuid,
        orgname: this.multipleSelection[0].orgname
      }
      this.$router.push({
        path: '../detail/',
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
            .post('/api' + this.$route.path + 'del', { uuid: uuidsStr })
            .then(res => {
              if (res.data.code === 0) {
                this.getData()
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
        path: '../detail/',
        query: { p: this.$utils.encrypt(JSON.stringify(p)) }
      })
    },
    // 分页处理函数
    handleSizeChange (val) {
      this.searchParam.size = val
      this.getOrgList()
    },
    handleCurrentChange (val) {
      this.searchParam.current = val
      this.getOrgList()
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
