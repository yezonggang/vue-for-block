<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        placeholder="股票代码"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="股票名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        检索
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出报表
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="股票代码"
        prop="code"
        sortable="custom"
        align="center"
        width="110px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="股票名称" width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
          <!--           <span class="link-type" @click="handleUpdate(row)">{{
            row.name
          }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="查看股票" width="180px" align="center">
        <template slot-scope="{ row }">
          <el-link
            key="dongcai"
            type="success"
            :href="row.dongcai_URL"
            target="_blank"
            >财报分析</el-link
          >
          |
          <el-link
            key="dongyan"
            type="warning"
            :href="row.dongyan_URL"
            target="_blank"
            >股东研究</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="最新价"
        prop="latest_price"
        width="90px"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.latest_price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="涨跌幅"
        prop="quote_change"
        width="90px"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.quote_change }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="涨跌额"
        width="90px"
        prop="ups_downs"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.ups_downs }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="成交量"
        width="90px"
        prop="volume"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.volume }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="成交额"
        width="90px"
        prop="turnover"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.turnover }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="振幅"
        width="90px"
        prop="amplitude"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.amplitude }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最高"
        width="90px"
        prop="high"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.high }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最低"
        width="90px"
        prop="low"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.low }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="今开"
        width="90px"
        prop="open"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.open }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="昨收"
        width="90px"
        prop="closed"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.closed }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="量比"
        width="90px"
        prop="quantity_ratio"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.quantity_ratio }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="换手率"
        width="90px"
        prop="turnover_rate"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.turnover_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="动态盈亏"
        width="90px"
        prop="pe_dynamic"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.pe_dynamic }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="市净率"
        width="90px"
        prop="pb"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>{{ row.pb }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getBaseList"
    />
  </div>
</template>

<script>
import { fetchBaseList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BaseTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        code: undefined,
        orderby: '+quote_change'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getBaseList()
  },
  methods: {
    getBaseList() {
      this.listLoading = true
      fetchBaseList(this.listQuery).then((response) => {
        this.list = response.data.items
        console.log(response.data.recordsTotal)
        this.total = response.data.recordsTotal
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getBaseList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.orderby = '+' + prop
      } else {
        this.listQuery.orderby = '-' + prop
      }
      console.log(this.listQuery.orderby)
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    } /* ,
    getSortClass: function (key) {
      return this.listQuery.orderBy === `+${key}` ? 'ascending' : 'descending'
    }*/
  }
}
</script>
