import {
    products,
    listing,
    update,
    deleteItem,
    downloadCsv,
    show,
    batchList,
    batchDelete
  } from '@/services/distributors/eldorado';
  import SupplierFunction from '@/components/AsyncSupplierFunction';
  
  export default () => {
    const config = {
      title: 'eldorado',
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
      hasDescription: true,
    };
    return (
      <>
                   
        <SupplierFunction key='eldoradoVendor' {...config} />
                
      </>
    );
  };
  