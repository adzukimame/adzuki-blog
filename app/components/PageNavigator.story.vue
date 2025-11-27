<template>
  <Story id="PageNavigator">
    <Variant
      title="default"
      :meta="{
        interact: [
          { operation: [{ hover: '[aria-label=\'最初のページに戻る\']' }] },
          { operation: [{ hover: '[aria-label=\'1ページ前に戻る\']' }] },
          { operation: [{ hover: '[aria-label=\'1ページ次に進む\']' }] },
          { operation: [{ hover: '[aria-label=\'最後のページに進む\']' }] },
        ],
      }">
      <PageNavigator v-bind="defaultData" />
    </Variant>
    <Variant title="firstPage">
      <PageNavigator v-bind="firstPageData" />
    </Variant>
    <Variant title="lastPage">
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
