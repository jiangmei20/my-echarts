/**
 * @description :多条折线组件
 * @author：蒋梅
 * @email :1229961908@qq.com
 * @creatTime : 2022/06/15
 */
import React, {useEffect} from 'react';
// @ts-ignore
import * as echarts from 'echarts';
import tooltipImage from './images/tooltip-bg.png';

interface LineItem {
  name: string,
  value: number[],

  /** 任意字段 */
  [propName: string]: any,
}

interface MultipleLineData {
  legend: string[];
  x: string[] | number[];
  /** 线的数据 */
  data: LineItem[];
  /** 线的颜色 */
  colors?: string[];
  /** y轴name */
  yName?: string;
}

interface MultipleLineProps {
  /** 图形id */
  id: string;
  /** 图的数据 */
  data: MultipleLineData;
}

const MultipleLine = (props: MultipleLineProps) => {
  const {id, data} = props || {};
  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      const MultipleLineChart = echarts?.init(idElement);
      MultipleLineChart?.setOption(getOption());
      // 图随窗口的变化而变化
      window.addEventListener('resize', function () {
        MultipleLineChart.resize();
      });
    }
  }, [data]);

  const getTooltipCustomDOM = (data: any) => {
    let str = `<div style = "background:url(${require('./images/tooltip-bg.png')}) no-repeat center center ;background-size: 100% 100%; ">
            <div>${data[0]?.axisValue}</div>
            <div>
                <span>${data[0]?.seriesName}: ${data[0]?.value}</span>
                <span>${data[1]?.seriesName}: ${data[1]?.value}</span>
            </div>
            <div>
                <span>${data[2]?.seriesName}: ${data[2]?.value}</span>
                <span>${data[3]?.seriesName}: ${data[3]?.value}</span>
            </div>
            <div>
                <span>${data[4]?.seriesName}: ${data[4]?.value}</span>
            </div>
          </div>`;
    return str;
  };
  /**
   * 获取图的配置
   */
  const getOption = () => {
    let listData = data.data;
    let seriesData = [];
    let colors = data?.colors
      ? data?.colors
      : ['#E6A835', '#429AF4', '#B956F5', '#10AD7A', '#9EC1FB'];
    for (let i = 0; i < listData.length; i++) {
      seriesData.push({
        name: listData[i].name,
        type: 'line',
        showSymbol: false, //去掉拐点
        itemStyle: {
          color: colors[i],
        },
        tooltip: {
          valueFormatter: (value: any) => {
            return value;
          },
        },
        data: listData[i].value,
      });
    }
    return {
      grid: {
        left: '3%',
        right: '20%',
        bottom: '3%',
        containLabel: true,
      },
      legend: {
        textStyle: {
          color: colors,
        },
        itemHeight: 4,
        itemWidth: 19,
        icon: 'rect',
        orient: 'vertical',
        y: 'top',
        right: '0',
        data: data.legend,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#25629B',
        // 使用图片的情况，请勿删
        // formatter:((params:any)=>{
        //   return getTooltipCustomDOM(params);
        // }),
        // extraCssText:'background:url('+require("./images/tooltip-bg.png")+') no-repeat center center;background-size: 100% 100%;',
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLine: {
          lineStyle: {
            color: '#25629B',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          //  改变x轴字体颜色和大小
          textStyle: {
            color: '#fff',
          },
        },
        data: data.x,
      },
      yAxis: {
        name: data?.yName,
        nameTextStyle: {
          color: '#52CCFF',
        },
        type: 'value',
        splitLine: {
          //分隔线
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#25629B',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          //  改变x轴字体颜色和大小
          textStyle: {
            color: '#fff',
          },
        },
      },
      series: seriesData,
    };
  };
  return <div id={id} style={{width: '100%', height: '100%'}}/>;
};
export default MultipleLine;
