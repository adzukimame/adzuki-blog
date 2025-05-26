<template>
  <Story>
    <Variant title="default">
      <PageNavigator v-bind="defaultData" />
    </Variant>
    <Variant title="FirstPage">
      <PageNavigator v-bind="firstPageData" />
    </Variant>
    <Variant title="LastPage">
      <PageNavigator v-bind="lastPageData" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PageNavigator from './PageNavigator.vue';

const defaultData: InstanceType<typeof PageNavigator>['$props'] = { currentPageNumber: 5, itemsLength: 100, itemsPerPage: 10, pageQueryParam: 'p' };
const firstPageData: InstanceType<typeof PageNavigator>['$props'] = { currentPageNumber: 1, itemsLength: 100, itemsPerPage: 10, pageQueryParam: 'p' };
const lastPageData: InstanceType<typeof PageNavigator>['$props'] = { currentPageNumber: 10, itemsLength: 100, itemsPerPage: 10, pageQueryParam: 'p' };
</script>
