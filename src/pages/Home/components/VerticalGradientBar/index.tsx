/**
 * @description :垂直渐变条形图
 * @author：蒋梅
 * @email :1229961908@qq.com
 * @creatTime : 2022/04/15
 */
import React, {useEffect, useRef} from 'react';
// @ts-ignore
import * as echarts from 'echarts';

interface BarData {
  /** 图表的名字，非必传 */
  name?: string;
  /** y轴 */
  x: string[];
  /** y轴对应的数据 */
  data: number[];
  /** 柱子的渐变颜色，有两个值 */
  color?: string[]
}

interface VerticalGradientBarProps {
  /** echarts中图形id */
  id: string;
  /** 条形图的数据 */
  data: BarData;
  /** 字体大小 */
  echartsFontSize?: number;
}

const VerticalGradientBar = (props: VerticalGradientBarProps) => {
  const {id, data = {x: [], data: []}, echartsFontSize = 14} = props;
  const timerRef = useRef<any>(0);
  const orderIcons = {
    first: require('./images/hong.png'),
    second: require('./images/cheng.png'),
    third: require('./images/huang.png'),
    other: require('./images/lan.png'),
  };

  useEffect(() => {
    return () => {
      if (timerRef?.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, []);
  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      const barChart = echarts?.init(idElement);
      barChart?.setOption(getOption());
      timer(barChart);
      //图随窗口的变化而变化
      window.addEventListener('resize', function () {
        barChart.resize();
      });
    }
  }, [data]);

  /**
   * 获取Y轴上标识
   * @param name x轴对应的值
   * @param type 判断是值还是图标
   */
  const getFlag = (name: string, type?: string) => {
    let needFlag = 'other';
    let order = 1;
    data?.x.map((item: any, index: number) => {
      let len = data?.x?.length;
      if (item === name) {
        order = len - index;
        if (index === len - 1) {
          needFlag = 'first';
        } else if (index === len - 2) {
          needFlag = 'second';
        } else if (index === len - 3) {
          needFlag = 'third';
        }
      }
    });
    if (type === 'order') {
      return order;
    } else {
      return needFlag;
    }
  };

  /**
   * 定时器
   * @param barChart
   */
  const timer = (barChart: any) => {
    if (timerRef?.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    let newX = [...data?.x];
    let newData = [...data?.data];
    timerRef.current = setInterval(function () {
      newX.push(newX[0]);
      newX.shift();
      newData.push(newData[0]);
      newData.shift();
      barChart.setOption({
        yAxis: {
          data: newX,
        },
        series: [
          {
            data: newData,
          },
        ],
      });
    }, 3000);
  };

  /***
   * 获取option
   */
  function getOption() {
    let gradientColor = ['#78F4D700', '#78F4D7'];
    if (data?.color && data?.color?.length > 0) {
      gradientColor = [data.color[0], data.color[1]];
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: '#25629B',
      },
      grid: {
        left: '-15%',
        top: '3%',
        bottom: '3%',
        right: '10%',
        containLabel: true,
      },
      barWidth: 15,
      xAxis: {
        type: 'value',
        splitLine: {
          show: false,
          lineStyle: {
            color: '#2e5ca9',
            type: 'dashed',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          //  改变X轴颜色
          lineStyle: {
            color: '#2e5ca9',
          },
        },
        axisLabel: {
          //  改变x轴字体颜色和大小
          textStyle: {
            color: '#fff',
            fontSize: echartsFontSize,
          },
        },
      },
      yAxis: {
        type: 'category',
        data: data.x,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          //  改变y轴颜色
          lineStyle: {
            color: '#2e5ca9',
          },
        },
        axisLabel: {
          //  改变y轴字体颜色和大小
          //  给y轴添加单位，请勿删
          //formatter: '{value} m³ ',
          textStyle: {
            color: '#fff',
            fontSize: echartsFontSize,
            align: 'left',
          },
          interval: 0,
          baseLine: 'middle',
          margin: 100,
          formatter: function (value: any) {
            if (value?.length > 4) {
              return (
                '{' +
                getFlag(value) +
                '|' +
                getFlag(value, 'order') +
                ' }{value|' +
                value.substring(0, 4) +
                '...}'
              );
            } else {
              return (
                '{' +
                getFlag(value) +
                '|' +
                getFlag(value, 'order') +
                ' }{value|' +
                value +
                '}'
              );
            }
          },
          rich: {
            first: {
              width: 30,
              height: 30,
              align: 'center',
              backgroundColor: {
                image: orderIcons.first,
              },
            },
            second: {
              width: 30,
              height: 30,
              align: 'center',
              backgroundColor: {
                image: orderIcons.second,
              },
            },
            third: {
              width: 30,
              height: 30,
              align: 'center',
              backgroundColor: {
                image: orderIcons.third,
              },
            },
            other: {
              width: 30,
              height: 30,
              align: 'center',
              backgroundColor: {
                image: orderIcons.other,
              },
            },
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: data.name,
          barWidth: 20,
          itemStyle: {
            normal: {
              label: {
                // 开启显示
                show: true,
                // 在上方显示
                position: 'right',
                textStyle: {
                  // 数值样式
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                },
              },
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: gradientColor[0] || '#78F4D700',
                },
                {
                  offset: 1,
                  color: gradientColor[1] || '#78F4D7',
                },
              ]),
            },
          },
          data: data.data,
        },
      ],
    };
  }

  return (
    <div id={id} style={{width: '100%', height: '100%'}}/>
  );
};
export default VerticalGradientBar;
