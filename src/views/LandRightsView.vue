<template>
  <div class="land-rights-page">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="承包方姓名">
          <el-input
            v-model="searchForm.contractor_name"
            placeholder="请输入承包方姓名"
            clearable
            style="width: 170px"
          />
        </el-form-item>

        <el-form-item label="合同号">
          <el-input
            v-model="searchForm.contract_code"
            placeholder="请输入合同号"
            clearable
            style="width: 190px"
          />
        </el-form-item>

        <el-form-item label="是否签字确认">
          <el-select
            v-model="searchForm.signature_confirmed"
            placeholder="全部"
            clearable
            style="width: 130px"
          >
            <el-option label="全部" value="" />
            <el-option label="已签字" :value="true" />
            <el-option label="未签字" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="承包地块数">
          <el-input-number
            v-model="searchForm.total_plots"
            :min="0"
            :max="1000"
            :step="1"
            controls-position="right"
            placeholder="输入地块数"
            style="width: 130px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
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

          <el-table-column prop="contract_code" label="合同号" min-width="160" align="center" show-overflow-tooltip />

          <el-table-column prop="contractor_name" label="承包方姓名" width="100" align="center" />

          <el-table-column prop="contract_total_area_1994" label="94年承包合同总面积" min-width="145" align="center" />

          <el-table-column prop="total_plots" label="承包地块数" width="95" align="center" />

          <el-table-column prop="confirmed_total_area" label="确权面积" min-width="100" align="center" />

          <el-table-column prop="signature_confirmed" label="是否签字" width="85" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.signature_confirmed" type="success" size="small">已签字</el-tag>
              <el-tag v-else type="info" size="small">未签字</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="140" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-btns">
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="View"
                  @click="handleDetail(row)"
                >
                  详情
                </el-button>
                <el-button
                  type="warning"
                  link
                  size="small"
                  :icon="Edit"
                  @click="handleEdit(row)"
                >
                  编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
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

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="土地承包详情"
      width="900px"
      :close-on-click-modal="false"
      class="detail-dialog"
      @closed="closeDetail"
    >
      <el-skeleton :rows="6" animated v-if="detailLoading" />

      <div v-else-if="detailData">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同号">
            {{ detailData.contract_code }}
          </el-descriptions-item>
          <el-descriptions-item label="承包方姓名">
            {{ detailData.contractor_name }}
          </el-descriptions-item>
          <el-descriptions-item label="94年承包合同总面积">
            {{ detailData.contract_total_area_1994 }}
          </el-descriptions-item>
          <el-descriptions-item label="承包地块数">
            {{ detailData.total_plots }}
          </el-descriptions-item>
          <el-descriptions-item label="确权面积">
            {{ detailData.confirmed_total_area }}
          </el-descriptions-item>
          <el-descriptions-item label="是否签字">
            <el-tag v-if="detailData.signature_confirmed" type="success" size="small">已签字</el-tag>
            <el-tag v-else type="info" size="small">未签字</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="变动面积" :span="2">
            {{ detailData.changed_area || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ detailData.remarks || '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 地块信息 -->
        <div class="plots-section">
          <div class="plots-title">
            地块信息
            <span
              v-if="detailData.total_plots !== (detailData.plots || []).length"
              class="plots-warning"
            >
              实际承包地块数与地块信息不匹配
            </span>
          </div>
          <el-table
            :data="detailData.plots || []"
            stripe
            border
            size="small"
            style="width: 100%"
            empty-text="暂无地块信息"
          >
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="plot_name" label="地块名称" min-width="100" align="center" />
            <el-table-column prop="plot_code" label="地块代码" width="90" align="center" />
            <el-table-column prop="contract_area_1994" label="94年面积" width="100" align="center" />
            <el-table-column prop="confirmed_area" label="确权面积" width="100" align="center" />
            <el-table-column label="四至" min-width="200" align="center">
              <template #default="{ row }">
                <span v-if="row.boundary_east || row.boundary_south || row.boundary_west || row.boundary_north">
                  东：{{ row.boundary_east || '-' }}；
                  南：{{ row.boundary_south || '-' }}；
                  西：{{ row.boundary_west || '-' }}；
                  北：{{ row.boundary_north || '-' }}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>


      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="editVisible"
      title="编辑土地承包信息"
      width="900px"
      :close-on-click-modal="false"
      class="detail-dialog"
      @closed="closeEdit"
    >
      <el-skeleton :rows="6" animated v-if="editLoading" />

      <div v-else-if="editData">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同号">
            <el-input v-model="editData.contract_code" />
          </el-descriptions-item>
          <el-descriptions-item label="承包方姓名">
            <el-input v-model="editData.contractor_name" />
          </el-descriptions-item>
          <el-descriptions-item label="94年承包合同总面积">
            <el-input v-model="editData.contract_total_area_1994" />
          </el-descriptions-item>
          <el-descriptions-item label="承包地块数">
            <el-input v-model="editData.total_plots" />
          </el-descriptions-item>
          <el-descriptions-item label="确权面积">
            <el-input v-model="editData.confirmed_total_area" />
          </el-descriptions-item>
          <el-descriptions-item label="是否签字">
            <el-select v-model="editData.signature_confirmed" style="width: 100%">
              <el-option label="已签字" :value="true" />
              <el-option label="未签字" :value="false" />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="变动面积" :span="2">
            <el-input v-model="editData.changed_area" placeholder="请输入变动面积" style="width: 200px" />
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            <el-input v-model="editData.remarks" type="textarea" :rows="2" placeholder="请输入备注" resize="none" style="width: 100%" />
          </el-descriptions-item>
        </el-descriptions>

        <!-- 地块信息 -->
        <div class="plots-section">
          <div class="plots-title">
            地块信息
            <span
              v-if="editData.total_plots !== (editData.plots || []).length"
              class="plots-warning"
            >
              实际承包地块数与地块信息不匹配
            </span>
          </div>
          <el-table
            :data="editData.plots || []"
            stripe
            border
            size="small"
            style="width: 100%"
            empty-text="暂无地块信息"
          >
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="plot_name" label="地块名称" min-width="100" align="center" />
            <el-table-column prop="plot_code" label="地块代码" width="90" align="center" />
            <el-table-column prop="contract_area_1994" label="94年面积" width="100" align="center" />
            <el-table-column prop="confirmed_area" label="确权面积" width="100" align="center" />
            <el-table-column label="四至" min-width="200" align="center">
              <template #default="{ row }">
                <span v-if="row.boundary_east || row.boundary_south || row.boundary_west || row.boundary_north">
                  东：{{ row.boundary_east || '-' }}；
                  南：{{ row.boundary_south || '-' }}；
                  西：{{ row.boundary_west || '-' }}；
                  北：{{ row.boundary_north || '-' }}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, View, Edit } from '@element-plus/icons-vue'
import { getContracts, getContractDetail, updateContract } from '../api/land.js'

const loading = ref(false)
const tableData = ref([])

// 详情弹窗
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref(null)

// 编辑弹窗
const editVisible = ref(false)
const editLoading = ref(false)
const editData = ref(null)

const searchForm = reactive({
  contractor_name: '',
  contract_code: '',
  signature_confirmed: '',
  total_plots: undefined,
})

const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0,
})

