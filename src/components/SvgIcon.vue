<template>
   <svg :class="svgClass" :aria-hidden="true" :style="{ fill: iconFill, width: iconSize, height: iconSize }">
      <use :xlink:href="iconName" />
   </svg>
</template>

<script lang="ts" setup>
/**
 * icon: svg文件夹下对应的 .svg 文件名
 * className: 自定义图标类名
 * size: 图标大小
 * color: 图标颜色
 */
/* 自定义svg图标组件 */
const props = defineProps({
   icon: {
      type: String,
      required: true,
   },
   className: {
      type: String,
      default: "",
   },
   size: {
      type: Number,
      default: 15
   },
   color: {
      type: String,
      default: "#777",
   }
})
const iconName = computed(() => {
   return `#icon-${props.icon}`;
},)
const svgClass = computed(() => {
   return props.className ? "svg-icon " + props.className : "svg-icon";
})
const iconFill = computed(() => {
   return props.color ? props.color : "#777";
})
const iconSize = computed(() => {
   return props.size * 2 + 'rpx'
})
</script>

<style lang="scss" scoped>
.svg-icon {
   width: 1em;
   height: 1em;
   font-size: 1.2em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
}
</style>