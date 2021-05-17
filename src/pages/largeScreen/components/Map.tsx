
import { Scene, PointLayer } from "@antv/l7";
import { Mapbox, GaodeMap } from "@antv/l7-maps";
import {countryRanking} from '../../../services/dashboard'
import {
  LineLayer,
  MapboxScene,
  Marker,
  PointLayer as PointLayerTemp,
  PolygonLayer,
  Popup,
} from '@antv/l7-react';
import React from 'react'

function joinData(geodata: any, ncovData: any) {
  const ncovDataObj: any = {};
  ncovData.forEach((item: any) => {
    const {
      countryName,
      countryEnglishName,
      currentConfirmedCount,
      confirmedCount,
      suspectedCount,
      curedCount,
      deadCount,
    } = item;
    if (countryName === '中国') {
      if (!ncovDataObj[countryName]) {
        ncovDataObj[countryName] = {
          countryName: 0,
          countryEnglishName,
          currentConfirmedCount: 0,
          confirmedCount: 0,
          suspectedCount: 0,
          curedCount: 0,
          deadCount: 0,
        };
      } else {
        ncovDataObj[countryName].currentConfirmedCount += currentConfirmedCount;
        ncovDataObj[countryName].confirmedCount += confirmedCount;
        ncovDataObj[countryName].suspectedCount += suspectedCount;
        ncovDataObj[countryName].curedCount += curedCount;
        ncovDataObj[countryName].deadCount += deadCount;
      }
    } else {
      ncovDataObj[countryName] = {
        countryName,
        countryEnglishName,
        currentConfirmedCount,
        confirmedCount,
        suspectedCount,
        curedCount,
        deadCount,
      };
    }
  });
  const geoObj: any = {};
  geodata.features.forEach((feature: any) => {
    const { name } = feature.properties;
    geoObj[name] = feature.properties;
    const ncov = ncovDataObj[name] || {};
    feature.properties = {
      ...feature.properties,
      ...ncov,
    };
  });
  return geodata;
}

const WorldMap = () => {
const [data, setData] = React.useState();
const [filldata, setfillData] = React.useState();
const getData = () => {
  countryRanking().then(res => {
    let tempDate = res.data.countrys.map((item:{
      country: string;
      location: {longitude: string;latitude: string;}
      total_sales: number;
    }) => {
      return {
          centroid:[parseFloat(item.location.longitude),parseFloat(item.location.latitude)],
          code:"",
          confirmedCount: item.total_sales,
          countryEnglishName: "",
          countryName: "",
          currentConfirmedCount: item.total_sales,
          deadCount: 1,
          name: item.country,
          name_en: item.country,
          suspectedCount: item.total_sales,
      }
    })
    setData(tempDate);
  })
}
const fetchData = async () => {
  const [geoData, ncovData] = await Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/e62a2f3b-ea99-4c98-9314-01d7c886263d.json',
    ).then((d) => d.json()),
    // https://lab.isaaclin.cn/nCoV/api/area?latest=1
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/55a7dd2e-3fb4-4442-8899-900bb03ee67a.json',
    ).then((d) => d.json()),
  ]);
  const worldData = joinData(geoData, ncovData.results);
  setfillData(worldData);
  getData()
};
React.useEffect(() => {
  fetchData();
},[])
setInterval(() => {
  getData()
}, 1000 * 60 * 60 * 2)
  return (<>
    <div>
      <MapboxScene
        map={{
          center: [110.19382669582967, 50.258134],
          pitch: 50,
          style: 'blank',
          zoom: 1,
        }}
        style={{
          position: 'absolute',
          top: 10,
          left: 20,
          right: 20,
          bottom: 170,
          height: 284,
        }}
      >
        {data && [
          <PolygonLayer
            key={'1'}
            options={{
              autoFit: true,
            }}
            source={{
              data: filldata,
            }}
            scale={{
              values: {
                confirmedCount: {
                  type: 'quantile',
                },
              },
            }}
            color={{
              values: '#ddd',
            }}
            shape={{
              values: 'fill',
            }}
            style={{
              opacity: 1,
            }}
          />,
          <LineLayer
            key={'3'}
            source={{
              data: filldata,
            }}
            size={{
              values: 0.6,
            }}
            color={{
              values: '#fff',
            }}
            shape={{
              values: 'line',
            }}
            style={{
              opacity: 1,
            }}
          />,
          <PointLayerTemp
            key={'2'}
            options={{
              autoFit: true,
            }}
            source={{
              data,
              parser: {
                type: 'json',
                coordinates: 'centroid',
              },
            }}
            scale={{
              values: {
                confirmedCount: {
                  type: 'log',
                },
              },
            }}
            active={{
              option: {
                color: '#0c2c84',
              },
            }}
            color={{
              field: 'confirmedCount',
              values: (count) => {
                return count > 10000
                  ? '#732200'
                  : count > 1000
                  ? '#CC3D00'
                  : count > 500
                  ? '#FF6619'
                  : count > 100
                  ? '#FF9466'
                  : count > 10
                  ? '#FFC1A6'
                  : count > 1
                  ? '#FCE2D7'
                  : 'rgb(255,255,255)';
              },
            }}
            shape={{
              values: 'cylinder',
            }}
            size={{
              field: 'confirmedCount',
              values: (count: number) => {
                const height =
                  count > 10000
                    ? 70
                    : count > 1000
                    ? 40
                    : count > 500
                    ? 30
                    : count > 100
                    ? 20
                    : count > 10
                    ? 10
                    : count > 1
                    ? 5
                    : 1;
                return [5, 5, height];
              },
            }}
            style={{
              opacity: 1,
            }}
          />,
        ]}
      </MapboxScene>
    </div>
  </>)
}

export default WorldMap