<template>
  <div>
    <baseinfo :actpoint="p.actpoint"
              :instid="p.instid"
              @upInstid="setInstid"></baseinfo>

    <template v-if="hasinstid">
      <el-divider></el-divider>
      <!-- 附件 -->
      <file :actpoint="p.actpoint"
            :instid="p.instid"
            :upload="true"></file>
    </template>

  </div>

</template>

<script>
export default {
  name: 'bookfile-detail',
  components: {
    baseinfo: () =>
      import(/* webpackChunkName: "bookfile-baseinfo" */ '@/components/bookfile/baseinfo'),
    file: () =>
      import(/* bookfile-file */ '@/components/file')
  },
  data () {
    return {
      p: JSON.parse(this.$utils.decrypt(this.$route.query.p)),
      hasinstid: false
    }
  },
  methods: {
    setInstid (instid) {
      this.p.instid = instid
      this.hasinstid = true
    }
  },
  mounted () {
    if (this.p.instid) {
      this.hasinstid = true
    }
  }
}
</script>
