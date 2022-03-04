import { dynamic } from 'umi';

export default dynamic({
  loader: async function() {
    // webpackChunkName tells webpack create separate bundle for HugeA
    const { default: HistoryChat } = await import(/* webpackChunkName: "external_A" */ './HistoryChat');
    return HistoryChat;
  },
});