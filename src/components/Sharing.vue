<template>

</template>

<style>

</style>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";

    @Component({

    })
    export default class Sharing extends Vue {
        @Prop(Object) value: { public: string, shares: { email: string, shareId: string }[] }
    }
</script>