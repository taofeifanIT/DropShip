import { Row, Col } from 'antd';
import styles from './style.less'
import WorldMap from './components/Map'
import DemoPie from './components/Commodities'
import RankingList from './components/RankingList'
import Total from './components/Total'
import DemoColumn from './components/OperationRank'
import DemoLine from './components/HistoryData'
import TagData from './components/TagTable'
const DataComparison = () => {
    return (
        <div className={styles.bg}>
            <h3 className={styles.title}>Drop Ship Multi</h3>
            <Row>
                <Col span={6}>
                    <div className={styles.box}>
                        <div className={styles.circle}>
                         <div className={styles.circleTitle}>Proportion of marketplace</div>
                         <DemoPie />
                        </div>
                    </div>
                    <div className={styles.operation}>
                        <div className={styles.post}>
                            <DemoColumn />
                        </div>        
                    </div>
                </Col>
                <Col span={12} style={{padding: '0 20px'}}>
                    <div className={styles.centerBox}>
                        <WorldMap/>
                        <Total />
                    </div>
                    <div className={styles.tableBox}>
                        <TagData />
                    </div>
                </Col>
                <Col span={6}>
                <div className={styles.box}>
                        <div className={styles.circle}>
                            <div className={styles.circleTitle} style={{fontSize:'20px'}}>Ranking list</div>
                            <RankingList />
                        </div>
                    </div>
                    <div className={styles.operation}>
                        <div className={styles.post}>
                            <DemoLine />
                        </div>        
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DataComparison;
