<template>
  <div class="downloadCenter">
    <div class="search">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="教师姓名：">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入教师姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input
            v-model="searchForm.contact"
            placeholder="请输入联系电话："
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="管理下的人员：">
          <el-select v-model="searchForm.person" filterable>
            <el-option
              v-for="(item, index) in personList"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="send">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      :header-cell-style="{
        background: '#FAFAFA',
        borderBottom: '1px solid #fff',
      }"
      highlight-current-row
    >
      <el-table-column prop="name" label="教师姓名"> </el-table-column>
      <el-table-column prop="contact" label="联系电话"> </el-table-column>
      <el-table-column prop="person" label="管理的人员">
        <template slot-scope="{row}">
          <span v-for="item in row.person" :key="item.id">{{item.name}};</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{ row }">
          <span class="handle" @click="update(row)">修改</span>
          <span class="handle" @click="deleteDownload(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :current-page.sync="searchForm.pageNumber"
      :page-size="searchForm.pageSize"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
    </el-pagination>

    <el-dialog
      title="操作"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" ref="form">
        <el-form-item label="教师姓名：" prop="name">
          <el-input v-model="form.name" placeholder="请输入教师姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="contact">
          <el-input
            v-model="form.contact"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="管理下的人员：">
          <el-select v-model="form.person" filterable>
            <el-option
              v-for="(item, index) in personList"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="年龄：" prop="recipient">
          <el-input
            v-model="form.recipient"
            placeholder="请输入年龄"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="recipient">
           <el-radio v-model="form.recipient" label="1">男</el-radio>
          <el-radio v-model="form.recipient" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="出生日期：" prop="ccPerson">
          <el-date-picker
            v-model="form.ccPerson"
            type="date"
            placeholder="选择出生日期：">
          </el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendMailAndSms">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteDownload } from "@/api/sysDownLoadLog";
import {
  ConservatorList,
  ConservatorInsert,
  updateConservator,
  deleteConservator,
} from "@/api/person";

export default {
  components: {},
  data() {
    return {
      searchForm: {
        name: "",
        contact: "",
        person: "",
        pageNumber: 1,
        pageSize: 10,
      },
      //表格数据
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {
        name: "",
        contact: "",
        person: "",
      },
      personList: [],
      // validator
      rules: {
        recipient: [
          {
            required: true,
            type: "email",
            message: "请输正确的邮箱格式",
            trigger: "blur",
          },
        ],
      },
      id: "",
    };
  },
  created() {},
  mounted() {
    this.getQueryByPage();
  },
  computed: {},
  methods: {
    //删除
    deleteDownload(row) {
      this.$confirm("删除后将不可找回，请谨慎操作", "确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteConservator({id:row.id}).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getQueryByPage();
            if (res.code === 200) {
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //、
    sendMailAndSms() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify({...this.form, person:JSON.stringify(this.form.person)}));
          if (this.id) {
            updateConservator(obj).then((res) => {
              this.$message.success("修改成功");
              this.dialogFormVisible = false;
              this.getQueryByPage();
              if (res.code === 200) {
              }
            });
          } else {
            ConservatorInsert(obj).then((res) => {
              this.$message.success("添加成功");
              this.dialogFormVisible = false;
              this.getQueryByPage();
              if (res.code === 200) {
              }
            });
          }
        }
      });
    },
    send() {
      for (let key in this.form) {
        this.form[key] = "";
      }
      this.id = "";
      this.dialogFormVisible = true;
    },
    update(row) {
      this.id = row.id;
      this.form = Object.assign(row);
      this.dialogFormVisible = true;
    },
    sizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.pageNumber = 1;
      this.getQueryByPage();
    },
    currentChange(val) {
      this.searchForm.pageNumber = val;
      this.getQueryByPage();
    },
    getQueryByPage() {
      ConservatorList(this.searchForm).then((res) => {
        this.tableData = res.ConserList.list;
        this.tableData.forEach(item=>{
          item.person = JSON.parse(item.person)
        })
        console.log(this.tableData,'=======')
        this.total = res.ConserList.total;
        if (res.code === 200) {
        }
      });
    },
    onSubmit() {
      this.getQueryByPage();
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.downloadCenter {
  padding: 24px 24px;
  background: #fff;

  .el-pagination {
    text-align: right;
    margin-top: 28px;
    // padding-bottom: 28px;
  }
  .el-link {
    padding-right: 12px;
    text-decoration: none;
  }
  .handle {
    padding-right: 10px;
    cursor: pointer;
    color: #409eff;
  }
}
</style>
