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
  import SupplierFunction from '@/components/AsyncSupplierFunction';

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
      selfShow: true,
      showPop: {
        imageNames: ['Image1','Image2','Image3','Image4','Image5'],
        otherPop: [
          { }
        ]
      }
    };
    return (
        <>
                 
        <SupplierFunction key='NewEggVendor' {...config} />
                
      </>
    );
  };
  