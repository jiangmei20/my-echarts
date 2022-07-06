/**
 * @description :面积折线图
 * @author：蒋梅
 * @email :1229961908@qq.com
 * @creatTime : 2022/04/21
 */
import React, {useEffect} from 'react';
// @ts-ignore
import * as echarts from 'echarts';

interface AreaLineData {
  name?: string;
  /** x抽 */
  x: string[];
  /** 面积数据 */
  data: number[];
  /** 线的颜色 */
  color?: string;
}

interface AreaLineProp {
  /** echarts中图形id */
  id: string;
  /** 条形图的数据 */
  data: AreaLineData;
}

const AreaLine = (props: AreaLineProp) => {
  const {id, data} = props;
  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      const AreaLineChart = echarts?.init(idElement);
      AreaLineChart?.setOption(getOption());
      // 图随窗口的变化而变化
      window.addEventListener('resize', function () {
        AreaLineChart.resize();
      });
    }
  }, [data]);

  /***
   * 获取option
   */
  function getOption() {
    return {
      grid: {
        top: 10,
        bottom: 30,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      xAxis: {
        // 不显示X轴
        show: false,
        type: 'category',
        // 坐标轴两边留白策略
        boundaryGap: false,
        data: data.x,
        nameTextStyle: {
          color: data?.color || '#4e92fd',
        },
        splitLine: {
          // 分隔线
          show: false,
          lineStyle: {
            color: ['#20253f'],
            type: 'dotted',
          },
        },
        axisLine: {
          lineStyle: {
            color: data?.color || '#4e92fd',
          },
        },
      },
      yAxis: {
        show: false,
        name: data.name,
        type: 'value',
        splitLine: {
          // 分隔线
          show: false,
          lineStyle: {
            color: ['#20253f'],
            type: 'dotted',
          },
        },
        nameTextStyle: {
          color: '#fff',
        },
        axisLine: {
          lineStyle: {
            color: data?.color || '#4e92fd',
          },
        },
      },
      series: [
        {
          data: data.data,
          type: 'line',
          itemStyle: {
            color: data?.color || '#4e92fd',
          },
          lineStyle: {
            color: data?.color || '#4e92fd',
          },
          areaStyle: {
            normal: {
              // color: '#4e92fd',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: data?.color || '#4e92fd',
                },
                {
                  offset: 1,
                  color: '#4e92fd00',
                },
              ]),
            },
          },
          // 去掉拐点
          showSymbol: false,
          smooth: true,
        },
      ],
    };
  }


  return (
    <div id={id} style={{width: '100%', height: '100%'}}/>
  );
};
export default AreaLine;
