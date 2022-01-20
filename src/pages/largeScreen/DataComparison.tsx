import { Row, Col } from 'antd';
import styles from './style.less';
import { enterF11 } from '@/utils/utils';
// import WorldMap from './components/Map'
import DemoPie from './components/Commodities';
import RankingList from './components/RankingList';
import Total from './components/Total';
import DemoColumn from './components/OperationRank';
import DemoLine from './components/HistoryData';
import TagData from './components/TagTable';
import HistoryBuyBox from './components/HistoryBuyBox';
const DataComparison = () => {
  enterF11();
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
              <TagData />
            </div>
          </div>
        </Col>
        <Col span={12} style={{ padding: '0 20px' }}>
          <div className={styles.centerBox}>
            <Total />
          </div>
          <Row>
            <Col span={12} style={{ paddingRight: '5px' }}>
              <div className={styles.tableBox}>
                <DemoLine />
              </div>
            </Col>
            <Col span={12} style={{ paddingLeft: '5px' }}>
              <div className={styles.tableBox}>
                <HistoryBuyBox />
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <div className={styles.box}>
            <div className={styles.circle}>
              <div className={styles.circleTitle} style={{ fontSize: '20px' }}>
                Ranking list
              </div>
              <RankingList />
            </div>
          </div>
          <div className={styles.operation}>
            <div className={styles.post} style={{ padding: 20 }}>
              <DemoColumn />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DataComparison;