async function loadData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.page_size,
    }
    if (searchForm.contractor_name) params.contractor_name = searchForm.contractor_name
    if (searchForm.contract_code) params.contract_code = searchForm.contract_code
    if (searchForm.signature_confirmed !== '') params.signature_confirmed = searchForm.signature_confirmed
    if (searchForm.total_plots !== undefined && searchForm.total_plots !== null) {
      params.total_plots_min = searchForm.total_plots
      params.total_plots_max = searchForm.total_plots
    }

    const res = await getContracts(params)
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
  searchForm.contractor_name = ''
  searchForm.contract_code = ''
  searchForm.signature_confirmed = ''
  searchForm.total_plots = undefined
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

async function handleDetail(row) {
  detailVisible.value = true
  detailLoading.value = true
  try {
    const res = await getContractDetail(row.id)
    detailData.value = res.data
  } catch (err) {
    const msg = err.response?.data?.detail || '获取详情失败'
    ElMessage.error(msg)
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailVisible.value = false
  detailData.value = null
}

async function handleEdit(row) {
  editVisible.value = true
  editLoading.value = true
  try {
    const res = await getContractDetail(row.id)
    editData.value = JSON.parse(JSON.stringify(res.data))
  } catch (err) {
    const msg = err.response?.data?.detail || '获取详情失败'
    ElMessage.error(msg)
  } finally {
    editLoading.value = false
  }
}

function closeEdit() {
  editVisible.value = false
  editData.value = null
}

async function saveEdit() {
  if (!editData.value) return
  try {
    await updateContract(editData.value.id, {
      contract_code: editData.value.contract_code,
      contractor_name: editData.value.contractor_name,
      contract_total_area_1994: editData.value.contract_total_area_1994,
      confirmed_total_area: editData.value.confirmed_total_area,
      total_plots: editData.value.total_plots,
      changed_area: editData.value.changed_area,
      remarks: editData.value.remarks,
      signature_confirmed: editData.value.signature_confirmed,
    })
    ElMessage.success('保存成功')
    editVisible.value = false
    loadData()
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
.land-rights-page {
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

.plots-section {
  margin-top: 20px;
}

.plots-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.plots-warning {
  font-size: 12px;
  font-weight: normal;
  color: #f56c6c;
}

.action-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}



/* 弹窗美化 */
.detail-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

/* 编辑弹窗 input 稳定：防止 hover/focus 尺寸抖动 */
.detail-dialog :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  transition: none !important;
}

.detail-dialog :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.detail-dialog :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset !important;
}

.detail-dialog :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  transition: none !important;
}

.detail-dialog :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.detail-dialog :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset !important;
}

.detail-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #e4e7ed;
  margin-right: 0;
}

.detail-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.detail-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #e4e7ed;
}
</style>
