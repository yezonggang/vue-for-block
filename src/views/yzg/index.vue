<template>
  <el-table
    :data="student"
    style="width: 100%"
  >
    <el-table-column
      prop="NAME"
      label="姓名"
      width="180"
    />
    <el-table-column
      prop="AGE"
      label="年级"
      width="180"
    />
    <el-table-column
      prop="GENDER"
      label="性别"
    />
    <el-table-column
      prop="CLASS"
      label="班级信息"
    />
  </el-table>
</template>

<script>
import { getstudent } from '@/api/yzg'
export default {
  data() {
    return {
      student: []
    }
  },
  created() {
    this.getstudent()
  },
  methods: {
    async getstudent() {
      const res = await getstudent()
      this.student = res.data
    }
  }
}
</script>

