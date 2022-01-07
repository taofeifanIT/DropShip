import React, {useState,useEffect} from 'react';
import { products } from '@/services/distributors/newEgg'
import { Image,Typography, Spin, message } from 'antd';

// type showPopType =  {imageNames: string[],title: string,otherPop?: {key: string,value: string}[]} | undefined
import { getQueryVariable } from '@/utils/utils';


const filterKey: string[] = [
    'id',
    'availability',
    'msrp_price',
    'latest_scrap_date',
    'add_time',
    'update_at',
    'tag_id',
    'status',
    'is_delete',
    'country_id',
    'vendor_id',
    'batch_id',
    'price_and_quantity_change_time',
    'match_amazon',
    'match_ebay',
    'match_newegg',
    'match_walmart',
    'notes',
    'subcategory',
    'measureUnit',
    'GroupName',
    'USAQty',	
    'CurrencyCode',
    'LimitQuantity',
    'RestrictedItemMark',
    'MAP',
    'RefurbishFlag',
    'PromotionFlag',
    'VDLevel0Qty',
    'VDLevel0Price',
    'VDLevel1Qty',
    'VDLevel1Price',
    'VDLevel2Qty',
    'VDLevel2Price',
    'product_url',
    'listing_stores'
] 

const EbayProductInfo = () => {
  (document.querySelector("#root > div > section > div > header") as any).style.display = 'none'
  const [loading, setLoading] = useState(false)
  const [item, setItem] =  useState<any>({})
  const style: React.CSSProperties = {
      width:  `${document.body.clientWidth * 0.95}px`,
      height: `${document.body.clientHeight * 0.85}px`,
      zIndex: 1000000000000000000000000
  }
  const contain: React.CSSProperties = {
    width:  `100%`,
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'top'
  }
  const init = () => {
      setLoading(true)
      let vendor_sku = getQueryVariable('vendor_sku')
      products({vendor_sku: vendor_sku}).then(res => {
        if(res.code){
            let tempItem = res.data.list[0]
            setItem(tempItem)
        } else {
            throw res.msg
        }
      }).catch(e => {
        message.error(e)
      }).finally(() => {
          setLoading(false)
      })
  }
  useEffect(() => {
    init()
  }, [])
  return <div>
   <Spin spinning={loading} tip='Page loading...'> 
   <div style={{...contain, overflowY: 'scroll', padding: '8px', height:style.height}}>
   <h2><img width={50} src="https://c1.neweggimages.com/WebResource/Themes/Nest/logos/logo_424x210.png" alt="Newegg" />{item.title}</h2>
   <Image.PreviewGroup>
       {['Image1','Image2','Image3','Image4','Image5'].map(image => {
           return (<Image
           key={image}
            width={165}
            src={item[image]}
          />)
       })}
    </Image.PreviewGroup>
    <h3 style={{color: '#C60',fontFamily: 'verdana,arial,helvetica,sans-serif'}}>Detailed parameters</h3>
    <table  border='1' width='100%'>
    {Object.keys(item).filter(flKey => filterKey.indexOf(flKey) === -1).map(key => {
        return (<tr key={key}>
            <td>{key}</td><td>{<Typography.Text copyable>{item[key]}</Typography.Text>}</td>
        </tr>)
    })}
    </table>
   </div>
   </Spin>
</div>
};


export default EbayProductInfo