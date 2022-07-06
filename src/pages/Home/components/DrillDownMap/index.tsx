/**
 * @description :迁徙图
 * @author：蒋梅
 * @email : 1229961908@qq.com
 * @creatTime : 2022/6/13
 * @data: {citys: [{
 *       "name": "贵阳",
 *       count:2,
 *     },
 *       {
 *         "name": "抚顺",
 *         count:2,
 *       },],
 *     moveLines: [
 *       {"fromName": "贵阳", "toName": "抚顺"},
 *       {"fromName": "贵阳", "toName": "抚顺"},
 *     ]
 * }
 */
import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import * as echarts from 'echarts';
// @ts-ignore
import getGeoJsonData from './lib/china';
import styles from './index.less';

interface MapDataItem {
  name: string;
  /** 统计数 */
  value: number;
  cityCode: string | number;
}

interface PointDataItem {
  name: string;
  /** 数组中的数据[经度，纬度，统计数] */
  value: any[];
  cityCode: string | number;
}

interface MapData {
  /** 地图和统计的数据 */
  mapData: MapDataItem[];
  /** 点的数据 */
  pointData: PointDataItem[];
}

interface DrillDownMapProp {
  id: string;
  /** 请求数据接口 */
  url?: string;
  data?: MapData;
  /** 搜索参数 */
  searchParam?: any;
  /** 在线车辆数的统计接口 */
  onlineCountUrl?: string;
  dispatch?: any;
  /** 字体大小 */
  echartsFontSize?: number;
}

