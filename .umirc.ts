import { defineConfig } from 'umi';
import routes from './src/router/router';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  //  配置整合使用dva插件
  dva: {
    immer: true,
    hmr: false,
  },
  fastRefresh: {},
});
