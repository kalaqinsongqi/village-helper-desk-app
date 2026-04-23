<template>
  <el-container class="main-layout">
    <el-aside width="220px" class="sidebar" v-if="showSidebar">
      <div class="sidebar-header">
        <el-icon size="28" color="#fff"><House /></el-icon>
        <span class="app-name">Village Helper</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/main">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-menu-item index="/main/land-rights" v-if="hasMenuPermission('/main/land-rights')">
          <el-icon><MapLocation /></el-icon>
          <span>土地确权</span>
        </el-menu-item>

        <el-menu-item index="/main/users" v-if="hasMenuPermission('/main/users')">
          <el-icon><UserFilled /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <div class="user-info">
          <el-avatar :size="32" :icon="UserFilled" />
          <span class="username">{{ userInfo?.nickname || userInfo?.username || 'admin' }}</span>
        </div>
        <el-button
          type="danger"
          link
          size="small"
          :icon="SwitchButton"
          @click="handleLogout"
        >
          退出
        </el-button>
      </div>
    </el-aside>

    <el-container>
      <el-header class="topbar">
        <span class="page-title">{{ pageTitle }}</span>
        <div v-if="!showSidebar" class="topbar-right">
          <span class="topbar-username">{{ userInfo?.nickname || userInfo?.username || 'admin' }}</span>
          <el-button
            type="danger"
            link
            size="small"
            :icon="SwitchButton"
            @click="handleLogout"
          >
            退出
          </el-button>
        </div>
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { House, HomeFilled, MapLocation, UserFilled, SwitchButton } from '@element-plus/icons-vue'
import { getMe } from '../api/auth.js'
import { hasMenuPermission, hasAnyVisibleMenu } from '../utils/permission.js'

const route = useRoute()
const router = useRouter()
const userInfo = ref(null)

const showSidebar = computed(() => hasAnyVisibleMenu())

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/main': '欢迎回来',
    '/main/land-rights': '土地确权管理',
    '/main/users': '用户管理',
  }
  return titles[route.path] || ''
})

onMounted(async () => {
  try {
    const res = await getMe()
    userInfo.value = res.data
  } catch {
    ElMessage.error('获取用户信息失败')
  }
})

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpire')
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}
</script>

<style scoped>
.main-layout {
  width: 100%;
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #1f2d3d;
}

.app-name {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid #1f2d3d;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  color: #bfcbd9;
  font-size: 14px;
}

.topbar {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.topbar-username {
  font-size: 14px;
  color: #606266;
}

.content {
  background: #f5f7fa;
  padding: 20px;
}
</style>
