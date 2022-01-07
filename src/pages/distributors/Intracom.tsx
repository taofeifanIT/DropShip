import {
  products,
  listing,
  update,
  deleteItem,
  downloadCsv,
  show,
  batchList,
  batchDelete
} from '@/services/distributors/Intracom';
import SupplierFunction from '@/components/AsyncSupplierFunction';
export default () => {
  const config = {
    title: 'Intracom',
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
    isAuth: false,
  };
  return (
    <>
                 
      <SupplierFunction key='IntracomVendor'  {...config} />
              
    </>
  );
};
