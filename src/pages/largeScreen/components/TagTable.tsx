import styles from '../style.less'
import { tagRanking } from '../../../services/dashboard'
import { Typography, Spin } from 'antd';
import { useState, useEffect } from 'react';
const { Text } = Typography;
import moment from 'moment';

const ParagraphText = (props: { content: string, width: number }) => {
    const ellipsis = true;
    const { content, width } = props
    return (
        <Text
            style={ellipsis ? { width: width, display: "inline" , color: '#fff'} : undefined}
            ellipsis={ellipsis ? { tooltip: content } : false}
        >
            {content}
        </Text>
    )
}

const TagData = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
      const getData = () => {
          setLoading(true)
        tagRanking({page: 0,
            limit: 1000}).then(res => {
            let tempTags = res.data.tags.map((item: any) => {
                return{
                    ...item,
                    matchRate: Math.ceil((item.total_match / item.total_product) * 100) + '%'
                }
            })
            setData(tempTags)
        }).finally(() => {
            setLoading(false)
        })
      }
      useEffect(() => {
        getData()
      }, [])
    return (<>
        <div className={styles.tagTitle}>Tag Info</div>
        <Spin spinning={loading}>
        <div style={{overflow: 'auto', height: '388px'}}>
        <table width="100%">
                        <thead>
                            <tr className={styles.ocd}>
                            <th style={{width: '60px', textAlign: 'center'}}>ID</th>
                            <th>Tag name</th>
                            <th>Total sales</th>
                            <th>Total order</th>
                            <th>Total listing</th>
                            <th>Match Rate</th>
                            <th>Add time</th>
                            </tr>
                        </thead>
                        <tbody>
                           {data.map((item: any,index) => {
                              return  (<tr className={index%2 === 0 ? styles.odd : styles.ocd}>
                                   <th style={{width: '60px', textAlign: 'center'}}>{index + 1}</th>
                                   <th><ParagraphText content={item.tag_name}  width={200}/></th>
                                   <th>{item.total_sales}</th>
                                   <th>{item.total_order}</th>
                                   <th>{item.total_listing}</th>
                                   <th>{item.matchRate}</th>
                                   <th>{moment(parseInt(item.add_time + '000')).format('YYYY-MM-DD HH:mm:ss')}</th>
                               </tr>)
                           })}
                        </tbody>
                    </table>
        </div>
        </Spin>
    </>)
}

export default TagData