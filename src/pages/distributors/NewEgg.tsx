import {
    products,
    listing,
    update,
    deleteItem,
    downloadCsv,
    show,
    batchList,
    batchDelete
  } from '../../services/distributors/newEgg';
  import SupplierFunction from './supplierFunction';

  export default () => {
    const config = {
      title: 'NewEgg',
      api: {
        updateApi: update,
        listingApi: listing,
        deleteApi: deleteItem,
        listApi: products,
        downloadApi: downloadCsv,
        showApi: show,
        batchListApi: batchList,
        batchDelete,
      },
      isAuth: true,
      selfShow: true,
      showPop: {
        imageNames: ['Image1','Image2','Image3','Image4'],
        otherPop: [
          { }
        ]
      }
    };
    return (
        <>
                 
        <SupplierFunction {...config} />
                
      </>
    );
  };
  