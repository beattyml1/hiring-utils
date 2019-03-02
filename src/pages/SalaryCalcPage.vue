<template>
    <div v-if="hasConfig" id="calc">
        <salary-calc
                :experienceCompInitial = "market"
                :positionCompInitial = "position"
                :stockInitial = "stock"
                :valuation = "valuation"
                :expLevels = "expLevels"
                :levels = "levels"
                :vestingYears = "vestingYears"
                :experienceWeight = "experienceWeight"
                :positionWeight = "positionWeight"
                :stockDiscount = "stockDiscount"
        ></salary-calc>
    </div>
</template>

<style>

</style>

<script lang="ts">
    import Component from "vue-class-component";
    import SalaryCalc from "@/components/SalaryCalc.vue";
    import SalaryCalcBasePage from "./SalaryCalcBasePage";

    @Component({
        name: 'SalaryCalcPage',
        components: { SalaryCalc },
    })
    export default class SalaryCalcPage extends SalaryCalcBasePage {
        constructor() {
            super();
        }
    }
</script>