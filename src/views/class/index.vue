<template>
  <div class="downloadCenter">
    <div class="search">
      <el-form :model="searchForm" :inline="true">
		  <el-form-item label="班级名称：">
		  	<el-input v-model="searchForm.name" placeholder="请输入班级名称"></el-input>
		  </el-form-item>
        <el-form-item label="所属幼儿园：">
        	<el-select v-model="searchForm.kindergartenId" placeholder="请选择所属幼儿园" clearable>
        		<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
        	</el-select>
        </el-form-item>
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
      <el-table-column prop="name" label="年级名"> </el-table-column>
      <el-table-column prop="kindergartenName" label="归属幼儿园"> </el-table-column>
      <el-table-column prop="memberNum" label="会员"> </el-table-column>
      <el-table-column prop="studentNum" label="学生"> </el-table-column>
      <el-table-column prop="borrowNum" label="借阅"> </el-table-column>
      <el-table-column prop="creatTime" label="创建时间"> </el-table-column>
<!--      <el-table-column prop="classGrade" label="班级"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column> -->
      <!-- <el-table-column prop="person" label="管理的人员">
        <template slot-scope="{row}">
          <span v-for="item in row.person" :key="item.id">{{item.name}}；</span>
        </template>
      </el-table-column> -->
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
        <el-form-item label="班级名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名称"></el-input>
        </el-form-item>
		<el-form-item label="所属幼儿园：">
			<el-select v-model="form.kindergartenId" placeholder="请选择所属幼儿园" clearable>
				<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
			</el-select>
		</el-form-item>
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
} from "@/api/class";
import {kindergartenList} from "@/api/select"

export default {
  components: {},
  data() {
    return {
      searchForm: {
        name: "",
        kindergartenId: "",
        pageNum: 1,
        pageSize: 10,
      },
      //表格数据
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {
        name: "",
        kindergartenId: "",
      },
      id: "",
	  kindergartenList:[],
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
	  //查询幼儿园
	  getKindergartenList(){
	  	kindergartenList().then(res=>{
	  		this.kindergartenList = res.data
	  		console.log(res,'======')
	  	})
	  },
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
    //提交
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
		this.tableData.forEach(item=>{
			if(item.kindergartenId){
				this.kindergartenList.forEach(el=>{
					if(item.kindergartenId == el.id){
						item.kindergartenName = el.name
					}
				})
			}
		})
        // this.tableData.forEach(item=>{
        //   item.person = JSON.parse(item.person)
        //   console.log(item.person)
        // })
        this.total = res.data.total;
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
