#项目结构

--jkyy-evalution  B端评测项目
    |-- h5-config 项目环境配置文件
    |-- | -- open 对外
    |-- | -- prod 生产环境
    |-- | -- test 测试环境

    |-- src 源码目录
    |-- |-- css  样式表
    |-- |-- data 数据
    |-- |-- images 图片资源
    |-- |-- js js文件
    |-- |-- sass  sass样式源文件
    |-- |-- views  页面试图
    |-- |-- index.html 入口
    |-- node-modules  依赖包
    |-- package.json  项目包管理
    |-- gulpfile.js  项目构建文件
    |-- read.MD 项目说明文件


>开发者 
1. svn或git更新项目
2. npm install 安装依赖
3. 本地开发服务 gulp dev 或者  npm run dev
4. 重新测评的时候reType字段为1 (必传)，其他或不传均为走正常逻辑，仅限减约快应用项目使用，不暴露B端【2019年4月17日修订】

>运维端部署
1. 通过npm或者yack安装依赖，npm install
2. 项目根目录h5-config为项目环境配置文件，将不同的环境配置文件替换到src/js目录下
3. 执行 npm run build 或者 gulp build（如果提示错误，可全局安转gulp即 npm install gulp -g)
4. 将生产的代码包，需输出一份对外（open）到项目jkyy-ego/output

>项目运行地址
项目运行地址（evaluationCode为评测编码）
本地：localhost:8080/evaluting/index.html?evaluationCode=GXYPC
测试环境：https://jkyy-ai-ego.cs.jiankangyouyi.com/evaluting/index.html?evaluationCode=GXYPC