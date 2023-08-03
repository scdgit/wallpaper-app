<script setup lang="ts">
// 禁用h5端长按[右键]菜单弹出
//#ifdef H5
document.addEventListener('contextmenu', function(e) {
  e.preventDefault()
})
//#endif

</script>
<style lang="scss">
@import './uni.scss';
@import './style/animation.css';
body,html { 
   font-size: 32rpx;
   font-family: PingFangSC-Regular;
}
// h5页面隐藏顶部导航条
/* #ifdef H5 */ 
uni-page-head {
  display: none;
}
/* #endif */
</style>
