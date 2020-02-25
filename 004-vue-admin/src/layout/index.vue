<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
<!--      <right-panel v-if="showSettings">
        <settings />
      </right-panel>-->
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import Sidebar from "./sidebar";
import Navbar from './navbar';
import TagsView from './tags-view';
import AppMain from './app-main';
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    RightPanel,
    AppMain
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "~@/common/style/mixin.scss";
@import "~@/common/style/variables.scss";
.container {
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 300px;
  height: 100%;
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>