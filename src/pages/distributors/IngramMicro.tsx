import {
  products,
  listing,
  update,
  deleteItem,
  downloadCsv,
  show,
  batchList,
  batchDelete
} from '@/services/distributors/ingramMicro';
import SupplierFunction from '@/components/AsyncSupplierFunction';
export default () => {
  const config = {
    title: 'Ingram Micro',
    api: {
      updateApi: update,
      listingApi: listing,
      deleteApi: deleteItem,
      listApi: products,
      downloadApi: downloadCsv,
      showApi: show,
      batchListApi: batchList,
      batchDelete:batchDelete
    },
    isAuth: true,
  };
  return (
    <>
                 
      <SupplierFunction key='IngramMicroVendor'  {...config} />
              
    </>
  );
};
