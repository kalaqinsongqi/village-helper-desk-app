<template>
  <div class="welcome-page">
    <el-card class="welcome-card" shadow="hover">
      <div class="welcome-content">
        <div class="avatar-wrap">
          <el-avatar :size="90" :src="avatarUrl" />
          <div class="online-dot" />
        </div>

        <h2 class="greeting">
          👋 欢迎回来，{{ userInfo?.nickname || userInfo?.username || '用户' }}
        </h2>
        <p class="desc">Village Helper 村务管理助手 - 让村务工作更高效</p>

        <div class="info-row">
          <el-tag type="success" effect="dark" size="large">
            <el-icon><UserFilled /></el-icon>
            角色: {{ userInfo?.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
          <el-tag type="info" effect="plain" size="large">
            <el-icon><Clock /></el-icon>
            登录时间: {{ loginTime }}
          </el-tag>
        </div>

        <el-divider />

        <div class="extra-info">
          <div class="info-item">
            <el-icon size="18" color="#409eff"><Calendar /></el-icon>
            <span>今天是 {{ today }}</span>
          </div>
          <div class="info-item">
            <el-icon size="18" color="#67c23a"><Sunny /></el-icon>
            <span>祝您工作愉快</span>
          </div>
        </div>

        <div class="tip-box">
          <el-icon size="16" color="#e6a23c"><InfoFilled /></el-icon>
          <span>提示：您可以通过左侧菜单进入对应的功能模块</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UserFilled, Clock, Calendar, Sunny, InfoFilled } from '@element-plus/icons-vue'
import { getMe } from '../api/auth.js'

const userInfo = ref(null)
const loginTime = ref('')
const today = ref('')
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

onMounted(async () => {
  try {
    const res = await getMe()
    userInfo.value = res.data
  } catch {
    // 静默失败
  }
  loginTime.value = new Date().toLocaleString('zh-CN')
  const now = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  today.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`
})
</script>

<style scoped>
.welcome-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.welcome-card {
  width: 100%;
  max-width: 560px;
  border-radius: 16px;
}

.welcome-content {
  text-align: center;
  padding: 40px 20px;
}

.avatar-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.online-dot {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 14px;
  height: 14px;
  background: #67c23a;
  border: 2px solid #fff;
  border-radius: 50%;
}

.greeting {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px;
}

.desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.info-row .el-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.extra-info {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 16px 0;
  flex-wrap: wrap;
}

.info-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.tip-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 20px;
  background: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 8px;
  font-size: 13px;
  color: #e6a23c;
}

:deep(.el-divider) {
  margin: 24px 0;
}
</style>
