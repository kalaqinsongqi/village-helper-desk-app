<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <el-icon size="48" color="#409eff"><House /></el-icon>
        </div>
        <h1 class="title">Village Helper</h1>
        <p class="subtitle">村务管理助手</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, House } from '@element-plus/icons-vue'
import { login } from '../api/auth.js'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await login(form.username, form.password)
    const { access_token, expires_in, permissions, role } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('tokenExpire', String(Date.now() + expires_in * 1000))
    localStorage.setItem('permissions', JSON.stringify(permissions || []))
    localStorage.setItem('role', role || 'user')
    ElMessage.success('登录成功')
    router.push('/main')
  } catch (err) {
    const msg = err.response?.data?.detail || '登录失败，请重试'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 420px;
  padding: 48px 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  width: 100%;
  font-size: 16px;
  letter-spacing: 4px;
  border-radius: 8px;
  height: 44px;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
}
</style>
