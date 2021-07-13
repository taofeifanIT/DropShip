import React, { useRef, useImperativeHandle, useState } from 'react';
import { Modal,Image,Typography, Spin } from 'antd';

type showPopType =  {imageNames: string[],title: string,otherPop?: {key: string,value: string}[]} | undefined

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

const ComparisonFrame = React.forwardRef((props: {
    leftURL: string;
    showPop?: showPopType;
}, ref) => {
  const { title, otherPop } = props.showPop
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const inputRef = useRef();
  const style: React.CSSProperties = {
      width:  `${document.body.clientWidth * 0.95}px`,
      height: `${document.body.clientHeight * 0.85}px`,
      zIndex: 1000000000000000000000000
  }
  const token = localStorage.getItem('token')
  const contain: React.CSSProperties = {
    width:  `50%`,
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'top'
}
  useImperativeHandle(ref, () => ({
    showModal: () => {
    setIsModalVisible(true)
    setLoading(true)
    setTimeout(() => {
        setLoading(false)
    }, 2000)
    }
  }));
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return <Modal bodyStyle={style} width={style.width} title="Data comparison" ref={inputRef} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
   <Spin spinning={loading} tip='Page loading...'> 
   <div style={{...contain, border: '1px solid gray', overflowY: 'scroll', padding: '8px', height:style.height}}>
   <h2><img width={50} src="https://c1.neweggimages.com/WebResource/Themes/Nest/logos/logo_424x210.png" alt="Newegg" />{title}</h2>
   <Image.PreviewGroup>
       {props.showPop?.imageNames.map(image => {
           return (<Image
            width={200}
            src={image}
          />)
       })}
    </Image.PreviewGroup>
    <h3 style={{color: '#C60',fontFamily: 'verdana,arial,helvetica,sans-serif'}}>Detailed parameters</h3>
    <table border="1">
    {Object.keys(otherPop).filter(flKey => filterKey.indexOf(flKey) === -1).map(key => {
        return (<tr>
            <td>{key}</td><td>{<Typography.Text copyable>{otherPop[key]}</Typography.Text>}</td>
        </tr>)
    })}
    </table>
   </div>
   <div style={contain}>
   <iframe frameBorder="1"  height={style.height} width="100%" src={`http://api-multi.itmars.net/export/proxy?url=${props.leftURL}&token=${token}`}  scrolling="yes"></iframe>
   </div>
   </Spin>
</Modal>
});


export default ComparisonFrame