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
		<el-form-item label="所属幼儿园：">
			<el-select v-model="searchForm.kindergarten" placeholder="请选择所属幼儿园" clearable @change="selectPark">
				<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="所属班级：">
			<el-select v-model="searchForm.classId" placeholder="请输入所属班级" clearable no-data-text="请先选择所属幼儿园">
				<el-option v-for="item in classList" :value="item.id" :label="item.name"></el-option>
			</el-select>
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
      <el-table-column prop="kindergartenName" label="所属幼儿园"> </el-table-column>
      <el-table-column prop="classGradeName" label="班级"> </el-table-column>
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
      :current-page.sync="searchForm.pageNum"
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
		<el-form-item label="所属幼儿园：">
			<el-select v-model="form.kindergarten" placeholder="请选择所属幼儿园" clearable @change="selectPark">
				<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="所属班级：">
			<el-select v-model="form.classId" placeholder="请输入所属班级" clearable no-data-text="请先选择所属幼儿园">
				<el-option v-for="item in classList" :value="item.id" :label="item.name"></el-option>
			</el-select>
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
  queryByPage,
  append,
  update,
  remove,
} from "@/api/conservator";
import {kindergartenList, classList} from "@/api/select"

export default {
  components: {},
  data() {
    return {
      searchForm: {
        name: "",
        contact: "",
        person: "",
        kindergarten: "",
        classId: "",
        pageNum: 1,
        pageSize: 10,
      },
      //表格数据
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {
        name: "",
        contact: "",
        kindergarten: "",
        classId: "",
      },
      personList: [],
      id: "",
	  kindergartenList:[],
	  classList:[],
    };
  },
  created() {
	  this.getKindergartenList()
  },
  mounted() {
    this.getQueryByPage();
  },
  computed: {},
  methods: {
	  selectPark(e){
		  this.getClassList(e)
		  this.searchForm.classId = ''
		  this.form.classId = ''
		  console.log(e)
	  },
	  //查询幼儿园
	  getKindergartenList(){
	  	kindergartenList().then(res=>{
	  		this.kindergartenList = res.data
	  	})
	  },
	  //查询班级
	   getClassList(kindergartenId,id){
	  	classList({kindergartenId}).then(res=>{
	  		this.classList = res.data
	  	})
	  },
	  //获取班级
	  getClass(){},
    //删除
    deleteDownload(row) {
      this.$confirm("删除后将不可找回，请谨慎操作", "确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(row.id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getQueryByPage();
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
			console.log(this.form,'============')
          // let obj = JSON.parse(JSON.stringify({...this.form, person:JSON.stringify(this.form.person)}));
          let obj = this.form;
          if (this.id) {
            update(obj).then((res) => {
              this.$message.success("修改成功");
              this.dialogFormVisible = false;
              this.getQueryByPage();
              if (res.code === 200) {
              }
            });
          } else {
            append(obj).then((res) => {
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
		  if(key === 'person'){
			  this.form[key] = [];
		  }else{
			this.form[key] = "";
		  }
        
      }
      this.id = "";
      this.dialogFormVisible = true;
    },
    update(row) {
      this.id = row.id;
      this.form = Object.assign(row);
	  this.getClassList(this.form.kindergarten)
      this.dialogFormVisible = true;
    },
    sizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.pageNum = 1;
      this.getQueryByPage();
    },
    currentChange(val) {
      this.searchForm.pageNum = val;
      this.getQueryByPage();
    },
     getQueryByPage() {
       queryByPage(this.searchForm).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
		this.tableData.forEach(item=>{
			if(item.kindergarten){
				this.kindergartenList.forEach(el=>{
					if(item.kindergarten == el.id){
						item.kindergartenName = el.name
					}
				})
			}
			
		})
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
