<template>
  <div class="exampleinfo">
    <el-row>
      <el-col :span="24">
        <div style="border-radius: 10px; margin:0 auto; height:40px; line-height: 40px;">
          <span style="font-family: Microsoft YaHei; font-weight: bold; margin-left: 20px; float: left;">审计案例基本信息</span>
          <div style="float: right; margin-right:40px;">
            <el-button @click="edit"
                       class="el-icon-edit icon-cursor"
                       size="mini"
                       title="编辑"
                       type="primary"
                       v-show="editicon">编辑</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 信息编辑 -->
    <template v-if="editpanel">
      <div class="edit">
        <el-form :model="form"
                 :rules="rules"
                 label-width="100px"
                 ref="form">
          <el-row>
            <el-col :offset="1"
                    :span="10">
              <el-form-item label="账套单位名称"
                            prop="entityCode">
                <el-cascader :options="orgTree"
                             :props="{ checkStrictly: true,emitPath:false}"
                             :show-all-levels="false"
                             @change="orgChange"
                             clearable
                             filterable
                             placeholder="请选择"
                             ref="orgCascader"
                             v-model="form.entityCode">
                  <template slot-scope="{ node, data }">
                    <span :title="data.label">{{ data.label }}</span>
                    <span v-if="!node.isLeaf">({{ data.children.length }})</span>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :offset="1"
                    :span="10">
              <el-form-item label="账套年度"
                            prop="dataYear">
                <el-date-picker v-model="form.dataYear"
                                type="year"
                                value-format="yyyy"
                                placeholder="选择年"
                                class="yearpicker">
                </el-date-picker>
              </el-form-item>

            </el-col>
          </el-row>

          <el-row>
            <el-col :offset="1"
                    :span="10">
              <el-form-item label="采集数据类型"
                            prop="dataType">
                <el-select placeholder="请选择"
                           v-model="form.dataType">
                  <el-option label="AE"
                             value="AE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="1"
                    :span="21">
              <el-form-item align="center">
                <el-button @click="formOnSubmit"
                           type="primary">保存</el-button>
                <el-button @click="formOnCancle">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <!-- 信息查看部分 -->
    <template v-else>
      <div class="content-style">
        <el-row>
          <el-col :offset="1"
                  :span="10"
                  style="margin-top: 20px;">
            <label class="label-style">账套单位名称</label> :
            <span class="label-span-style">{{this.data.entityName}}</span>
          </el-col>
          <el-col :offset="1"
                  :span="10"
                  style="margin-top: 20px;">
            <label class="label-style">账套年度</label> :
            <span class="label-span-style">{{this.data.dataYear}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="1"
                  :span="10"
                  style="margin-top: 20px;">
            <label class="label-style">采集数据类型</label> :
            <span>{{this.data.dataType}}</span>
          </el-col>
        </el-row>

      </div>
    </template>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'bookfile-baseinfo',
  props: ['actpoint', 'instid'],
  data () {
    return {
      form: { uuid: '', entityCode: '', entityName: '', dataType: 'AE', dataYear: '' },
      data: { uuid: '', entityCode: '', entityName: '', dataType: '', dataYear: '' },
      rules: {
        entityCode: [
          { required: true, message: '请输入账套单位名称', trigger: 'blur' }
        ],
        dataYear: [
          { required: true, message: '请选择账套年度', trigger: 'change' }
        ]
      },
      orgTree: [],
      editpanel: false,
      editicon: false,
      lc_actpoint: this.actpoint,
      lc_instid: this.instid
    }
  },
  methods: {
    // 获取单位树信息
    getOrgTree () {
      this.$http.post('/root/../../api/base/loadorglist', {
        transformRequest: [
          function (data) {
            return qs.stringify(data)
          }
        ]
      }
      ).then(res => {
        this.orgTree = res.data.data
        if (!this.orgid) {
          this.form.entityCode = this.orgTree[0].value
          this.form.entityName = this.orgTree[0].label
        }
      })
    },
    // 确定单位
    orgChange () {
      let selectLabelArr = this.$refs['orgCascader'].getCheckedNodes()[0].pathLabels
      this.form.entityName = selectLabelArr[selectLabelArr.length - 1]
    },
    // 保存 新增/修改信息
    formOnSubmit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$http
            .post('/api/bookFile/detail/baseInfo/save', this.form)
            .then(res => {
              if (res.data.code === 0) {
                this.data = JSON.parse(JSON.stringify(this.form))
                this.data.uuid = this.form.uuid = res.data.data.uuid
                this.$emit('upInstid', res.data.data.uuid)
                this.editpanel = false
                this.editicon = true
              }
            })
        }
      })
    },
    // 查询某个机构信息
    getBaseinfo () {
      this.$http
        .post('/api/bookFile/detail/baseInfo', {
          uuid: this.lc_instid
        })
        .then(res => {
          if (res.data.code === 0) {
            this.data = res.data.data
          }
        })
    },
    // 取消 保存单位信息
    formOnCancle () {
      this.editpanel = false
      this.editicon = true
    },
    // 编辑按钮
    edit () {
      this.editpanel = true
      this.editicon = false
      this.form = JSON.parse(JSON.stringify(this.data)) // clone到form，避免双向绑定
      if (!this.lc_instid) this.form.dataType = 'AE'
      this.form.dataYear = this.form.dataYear + ''
    }
  },
  mounted () {
    // 默认为查看状态

    // 新增或者编辑--编辑按钮展示
    if (this.actpoint === 'edit') {
      this.editicon = true
      this.getOrgTree()
    }

    if (!this.lc_instid) {
      // 新增--编辑页展示
      this.edit()
    } else {
      // 编辑--查看页展示
      this.getBaseinfo()
    }
  }
}
</script>

<style lang="less" scoped>
.exampleinfo {
  .label-style {
    width: 120px;
  }
  .edit {
    padding-top: 20px;
    background-color: whitesmoke;
    .yearpicker {
      width: 100%;
    }
  }
}
</style>
