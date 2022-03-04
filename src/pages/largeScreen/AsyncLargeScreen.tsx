import { dynamic } from 'umi';

export default dynamic({
  loader: async function() {
    // webpackChunkName tells webpack create separate bundle for HugeA
    const { default: DataComparison } = await import(/* webpackChunkName: "DataComparison" */ './DataComparison');
    return DataComparison;
  },
});