const DrillDownMap = (props: DrillDownMapProp) => {
  const {id, dispatch, echartsFontSize = 12} = props || {};
  let infoDefault = [{cityName: '中国', code: 100000}];
  const [parentInfo, setParentInfo] = useState(infoDefault);
  const [echartsMap, setEchartsMap] = useState<any>();
  const [geoJsons, setGeoJsons] = useState<any>(null);
  const [vehCountData, setVehCountData] = useState();
  const [allVeh, setAllVeh] = useState();
  // 默认数据
  const defaultData = {
    mapData: [],
    pointData: [],
  };
  const [allData, setAllData] = useState<MapData>(defaultData);
  const [onlineCount, setOlineCount] = useState<number>(0);
  // 定时器id
  const onlineCountDataRef = useRef<any>(0);

  useEffect(() => {
    if (echartsMap) {
      echartsMap.hideLoading();
    }
    getData();
    if (getGeoJsonData.length > 0) {
      setGeoJsons({features: getGeoJsonData});
    }else {
      //如果没有数据时，处理数据并阻止往下运行
      parentInfo.splice(parentInfo.length - 1);
      setParentInfo(parentInfo);
      return;
    }
  }, []);

  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      // setEchartsMap(mapChart);
      // if (parentInfo.length === 1) {
      //   echarts.registerMap('china', geoJsons); //注册
      // } else {
      //   echarts.registerMap('map', geoJsons); //注册
      // }
      const mapChart = echarts?.init(idElement);
      // mapChart?.setOption(getOption());
      // 鼠标按下时，阻止事件冒泡
      idElement.onmousedown = e => {
        e.stopPropagation();
      };
      // 图随窗口的变化而变化
      window.addEventListener('resize', function () {
        mapChart.resize();
      });
    }
  }, [geoJsons,allData]);

  /**
   * 获取数据
   */
  const getData = () => {
    if (props?.url) {
      dispatch &&
      dispatch({type: props?.url, payload: props?.searchParam || {}}).then(
        (res: MapData) => {
          setAllData(dataHandling(res));
        },
      );
    } else {
      getGeoJsonData && setAllData(dataHandling({features: getGeoJsonData}));
    }
  };

  /**
   * 获取在线车辆数
   */
  const getOnlineVehicleCount = () => {
    if (props?.onlineCountUrl) {
      dispatch &&
      dispatch({
        type: props?.onlineCountUrl,
        payload: props?.searchParam || {},
      }).then((res: any) => {
        if (res?.onlineCount) {
          setOlineCount(res?.onlineCount);
        }
      });
    }
  };
  /**
   * 数据处理
   * @param data 请求的数据
   */
  const dataHandling = (data: any) => {
    let mapData: MapDataItem[] = [];
    let pointData: PointDataItem[] = [];
    console.log('111111111111',data)
    data?.features&&data.features.forEach((j: any) => {
      if (!j.properties.center) {
        return;
      }
      let count = 0;
      mapData.push({
        name: j.properties.name,
        value: count,
        cityCode: j.properties.adcode,
      });
      pointData.push({
        name: j.properties.name,
        value: [
          j.properties.center ? j.properties.center[0] : 0,
          j.properties.center ? j.properties.center[1] : 0,
          count,
        ],
        cityCode: j.properties.adcode,
      });
    });
    mapData = mapData.sort(function (a, b) {
      return b.value - a.value;
    });
    return {mapData: [], pointData: []}
  };

  /**
   * 获取option
   */
  const getOption = () => {
    let fontSize = echartsFontSize;
    if (!echartsFontSize) {
      fontSize = 12;
    }
    const mapData = allData?.mapData;
    let min = mapData[mapData.length - 1].value,
      max = mapData[0].value;
    return {
      baseOption: {
        animation: true,
        animationDuration: 900,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 900,
        animationEasingUpdate: 'cubicInOut',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: fontSize,
          },
        },
        grid: {
          right: '2%',
          top: '12%',
          bottom: '8%',
          width: '20%',
        },
        visualMap: {
          show: false,
          min: min,
          max: max,
          left: '3%',
          bottom: '5%',
          calculable: true,
          seriesIndex: [0],
          inRange: {
            color: ['#1e62ac', '#2E98CA', '#24CFF4'], //'#1e62ac',
          },
          textStyle: {
            color: '#24CFF4',
          },
        },
        geo: {
          map: parentInfo.length === 1 ? 'china' : 'map',
          zoom: 1.1,
          roam: true,
          // center: parentInfo.length === 1 ? ['118.83531246', '32.0267395887'] : false,
          tooltip: {
            trigger: 'item',
            formatter: (p:any) => {
              let val = p.value[2];
              if (window.isNaN(val)) {
                val = 0;
              }
              let txtCon =
                '<div style="text-align:left">' +
                p.name +
                ':<br />车辆数：' +
                val +
                '台</div>';
              return txtCon;
            },
            textStyle: {
              fontSize: fontSize,
            },
          },
          label: {
            normal: {
              show: true,
              color: 'rgb(249, 249, 249)', //省份标签字体颜色
              textStyle: {
                fontSize: fontSize,
              },
              formatter: (p: any) => {
                switch (p.name) {
                  case '内蒙古自治区':
                    p.name = '内蒙古';
                    break;
                  case '西藏自治区':
                    p.name = '西藏';
                    break;
                  case '新疆维吾尔自治区':
                    p.name = '新疆';
                    break;
                  case '宁夏回族自治区':
                    p.name = '宁夏';
                    break;
                  case '广西壮族自治区':
                    p.name = '广西';
                    break;
                  case '香港特别行政区':
                    p.name = '香港';
                    break;
                  case '澳门特别行政区':
                    p.name = '澳门';
                    break;
                  default:
                    break;
                }
                return p.name;
              },
            },
            emphasis: {
              show: true,
              color: '#f75a00',
              textStyle: {
                fontSize: fontSize,
              },
            },
          },
          itemStyle: {
            normal: {
              areaColor: '#24CFF4',
              borderColor: '#53D9FF',
              borderWidth: 1.3,
              shadowBlur: 15,
              shadowColor: 'rgb(58,115,192)',
              shadowOffsetX: 7,
              shadowOffsetY: 6,
            },
            emphasis: {
              areaColor: '#8dd7fc',
              borderWidth: 1.6,
              shadowBlur: 25,
            },
          },
        },
        series: [
          {
            name: '车辆数',
            type: 'map',
            geoIndex: 0,
            map: parentInfo.length === 1 ? 'china' : 'map',
            roam: true,
            zoom: 1.3,
            tooltip: {
              trigger: 'item',
              formatter: (p: any) => {
                let val = p.value;
                if (window.isNaN(val)) {
                  val = 0;
                }
                let txtCon =
                  '<div style="text-align:left">' +
                  p.name +
                  ':<br />车辆数：' +
                  val +
                  '台</div>';
                return txtCon;
              },
              textStyle: {
                fontSize: fontSize,
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            data: mapData,
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            rippleEffect: {
              brushType: 'stroke',
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(5,80,151,0.2)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(5,80,151,0.8)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(29,125,252,0.7)',
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            label: {
              normal: {
                show: true,
                color: '#fff',
                fontWeight: 'bold',
                position: 'inside',
                formatter: function (para: any) {
                  return '{cnNum|' + para.data.value[2] + '}';
                },
                rich: {
                  cnNum: {
                    fontSize: fontSize,
                    color: '#D4EEFF',
                  },
                },
              },
            },
            data: allData?.pointData || [],
            symbol: 'circle',
            symbolSize: function (val: any) {
              if (max && max === min) {
                return fontSize * 2;
              }
              if (val[2] === 0) {
                return 0;
              }
              let a = (fontSize * 2.5 - fontSize) / (max - min);
              let b = fontSize * 2.5 - a * max;
              return a * val[2] + b * 1.2;
            },
            showEffectOn: 'render', //加载完毕显示特效
          },
        ],
      },
    };
  };

  return (
    <div className={styles.drillDownMap}>
      {/*<div className={styles.vehicleOnlineNumber}>*/}
      {/*  在线车辆数*/}
      {/*  <b>{onlineCount}</b>*/}
      {/*</div>*/}
      <div
        id={id}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
export default DrillDownMap;
