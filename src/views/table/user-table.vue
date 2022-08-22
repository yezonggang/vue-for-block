<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 90px; margin-right: 5px"
      >
        <el-option v-for="item in columnName" :key="item" :value="item" />
      </el-select>
      <el-input
        v-model="listQuery.title"
        placeholder="关键词"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column
        label="用户ID"
        prop="id"
        sortable="custom"
        align="center"
        min-width="100"
        :class-name="getSortClass('id')"
      >
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center"
        min-width="100px"
        prop="username"
      >
      </el-table-column>
      <el-table-column label="电话" prop="tel" align="center" min-width="100">
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" min-width="120">
      </el-table-column>
      <el-table-column
        label="图标"
        prop="avatar"
        align="center"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        label="描述"
        align="center"
        min-width="100"
        prop="des"
        class-name="small-padding fixed-width"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="create_time"
        sortable="custom"
        align="center"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        label="修改时间"
        prop="update_time"
        sortable="custom"
        align="center"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      style="position: fixed; right: 10px; bottom: 10px"
      v-show="total >= 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- @pagination="getList" -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="图标" prop="avatar">
          <el-input v-model="temp.avatar" />
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="temp.des" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      columnName: ['id', '用户名'],
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      temp: {
        name: undefined,
        tel: 1,
        email: '',
        avtor: '',
        des: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '新增用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      this.total = 1
      this.list = [
        {
          id: 1,
          username: 'dfdfdf',
          tel: '15286829800',
          email: '717818895@qq.com',
          avatar: 'vue',
          des: 'tstestst',
          create_time: '2022/07/18 15:00:23',
          update_time: '2022/07/18 15:00:23'
        },
        {
          id: 2,
          username: 'xxxxx',
          tel: '15286829800',
          email: '717818895@qq.com',
          avatar: 'vue',
          des: 'tstestst',
          create_time: '2022/07/18 15:00:23',
          update_time: '2022/07/18 15:00:23'
        }
      ]
      // fetchList(this.listQuery).then((response) => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // // Just to simulate the time of the request
      //   setTimeout(() => {
      //   this.listLoading = false
      //   }, 1.5 * 1000)
      // })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: undefined,
        tel: 1,
        email: '',
        avatar: 'x',
        des: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'desending'
    }
  }
}
</script>
