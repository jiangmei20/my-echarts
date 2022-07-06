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
import './lib/china';
import styles from './index.less';

interface MapData {
  /** 城市的数据 */
  citys: any[];
  /** 迁徙线的数据 */
  moveLines: any[];
}

interface MigrationMapProp {
  id: string;
  /** 请求数据接口 */
  url?: string;
  data?: MapData;
  /** 搜索参数 */
  searchParam?: any;
  /** 在线车辆数的统计接口 */
  onlineCountUrl?: string;
  dispatch?:any;
}

const MigrationMap = (props: MigrationMapProp) => {
  const {id,dispatch} = props||{};
  const cityList = [
    {name: '北京市', provincial: '北京', value: [116.407526, 39.90403, -14]},
    {name: '上海市', provincial: '上海', value: [121.473701, 31.230416, 44]},
    {name: '天津市', provincial: '天津', value: [117.200983, 39.084158, 28]},
    {name: '重庆市', provincial: '重庆', value: [106.551557, 29.56301, 2]},
    {
      name: '黑龙江省',
      provincial: '哈尔滨',
      value: [126.534967, 45.803775, 8],
    },
    {name: '吉林省', provincial: '长春', value: [125.323544, 43.817072, 8]},
    {name: '辽宁省', provincial: '沈阳', value: [123.431475, 41.805698, 41]},
    {
      name: '内蒙古自治区',
      provincial: '呼和浩特',
      value: [111.749181, 40.842585, 2],
    },
    {
      name: '河北省',
      provincial: '石家庄',
      value: [114.475704, 38.584854, -19],
    },
    {
      name: '新疆维吾尔自治区',
      provincial: '乌鲁木齐',
      value: [87.627704, 43.793026, -2],
    },
    {name: '甘肃省', provincial: '兰州', value: [103.826308, 36.059421, -2]},
    {name: '青海省', provincial: '西宁', value: [96.778916, 35.623178, 2]},
    {name: '陕西省', provincial: '西安', value: [108.954239, 34.265472, -2]},
    {
      name: '宁夏回族自治区',
      provincial: '银川',
      value: [106.278179, 37.26637, -2],
    },
    {name: '河南省', provincial: '郑州', value: [113.625368, 34.7466, 1]},
    {name: '山东省', provincial: '济南', value: [117.020359, 36.66853, -6]},
    {name: '山西省', provincial: '太原', value: [112.548879, 37.87059, 2]},
    {name: '安徽省', provincial: '合肥', value: [117.227239, 31.820587, 1]},
    {name: '湖北省', provincial: '武汉', value: [114.305393, 30.593099, 2]},
    {name: '湖南省', provincial: '长沙', value: [112.938814, 28.228209, 5]},
    {name: '江苏省', provincial: '南京', value: [118.796877, 32.060255, 17]},
    {name: '四川省', provincial: '成都', value: [104.066541, 30.572269, 1]},
    {name: '贵州省', provincial: '贵阳', value: [106.630154, 26.647661, 2]},
    {name: '云南省', provincial: '昆明', value: [101.512251, 24.740609, 2]},
    {
      name: '广西壮族自治区',
      provincial: '南宁',
      value: [108.327546, 22.815478, -1],
    },
    {
      name: '西藏自治区',
      provincial: '拉萨',
      value: [91.117212, 29.646923, -1],
    },
    {name: '浙江省', provincial: '杭州', value: [120.152792, 30.267447, -2]},
    {name: '江西省', provincial: '南昌', value: [115.858198, 28.682892, 2]},
    {name: '广东省', provincial: '广州', value: [113.264435, 23.129163, 13]},
    {name: '福建省', provincial: '福州', value: [119.295144, 26.10078, -1]},
    {name: '台湾省', provincial: '台北', value: [121.509062, 24.044332, 2]},
    {name: '海南省', provincial: '海口', value: [109.83119, 19.031971, 2]},
    {
      name: '香港特别行政区',
      provincial: '香港',
      value: [114.173355, 22.320048, 2],
    },
    {name: '澳门地区', provincial: '澳门', value: [113.54909, 22.198951, 2]},
  ];
  // 默认数据
  const defaultMapData = {
    citys: [],
    moveLines: [],
  };
  const [allData, setAllData] = useState<MapData>(defaultMapData);
  const [onlineCount, setOlineCount] = useState<number>(0);
  // 定时器id
  const onlineCountDataRef = useRef<any>(0);
  useEffect(() => {
    getData();
    getOnlineVehicleCount();
    onlineCountDataRef.current = setInterval(() => {
      getOnlineVehicleCount();
    }, 30000);
    return () => {
      if (onlineCountDataRef?.current) {
        clearInterval(onlineCountDataRef.current);
        onlineCountDataRef.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      const mapChart = echarts?.init(idElement);
      mapChart?.setOption(getOption());
      // 鼠标按下时，阻止事件冒泡
      idElement.onmousedown = e => {
        e.stopPropagation();
      };
      // 图随窗口的变化而变化
      window.addEventListener('resize', function () {
        mapChart.resize();
      });
    }
  }, [allData]);

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
      props?.data && setAllData(dataHandling(props?.data));
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
  const dataHandling = (data: MapData) => {
    const {citys = [], moveLines = []} = data || {};
    if (citys?.length > 0) {
      // 取出最大值和最小值，算symbolSize的大小
      let maxCount = 1;
      let minCount = 0;
      citys.map((item: any) => {
        if (item?.count && item?.count > maxCount) {
          maxCount = item?.count;
        }
        if (item?.count && item?.count < minCount) {
          minCount = item?.count;
        }
      });
      citys.map((item: any) => {
        let findCity = cityList.find(
          (cityItem: any) => cityItem?.name.search(`${item?.name}`) !== -1,
        );
        if (findCity?.value) {
          let symbolSize = 2;
          if (item?.count && item?.count < maxCount) {
            symbolSize = Math.ceil((item?.count / maxCount) * 18);
          } else if (item?.count === maxCount) {
            symbolSize = 18;
          }
          item['value'] = findCity.value;
          item['symbolSize'] = symbolSize;
          item['itemStyle'] = {normal: {color: '#F6CC50'}};
        }
      });
    }
    if (moveLines?.length > 0) {
      moveLines.map((item: any) => {
        let fromCity = cityList.find(
          (cityItem: any) => cityItem?.name.search(`${item?.fromName}`) !== -1,
        );
        let toCity = cityList.find(
          (cityItem: any) => cityItem?.name.search(`${item?.toName}`) !== -1,
        );
        if (fromCity?.value && toCity?.value) {
          fromCity?.value.splice(2, 1);
          toCity?.value.splice(2, 1);
          item['coords'] = [fromCity?.value, toCity?.value];
        }
      });
    }
    return {citys, moveLines};
  };

  /**
   * 获取option
   */
  const getOption = () => {
    return {
      geo: {
        // 是否显示
        show: true,
        // 地图类型。world世界地图，china中国地图
        map: 'china',
        // center:[115.97, 29.71], //当前视角的中心点，用经纬度表示
        label: {
          normal: {
            // 普通状态下的标签文本样式。(省份名称)
            show: false,
            textStyle: {
              // 文字设置
              color: '#fff',
            },
          },
          emphasis: {
            // 是否在高亮状态下显示标签。(省份名称)
            show: true,
            textStyle: {
              // 文字设置
              color: '#fff',
            },
          },
        },
        // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        roam: true,
        itemStyle: {
          // 地图板块区域的多边形 图形样式
          normal: {
            // 默认板块信息
            areaColor: 'rgb(52,102,178)',
            borderColor: 'rgb(149,212,228)',
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: 'rgb(52,102,178)',
            shadowOffsetX: 7,
            shadowOffsetY: 6,
          },
          emphasis: {
            // 高亮版板块信息
            areaColor: '#4B9ACB',
            borderWidth: 1.6,
            shadowBlur: 25,
          },
        },
      },
      series: [
        {
          name: '地点',
          // 特效散点图
          type: 'effectScatter',
          // 'cartesian2d'使用二维的直角坐标系。'geo'使用地理坐标系
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            // 涟漪特效相关配置。// 波纹的绘制方式，可选 'stroke' 和 'fill'。
            brushType: 'stroke',
            // 动画的时间
            period: 4,
            // 动画中波纹的最大缩放比例。
            scale: 2.5,
          },
          label: {
            normal: {
              // 是否显示标签。
              show: false,
              // 标签的位置。// 绝对的像素值[10, 10],// 相对的百分比['50%', '50%'].'top','left','right','bottom','inside','insideLeft','insideRight','insideTop','insideBottom','insideTopLeft','insideBottomLeft','insideTopRight','insideBottomRight'
              position: 'inside',
              // 是否对文字进行偏移。默认不偏移。例如：[30, 40] 表示文字在横向上偏移 30，纵向上偏移 40。
              offset: [5, 10],
              // 标签内容格式器。模板变量有 {a}、{b}、{c}，分别表示系列名，数据名，数据值。
              formatter: '{b}: {c}',
            },
            emphasis: {
              show: true,
              position: 'right',
              formatter: '{b}',
            },
          },
          // 标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
          symbolSize: 2,
          // 配置何时显示特效。可选：'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
          showEffectOn: 'render',
          itemStyle: {
            // 图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
            normal: {
              color: '#46bee9',
            },
          },
          data: allData.citys,
        },
        {
          name: '线路',
          type: 'lines',
          // 'cartesian2d'使用二维的直角坐标系。'geo'使用地理坐标系
          coordinateSystem: 'geo',
          zlevel: 2,
          // 是否开启大规模散点图的优化，在数据图形特别多的时候（>=5k）可以开启。开启后配合 largeThreshold 在数据量大于指定阈值的时候对绘制进行优化。缺点：优化后不能自定义设置单个数据项的样式。
          large: true,
          effect: {
            show: true,
            // 点移动的速度
            constantSpeed: 30,
            // 图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
            symbol: 'pin',
            // 标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
            symbolSize: 9,
            // 线的宽度
            trailLength: 0,
          },
          lineStyle: {
            // 线的颜色、宽度，样式设置
            normal: {
              color: '#F6CC50',
              // 线的宽度
              width: 2,
              // 线的透明度
              opacity: 0.5,
              // 线的完全程度
              curveness: 0.1,
            },
          },
          data: allData.moveLines,
        },
      ],
    };
  };
  return (
    <div className={styles.migrationMap}>
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
export default MigrationMap;
