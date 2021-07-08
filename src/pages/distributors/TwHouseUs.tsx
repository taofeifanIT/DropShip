import {
  products,
  listing,
  update,
  deleteItem,
  downloadCsv,
  show,
  batchList,
  batchDelete
} from '../../services/distributors/twHouseUs';
import SupplierFunction from './supplierFunction';
export default () => {
  const config = {
    title: 'Twhouse',
    api: {
      updateApi: update,
      listingApi: listing,
      deleteApi: deleteItem,
      listApi: products,
      downloadApi: downloadCsv,
      showApi: show,
      batchListApi: batchList,
      batchDelete
    },
    isAuth: false,
  };
  return (
    <>
                 
      <SupplierFunction {...config} />
              
    </>
  );
};
