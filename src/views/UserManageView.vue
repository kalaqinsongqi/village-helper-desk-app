<template>
  <div class="user-manage-page">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名/昵称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入用户名或昵称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button v-if="hasPermission('user:create')" type="success" :icon="Plus" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          border
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="username" label="用户名" min-width="120" align="center" />
          <el-table-column prop="nickname" label="昵称" min-width="120" align="center" />
          <el-table-column prop="role" label="角色" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.role === 'admin'" type="danger" size="small">管理员</el-tag>
              <el-tag v-else type="info" size="small">普通用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success" size="small">启用</el-tag>
              <el-tag v-else type="danger" size="small">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" min-width="160" align="center" />
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="hasPermission('user:update')"
                type="primary"
                link
                size="small"
                :icon="Edit"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="hasPermission('user:update')"
                type="info"
                link
                size="small"
                :icon="Setting"
                @click="handleConfigPerm(row)"
              >
                权限
              </el-button>
              <el-button
                v-if="row.status === 1 && hasPermission('user:delete')"
                type="danger"
                link
                size="small"
                :icon="CircleClose"
                @click="handleDisable(row)"
              >
                禁用
              </el-button>
              <el-button
                v-if="row.status !== 1 && hasPermission('user:delete')"
                type="success"
                link
                size="small"
                :icon="CircleCheck"
                @click="handleEnable(row)"
              >
                启用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="500px"
      :close-on-click-modal="false"
      @closed="closeDialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置弹窗 -->
    <el-dialog
      v-model="permDialogVisible"
      title="配置用户权限"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-skeleton :rows="4" animated v-if="permLoading" />
      <div v-else>
        <el-checkbox-group v-model="selectedPermIds">
          <el-checkbox
            v-for="perm in permList"
            :key="perm.id"
            :label="perm.id"
            border
            style="margin-bottom: 10px; margin-right: 10px"
          >
            {{ perm.name }}（{{ perm.code }}）
          </el-checkbox>
        </el-checkbox-group>
        <el-empty v-if="permList.length === 0" description="暂无权限项" />
      </div>
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, CircleClose, CircleCheck, Setting } from '@element-plus/icons-vue'
import { getUsers, createUser, updateUser, deleteUser, restoreUser } from '../api/user.js'
import { getPermissions, getUserPermissions, updateUserPermissions } from '../api/permission.js'
import { hasPermission } from '../utils/permission.js'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 权限配置弹窗
const permDialogVisible = ref(false)
const permLoading = ref(false)
const permList = ref([])
const selectedPermIds = ref([])
const currentUserId = ref(null)

const searchForm = reactive({ keyword: '' })

const pagination = reactive({ page: 1, page_size: 10, total: 0 })

const form = reactive({
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  role: 'user',
  status: 1,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  try {
    const params = { page: pagination.page, page_size: pagination.page_size }
    if (searchForm.keyword) params.keyword = searchForm.keyword
    const res = await getUsers(params)
    tableData.value = res.data.items || []
    pagination.total = res.data.total || 0
  } catch (err) {
    const msg = err.response?.data?.detail || '加载数据失败'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchForm.keyword = ''
  pagination.page = 1
  loadData()
}

function handlePageChange(page) {
  pagination.page = page
  loadData()
}

function handleSizeChange(size) {
  pagination.page_size = size
  pagination.page = 1
  loadData()
}

function resetForm() {
  form.id = undefined
  form.username = ''
  form.nickname = ''
  form.password = ''
  form.role = 'user'
  form.status = 1
}

function handleAdd() {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  resetForm()
  form.id = row.id
  form.username = row.username
  form.nickname = row.nickname || ''
  form.role = row.role
  form.status = row.status
  dialogVisible.value = true
}

function closeDialog() {
  formRef.value?.resetFields()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  try {
    if (isEdit.value) {
      await updateUser(form.id, {
        nickname: form.nickname,
        role: form.role,
        status: form.status,
      })
      ElMessage.success('修改成功')
    } else {
      await createUser({
        username: form.username,
        nickname: form.nickname,
        password: form.password,
        role: form.role,
        status: form.status,
      })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (err) {
    const msg = err.response?.data?.detail || '操作失败'
    ElMessage.error(msg)
  }
}

function handleDisable(row) {
  ElMessageBox.confirm(`确定要禁用用户 "${row.username}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('已禁用')
      loadData()
    } catch (err) {
      const msg = err.response?.data?.detail || '操作失败'
      ElMessage.error(msg)
    }
  })
}

function handleEnable(row) {
  ElMessageBox.confirm(`确定要启用用户 "${row.username}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await restoreUser(row.id)
      ElMessage.success('已启用')
      loadData()
    } catch (err) {
      const msg = err.response?.data?.detail || '操作失败'
      ElMessage.error(msg)
    }
  })
}

async function handleConfigPerm(row) {
  if (row.role === 'admin') {
    ElMessage.warning('管理员权限不可配置')
    return
  }
  currentUserId.value = row.id
  permDialogVisible.value = true
  permLoading.value = true
  selectedPermIds.value = []
  try {
    const [permRes, userPermRes] = await Promise.all([
      getPermissions(),
      getUserPermissions(row.id),
    ])
    permList.value = permRes.data || []
    selectedPermIds.value = userPermRes.data.permission_ids || []
  } catch (err) {
    const msg = err.response?.data?.detail || '获取权限失败'
    ElMessage.error(msg)
  } finally {
    permLoading.value = false
  }
}

async function savePermissions() {
  if (!currentUserId.value) return
  try {
    await updateUserPermissions(currentUserId.value, selectedPermIds.value)
    ElMessage.success('权限配置已保存')
    permDialogVisible.value = false
  } catch (err) {
    const msg = err.response?.data?.detail || '保存失败'
    ElMessage.error(msg)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-manage-page {
  width: 100%;
  min-width: 0;
}

.search-card {
  margin-bottom: 16px;
}

.table-wrapper {
  width: 100%;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
