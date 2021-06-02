import {
  products,
  listing,
  update,
  deleteItem,
  downloadCsv,
  show,
} from '../../services/distributors/ingramMicro';
import SupplierFunction from './supplierFunction';
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
    },
    isAuth: true,
  };
  return (
    <>
                 
      <SupplierFunction {...config} />
              
    </>
  );
};
