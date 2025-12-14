<template>
  <div class="question-container">
    <div class="page-header">
      <h2>题目管理</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="请输入题目关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchQuestions">搜索</el-button>
        <el-button type="success" @click="openAddDialog">添加题目</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 题目表格 -->
    <el-table :data="questionList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="question" label="题目内容" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editQuestion(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="confirmDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
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
    
    <!-- 添加/编辑题目对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
      <el-form ref="questionForm" :model="questionForm" :rules="questionRules" label-width="100px">
        <el-form-item label="题目内容" prop="question">
          <el-input v-model="questionForm.question" type="textarea" :rows="4" placeholder="请输入题目内容"></el-input>
        </el-form-item>
        
        <el-divider content-position="left">选项</el-divider>
        
        <div v-for="(option, index) in questionForm.answers" :key="index" class="option-item">
          <el-form-item :label="'选项 ' + (index + 1)" :prop="'answers.' + index + '.text'" :rules="[
            { required: true, message: '请输入选项内容', trigger: 'blur' }
          ]">
            <div class="option-row">
              <el-input v-model="option.text" placeholder="请输入选项内容"></el-input>
              <el-checkbox v-model="option.correct" style="margin-left: 10px;">正确答案</el-checkbox>
              <el-button v-if="questionForm.answers.length > 2" type="danger" icon="el-icon-delete" circle size="mini" @click="removeOption(index)" style="margin-left: 10px;"></el-button>
            </div>
          </el-form-item>
        </div>
        
        <el-form-item>
          <el-button type="primary" @click="addOption" icon="el-icon-plus">添加选项</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitQuestion" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: 'Question',
  data() {
    return {
      // 题目列表
      questionList: [],
      loading: false,
      
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      
      // 搜索
      searchForm: {
        keyword: ''
      },
      
      // 对话框
      dialogVisible: false,
      dialogTitle: '添加题目',
      submitLoading: false,
      isEdit: false,
      
      // 题目表单
      questionForm: {
        id: null,
        question: '',
        answers: [
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false }
        ]
      },
      questionRules: {
        question: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.fetchQuestionList();
  },
  methods: {
    // 获取题目列表
    fetchQuestionList() {
      this.loading = true;
      const params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        keyword: this.searchForm.keyword
      };
      
      this.$axios.get('/question/list', { params })
        .then(response => {
          const res = response.data;
          if (res.code === 1) {
            this.questionList = res.data.records || res.data.list || res.data;
            this.pagination.total = res.data.total || this.questionList.length;
          } else {
            this.$message.error(res.msg || '获取题目列表失败');
          }
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取题目列表失败');
          this.loading = false;
        });
    },
    
    // 搜索题目
    searchQuestions() {
      this.pagination.currentPage = 1;
      this.fetchQuestionList();
    },
    
    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchQuestionList();
    },
    
    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchQuestionList();
    },
    
    // 打开添加题目对话框
    openAddDialog() {
      this.isEdit = false;
      this.dialogTitle = '添加题目';
      this.questionForm = {
        id: null,
        question: '',
        answers: [
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false }
        ]
      };
      this.dialogVisible = true;
      // 重置表单验证
      if (this.$refs.questionForm) {
        this.$nextTick(() => {
          this.$refs.questionForm.clearValidate();
        });
      }
    },
    
    // 编辑题目
    editQuestion(row) {
      this.isEdit = true;
      this.dialogTitle = '编辑题目';
      // 获取题目详情
      this.$axios.get(`/question/detail/${row.id}`)
        .then(response => {
          const res = response.data;
          if (res.code === 1) {
            this.questionForm = {
              id: res.data.id,
              question: res.data.question,
              answers: [...res.data.answers] // 确保是新数组
            };
            
            // 确保至少有4个选项
            while (this.questionForm.answers.length < 4) {
              this.questionForm.answers.push({ text: '', correct: false });
            }
            
            this.dialogVisible = true;
          } else {
            this.$message.error(res.msg || '获取题目详情失败');
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取题目详情失败');
        });
    },
    
    // 添加选项
    addOption() {
      this.questionForm.answers.push({ text: '', correct: false });
    },
    
    // 移除选项
    removeOption(index) {
      this.questionForm.answers.splice(index, 1);
    },
    
    // 提交题目
    submitQuestion() {
      this.$refs.questionForm.validate(valid => {
        if (valid) {
          // 验证至少有一个正确答案
          const hasCorrectAnswer = this.questionForm.answers.some(a => a.correct);
          if (!hasCorrectAnswer) {
            this.$message.warning('至少需要选择一个正确答案');
            return;
          }
          
          // 过滤掉空选项
          this.questionForm.answers = this.questionForm.answers.filter(a => a.text.trim() !== '');
          
          // 验证至少有两个选项
          if (this.questionForm.answers.length < 2) {
            this.$message.warning('至少需要两个选项');
            return;
          }
          
          this.submitLoading = true;
          const url = this.isEdit ? '/question/update' : '/question/add';
          this.$axios.post(url, this.questionForm)
            .then(response => {
              const res = response.data;
              if (res.code === 1) {
                this.$message.success(this.isEdit ? '修改题目成功' : '添加题目成功');
                this.dialogVisible = false;
                this.fetchQuestionList();
              } else {
                this.$message.error(res.msg || (this.isEdit ? '修改题目失败' : '添加题目失败'));
              }
              this.submitLoading = false;
            })
            .catch(error => {
              console.error(error);
              this.$message.error(this.isEdit ? '修改题目失败' : '添加题目失败');
              this.submitLoading = false;
            });
        }
      });
    },
    
    // 确认删除题目
    confirmDelete(row) {
      this.$confirm('确定要删除该题目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteQuestion(row.id);
      }).catch(() => {});
    },
    
    // 删除题目
    deleteQuestion(id) {
      this.$axios.delete(`/question/delete/${id}`)
        .then(response => {
          const res = response.data;
          if (res.code === 1) {
            this.$message.success('删除题目成功');
            this.fetchQuestionList();
          } else {
            this.$message.error(res.msg || '删除题目失败');
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('删除题目失败');
        });
    }
  }
};
</script>

<style scoped>
.question-container {
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

.option-item {
  margin-bottom: 15px;
}

.option-row {
  display: flex;
  align-items: center;
}
</style>
