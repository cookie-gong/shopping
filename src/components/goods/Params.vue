<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三方分类设置相关参数！" type="warning" show-icon :closable="false"> </el-alert>
      <el-row class="cascaderForm">
        <el-form ref="goodsFormRef" label-width="120px">
          <el-form-item label="选择商品分类：">
            <el-cascader
              v-model="selectKeys"
              :options="goodsList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
              }"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable" @click="showAddDialog">添加参数</el-button>
          <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="tagDelete(i, scope.row)">
                  {{ item }}
                </el-tag>
                <el-input
                  class="addPrimaryInput"
                  type="text"
                  size="small"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  ref="saveTagInput"
                />
                <el-button size="small" v-else @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteInfo(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisable" @click="showAddDialog">添加属性</el-button>
          <el-table border stripe :data="onlyTableDate">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="tagDelete(i, scope.row)">
                  {{ item }}
                </el-tag>
                <el-input
                  class="addPrimaryInput"
                  type="text"
                  size="small"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  ref="saveTagInput"
                />
                <el-button size="small" v-else @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteInfo(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDiaLogVisible" width="50%" @close="addHandleClose">
      <el-form ref="addFormRef" label-width="100px" :rules="addFormRule" :model="addForm">
        <el-form-item :label="titleText" prop="descName">
          <el-input v-model="addForm.descName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDiaLogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDiaLogVisible" width="50%" @close="editHandleClose">
      <el-form ref="editFormRef" label-width="100px" :rules="editFormRule" :model="editForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDiaLogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectKeys: [],
      goodsList: [],
      activeName: 'many',
      manyTableDate: [],
      onlyTableDate: [],
      addDiaLogVisible: false,
      addForm: {
        descName: '',
      },
      addFormRule: {
        descName: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
      editDiaLogVisible: false,
      editForm: {},
      editFormRule: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类数据获取失败')
      }
      this.goodsList = res.data
    },
    async handleChange() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeName == 'many') {
        this.manyTableDate = res.data
      } else {
        this.onlyTableDate = res.data
      }
    },
    handleClick() {
      this.handleChange()
    },
    // 删除商品参数
    tagDelete(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(','),
      })
      if (res.meta.status !== 200) {
        return this.$message.error('提交参数失败')
      }
      this.$message.success('修改参数项成功')
    },
    // 显示添加参数输入框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 表单失去焦点或者键盘键入enter键
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 监听添加参数对话框关闭
    addHandleClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改参数对话框关闭
    editHandleClose() {
      this.$refs.editFormRef.resetFields()
    },
    showAddDialog() {
      this.addDiaLogVisible = true
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        attr_sel: this.activeName,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editDiaLogVisible = true
    },
    submitAddInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.descName,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDiaLogVisible = false
        this.handleChange()
      })
    },
    submitEditInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑参数失败')
        }
        this.$message.success('编辑参数成功')
        this.editDiaLogVisible = false
        this.handleChange()
      })
    },
    // 删除参数弹出框
    deleteInfo(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
          if (res.meta.status !== 200) {
            return
          }
          this.handleChange()
          this.$message.success('删除参数成功!')
        })
        .catch(() => {
          this.$message.error('删除参数失败!')
        })
    },
  },
  computed: {
    isBtnDisable() {
      if (this.selectKeys.length != 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      } else {
        return null
      }
    },
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>
<style lang="css" scoped>
.cascaderForm {
  margin: 20px 0;
}
.el-tag {
  margin: 10px;
}
.addPrimaryInput {
  width: 120px;
}
</style>