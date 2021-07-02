import {
  products,
  listing,
  update,
  deleteItem,
  downloadCsv,
  show,
  batchList,
  batchDelete
} from '../../services/distributors/petra';
import SupplierFunction from './supplierFunction';
export default () => {
  const config = {
    title: 'Petra',
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
                 
      <SupplierFunction {...config} />
              
    </>
  );
};
