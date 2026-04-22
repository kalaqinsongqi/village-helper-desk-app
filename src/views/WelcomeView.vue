<template>
  <div class="welcome-page">
    <el-card class="welcome-card" shadow="hover">
      <div class="welcome-content">
        <el-avatar :size="80" :src="avatarUrl" />
        <h2 class="greeting">👋 欢迎回来，{{ userInfo?.nickname || userInfo?.username || '用户' }}</h2>
        <p class="desc">Village Helper 村务管理助手 - 让村务工作更高效</p>
        <div class="info-row">
          <el-tag type="success" effect="dark" size="large">
            角色: {{ userInfo?.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
          <el-tag type="info" effect="plain" size="large">
            登录时间: {{ loginTime }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <div class="stat-cards">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-icon"><el-icon size="40" color="#409eff"><MapLocation /></el-icon></div>
        <div class="stat-title">土地确权</div>
        <div class="stat-desc">农村土地权属登记管理</div>
        <el-button type="primary" text @click="$router.push('/main/land-rights')">
          进入管理 →
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MapLocation } from '@element-plus/icons-vue'
import { getMe } from '../api/auth.js'

const userInfo = ref(null)
const loginTime = ref('')
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

onMounted(async () => {
  try {
    const res = await getMe()
    userInfo.value = res.data
  } catch {
    // 静默失败
  }
  loginTime.value = new Date().toLocaleString('zh-CN')
})
</script>

<style scoped>
.welcome-page {
  max-width: 900px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.welcome-content {
  text-align: center;
  padding: 20px 0;
}

.greeting {
  font-size: 24px;
  font-weight: 500;
  color: #303133;
  margin: 16px 0 8px;
}

.desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.stat-card {
  border-radius: 12px;
  text-align: center;
  padding: 12px 0;
}

.stat-icon {
  margin-bottom: 12px;
}

.stat-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 6px;
}

.stat-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 16px;
}
</style>
