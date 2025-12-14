<template>
  <div class="score-container">
    <div class="page-header">
      <h2>评分查询</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="请输入用户名关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchRecords">搜索</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 评分表格 -->
    <el-table :data="recordList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="score" label="得分"></el-table-column>
      <el-table-column prop="correctCount" label="正确题数"></el-table-column>
      <el-table-column prop="totalQuestions" label="总题数"></el-table-column>
      <el-table-column label="正确率">
        <template slot-scope="scope">
          {{ ((scope.row.correctCount / scope.row.totalQuestions) * 100).toFixed(1) }}%
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="答题时间" width="180"></el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Score',
  data() {
    return {
      recordList: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      searchForm: {
        keyword: ''
      }
    };
  },
  created() {
    this.fetchRecordList();
  },
  methods: {
    fetchRecordList() {
      this.loading = true;
      const params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        keyword: this.searchForm.keyword
      };
      
      this.$axios.get('/admin/quizRecords', { params })
        .then(response => {
          const res = response.data;
          if (res.code === 1) {
            this.recordList = res.data.list || [];
            this.pagination.total = res.data.total || 0;
          } else {
            this.$message.error(res.msg || '获取评分记录失败');
          }
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取评分记录失败');
          this.loading = false;
        });
    },
    searchRecords() {
      this.pagination.currentPage = 1;
      this.fetchRecordList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchRecordList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchRecordList();
    }
  }
};
</script>

<style scoped>
.score-container {
  padding: 20px;
}
.page-header {
  margin-bottom: 20px;
}
.search-form {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
