<template>
  <div class="app-container">
    <!-- 操作栏 -->
    <div class="mb-4">
      <el-button type="primary" @click="openDialog('add')">新增 Prompt</el-button>
      <el-input 
        v-model="searchProject"
        placeholder="输入项目名称筛选"
        style="width: 200px; margin-left: 10px"
        @change="loadData"
      />
    </div>

    <!-- 数据表格 -->
    <el-table 
      :data="tableData" 
      border 
      :row-style="{ minHeight: '60px' }"
    >
      <el-table-column prop="project" label="项目" width="150" />
      <el-table-column prop="code" label="唯一标识" width="180" />
      <el-table-column prop="systemPrompt" label="系统提示语" show-overflow-tooltip />
      <el-table-column prop="userPrompt" label="用户提示语" show-overflow-tooltip />
      <el-table-column prop="ext" label="扩展字段"  />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogType === 'add' ? '新增 Prompt' : '编辑 Prompt'"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="项目" prop="project">
          <el-input v-model="form.project" />
        </el-form-item>
        <el-form-item label="唯一标识" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="系统提示语" prop="systemPrompt">
          <el-input 
            v-model="form.systemPrompt" 
            type="textarea" 
            :rows="3" 
          />
        </el-form-item>
        <el-form-item label="用户提示语" prop="userPrompt">
          <el-input 
            v-model="form.userPrompt" 
            type="textarea" 
            :rows="3" 
          />
        </el-form-item>
        <el-form-item label="扩展字段">
          <el-input v-model="form.ext" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 表格数据
const tableData = ref([])
const searchProject = ref('')

// 弹窗相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const form = reactive({
  project: '',
  code: '',
  systemPrompt: '',
  userPrompt: '',
  ext: ''
})

// 表单验证规则
const rules = reactive({
  project: [{ required: true, message: '必填字段', trigger: 'blur' }],
  code: [{ required: true, message: '必填字段', trigger: 'blur' }],
  systemPrompt: [{ required: true, message: '必填字段', trigger: 'blur' }]
})

// 加载数据
const loadData = async () => {
  try {
    const res = await axios.get('/ai/getPromptList', {
      params: { project: searchProject.value }
    })
    tableData.value = res.data.data || []
  } catch (error) {
    ElMessage.error('数据加载失败')
  }
}

// 打开弹窗
const openDialog = (type, row) => {
  dialogType.value = type
  if (type === 'edit') {
    Object.assign(form, row)
  } else {
    formRef.value?.resetFields()
  }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  await formRef.value.validate()
  
  const api = dialogType.value === 'add' 
    ? '/ai/addPrompt' 
    : '/ai/updatePrompt'
  
  try {
    await axios.post(api, form)
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除操作
const handleDelete = async (row) => {
  try {
    await axios.post('/ai/deletePrompt', { // 假设存在删除接口
      project: row.project,
      code: row.code
    })
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 初始化加载数据
loadData()
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>