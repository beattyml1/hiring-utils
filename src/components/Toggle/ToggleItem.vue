<template>
    <button type="button" :class="{btn:true, 'btn-primary': selected, 'btn-light': !selected, 'border-default': true, 'btn-sm': $parent.small }" @click="itemClicked">
        <slot />
    </button>
</template>

<style>

</style>

<script>
    export default {
        props: ['value'],
        data: () => ({ selected: false,  }),
        methods: {
            itemClicked() {
                this.$parent.itemClicked(this.value);
            }
        }
    }
</script>