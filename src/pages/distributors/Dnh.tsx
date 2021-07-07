import {
    products,
    listing,
    update,
    deleteItem,
    downloadCsv,
    show,
    batchList,
    batchDelete
  } from '../../services/distributors/dnh';
  import SupplierFunction from './supplierFunction';
  export default () => {
    const config = {
      title: 'D&H',
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
  