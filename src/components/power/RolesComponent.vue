<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addPowerDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="[index1 === 0 ? '' : 'bdtop', 'vcenter']">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getEditRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEditRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="编辑权限" :visible.sync="powerDialogVisible" width="50%" @close="powerHandleClose">
      <el-tree :data="rightsList" show-checkbox node-key="id" :props="treeProps" default-expand-all :default-checked-keys="defKeys" ref="treeRef"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangePower">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加权限" :visible.sync="addPowerDialogVisible" width="50%" @close="addPowerHandleClose">
      <el-form ref="addRoleListRef" :model="addRoleList" label-width="80px" :rules="addRoleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPowerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editPowerDialogVisible" width="50%" @close="editPowerHandleClose">
      <el-form ref="editRoleListRef" :model="editRoleInfo" label-width="80px" :rules="editRoleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPowerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      // 编辑权限对话框状态
      powerDialogVisible: false,
      // 添加角色对话框状态
      addPowerDialogVisible: false,
      // 修改角色对话框状态
      editPowerDialogVisible: false,
      rightsList: [],
      roleId: '',
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 此用户所拥有的权限数组
      defKeys: [],
      // 添加角色的名称和描述初始化对象
      addRoleList: {
        roleName: '',
        roleDesc: '',
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '长度在 3 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
      editRoleInfo: {},
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '长度在 3 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('请求权限数据失败')
      }
      this.rightsList = res.data
      this.recursionPower(role, this.defKeys)
      this.powerDialogVisible = true
    },
    powerHandleClose() {
      this.defKeys = []
    },
    // 创建一个递归函数，遍历权限树中已有的权限
    recursionPower(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.recursionPower(item, arr)
      })
    },
    async submitChangePower() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('角色授权失败')
      }
      this.powerDialogVisible = false
      this.getRolesList()
    },
    // 删除标签绑定的权限
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色权限失败')
          }
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    addPowerHandleClose() {
      this.$refs.addRoleListRef.resetFields()
    },
    async submitAddRole() {
      const { data: res } = await this.$http.post('roles', {
        roleName: this.addRoleList.roleName,
        roleDesc: this.addRoleList.roleDesc,
      })
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.$message.success('添加角色成功')
      this.getRolesList()
      this.addPowerDialogVisible = false
    },
    editPowerHandleClose() {
      this.$refs.editRoleListRef.resetFields()
    },
    getEditRole(role) {
      console.log(role.id)
      this.editRoleInfo = role
      this.editPowerDialogVisible = true
    },
    deleteEditRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除分类失败!')
          }
          this.$message.success('删除成功!')
          this.getRolesList()
        })
        .catch(() => {
          this.$message.error('已取消删除角色!')
        })
    },
    async setEditRole() {
      const { data: res } = await this.$http.put(`roles/${this.editRoleInfo.id}`, {
        roleName: this.editRoleInfo.roleName,
        roleDesc: this.editRoleInfo.roleDesc,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色信息失败')
      }
      this.$message.success('修改角色信息成功')
      this.getRolesList()
      this.editPowerDialogVisible = false
    },
  },
}
</script>
<style lang="css" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
