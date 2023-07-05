<script setup lang="ts">
// import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
// 禁用h5端长按[右键]菜单弹出
//#ifdef H5
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
//#endif
</script>
<style lang="scss">
@import './uni.scss';
body,html { font-size: 16px; }
// h5页面隐藏顶部导航条
/* #ifdef H5 */ 
uni-page-head {
  display: none;
}
/* #endif */
</style>
