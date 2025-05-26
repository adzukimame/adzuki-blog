import type { Meta, StoryObj } from '@storybook/vue3';
import AppFooter from '~/components/AppFooter.vue';

const meta = {
  title: 'components/AppFooter',
  component: AppFooter,
  tags: ['autodocs'],
} satisfies Meta<typeof AppFooter>;

export const Default: StoryObj<typeof AppFooter> = {
  render: () => ({
    components: { AppFooter },
    template: '<AppFooter />',
  }),
};

export default meta;
