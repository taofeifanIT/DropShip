import React, { useEffect, useState } from 'react'
import {Typography, List } from 'antd';
const { Text } = Typography;
import { saleRanking } from '../../../services/dashboard'

const ParagraphText = (props: { content: string, width: number }) => {
    const [ellipsis] = React.useState(true);
    const { content, width } = props
    return (
        <Text
            style={ellipsis ? { width: width, display: "inline", color: '#d6d6da' } : undefined}
            ellipsis={ellipsis ? { tooltip: content } : false}
        >
            {content}
        </Text>
    )
}
const RankingList = () => {
    const [data ,setData] = useState<{
        ts_sku: string;
        Title: string;
        total: string;
    }[]>([])
    const [loading, setLoading] = useState(false)
    const init = () => {
        setLoading(true)
        saleRanking().then(res => {
            setData(res.data.ts_sku_ranking)
        }).finally(() => {
            setLoading(false)
        })
    }
    const orderStyle:React.CSSProperties= {
        backgroundColor: '#314659',
        color: '#fff',
        borderRadius: '20px',
        width: '20px',
        height: '20px',
        display: 'inline-block',
        textAlign: 'center',
        marginRight: '10px'
    }
    const witchNoeStyle:React.CSSProperties = {
        borderRadius: '20px',
        width: '20px',
        height: '20px',
        color: '#fff',
        display: 'inline-block',
        textAlign: 'center',
        marginRight: '10px'
    }
    useEffect(() => {
        init()
    }, [])
    setInterval(() => {
        init()
      }, 1000 * 60 * 60 * 5)
    return (<>
        <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            size="small"
            style={{ overflow: 'auto', height: '85%', margin: '10px' }}
            renderItem={(item, index) => (
                <List.Item
                    actions={[<Text type='secondary' key={item.ts_sku}>{item.total}</Text>]}
                >
                   <div>
                   {index < 3 ? (<div style={orderStyle}>{index + 1}</div>) : (<div style={witchNoeStyle}>{index + 1}</div>)}
                    <ParagraphText content={item.Title} width={300} />
                   </div>
                </List.Item>
            )}
        />
    </>)
}

export default RankingList