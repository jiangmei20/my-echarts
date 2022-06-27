/**
 * @description 全局layout，全局路由页面的外层布局
 * @author 蒋梅
 * @createTime 2022-06-22
 */
import React, { useEffect } from 'react';
import ProLayout from '@ant-design/pro-layout';
import routes from '@/router/router';
import { useLocation, useHistory } from 'umi';
import styles from './index.less';
export default (props: any) => {
  let { children } = props || {};
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    // 默认首页
    if (location?.pathname === '/') {
      history.replace('/home');
    }
  }, []);

  /**
   * 点击头部
   * @param e
   */
  const onMenuHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e);
  };

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
      className={styles.pageLayout}
    >
      <ProLayout
        location={location}
        route={{
          routes: routes[0].routes,
        }}
        logo={require('../statics/images/logo.jpg')}
        title={'echarts实例组件'}
        onMenuHeaderClick={onMenuHeaderClick}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              history.push(item.path || '/home');
            }}
          >
            {dom}
          </a>
        )}
        layout="top"
      >
        <div className={styles.main}>{children}</div>
      </ProLayout>
    </div>
  );
};
