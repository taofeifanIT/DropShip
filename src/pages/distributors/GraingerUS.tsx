import {
  products,
  listing,
  update,
  deleteItem,
  downloadCsv,
  show,
} from '../../services/distributors/graingerUS';
import SupplierFunction from './supplierFunction';
export default () => {
  const config = {
    title: 'Grainger',
    api: {
      updateApi: update,
      listingApi: listing,
      deleteApi: deleteItem,
      listApi: products,
      downloadApi: downloadCsv,
      showApi: show,
    },
    isAuth: false,
  };
  return (
    <>
                 
      <SupplierFunction {...config} />
              
    </>
  );
};
