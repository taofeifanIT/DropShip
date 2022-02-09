import XLSX from 'xlsx';
//引入xlsx
/**
 * 导入excel的函数
 * @param {*} file
 */
const importsExcel = (file) => {
  //使用promise导入
  return new Promise((resolve, reject) => {
    // 获取上传的文件对象
    const { files } = file.target; //获取里面的所有文件
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      //异步操作  excel文件加载完成以后触发
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        resolve(data); //导出数据
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        reject('失败'); //导出失败
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  });
};
/**
 * 导出excel
 * @param {*} headers
 * @param {*} data
 * @param {*} fileName
 */
const exportExcel = (headers, data, fileName = 'demo.xlsx') => {
  const _headers = headers
      .map((item, i) => Object.assign({}, { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + 1 }))
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title} }), {});
  const _data = data
    .map((item, i) =>
      headers.map((key, j) =>
        Object.assign(
          {},
          { content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) },
        ),
      ),
    )
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, {
          [next.position]: { v: next.content, t: isNaN(next.content) ? 's' : 'n' },
        }),
      {},
    );

  // 合并 headers 和 data
  const output = Object.assign({}, {}, _data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': [
          { wpx: 80 },
          { wpx: 100 },
          { wpx: 110 },
          { wpx: 100 },
          { wpx: 100 },
          { wpx: 50 },
          { wpx: 80 },
          { wpx: 80 },
          { wpx: 80 },
        ],
      }),
    },
  };
  // console.log(output);
  // 导出 Excel
  XLSX.writeFile(wb, fileName);
};

export { importsExcel, exportExcel };
