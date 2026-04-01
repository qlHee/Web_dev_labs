<template>
  <div class="question-view">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="题目">
        <el-input v-model="searchForm.question" placeholder="题目关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSearch" class="custom-button">查询题目</el-button>
        <el-button type="success" @click="dialogVisible = true" class="custom-button">添加题目</el-button>
      </el-form-item>
    </el-form>

    <!-- 题目列表表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="id"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="question"
        label="问题"
        width="200">
      </el-table-column>
      <el-table-column
        prop="options"
        label="选项"
        width="300">
      </el-table-column>
      <el-table-column
        prop="answer"
        label="答案"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            class="custom-button">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            class="custom-button">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="100">
    </el-pagination>

    <!-- 添加题目对话框 -->
    <el-dialog
      title="题目"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form :model="questionForm" label-width="100px">
        <el-form-item label="问题内容">
          <el-input
            type="textarea"
            :rows="3"
            v-model="questionForm.question">
          </el-input>
        </el-form-item>
        <el-form-item label="选项A:">
          <el-input v-model="questionForm.optionA"></el-input>
        </el-form-item>
        <el-form-item label="选项B:">
          <el-input v-model="questionForm.optionB"></el-input>
        </el-form-item>
        <el-form-item label="选项C">
          <el-input v-model="questionForm.optionC"></el-input>
        </el-form-item>
        <el-form-item label="选项D">
          <el-input v-model="questionForm.optionD"></el-input>
        </el-form-item>
        <el-form-item label="答案">
          <el-input v-model="questionForm.answer"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="custom-button">取 消</el-button>
        <el-button type="primary" @click="handleAddQuestion" class="custom-button">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'QuestionView',
  data() {
    return {
      searchForm: {
        question: ''
      },
      tableData: [
        {
          id: 1,
          question: '法国的首都是什么?',
          options: '巴黎,巴黎,巴黎,巴黎',
          answer: '巴黎'
        },
        {
          id: 1,
          question: '法国的首都是什么?',
          options: '巴黎,巴黎,巴黎,巴黎',
          answer: '巴黎'
        },
        {
          id: 1,
          question: '法国的首都是什么?',
          options: '巴黎,巴黎,巴黎,巴黎',
          answer: '巴黎'
        },
        {
          id: 1,
          question: '法国的首都是什么?',
          options: '巴黎,巴黎,巴黎,巴黎',
          answer: '巴黎'
        },
        {
          id: 1,
          question: '法国的首都是什么?',
          options: '巴黎,巴黎,巴黎,巴黎',
          answer: '巴黎'
        }
      ],
      currentPage: 1,
      dialogVisible: false,
      questionForm: {
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: ''
      }
    }
  },
  methods: {
    onSearch() {
      console.log('搜索题目:', this.searchForm.question)
      this.$message.success('查询题目')
    },
    handleEdit(index, row) {
      console.log('编辑题目:', index, row)
      this.$message.info('编辑题目')
    },
    handleDelete(index, row) {
      console.log('删除题目:', index, row)
      this.$confirm('确认删除该题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log('当前页:', val)
    },
    handleAddQuestion() {
      console.log('添加题目:', this.questionForm)
      this.$message.success('添加题目成功')
      this.dialogVisible = false
      this.questionForm = {
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: ''
      }
    }
  }
}
</script>

<style scoped>
.question-view {
  padding: 20px;
}

.custom-button {
  transition: all 0.3s;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.el-form-item {
  margin-bottom: 20px;
}
</style>

