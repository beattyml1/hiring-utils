<template>
    <div>
        <header id="builder-header">
            <toggle v-model="tab" id="builder-tab">
                <toggle-item value="edit">
                    Edit
                </toggle-item>
                <toggle-item value="preview">
                    Preview
                </toggle-item>
            </toggle>
        </header>
        <div v-if="tab==='edit'" id="builder">
            <salary-calc-config v-model="config"></salary-calc-config>
        </div>
        <div v-else id="calc">
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
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import SalaryCalcConfig from "@/components/SalaryCalcConfig.vue";
    import SalaryCalc from "@/components/SalaryCalc.vue";
    import Toggle from "../components/Toggle/Toggle.vue";
    import ToggleItem from "../components/Toggle/ToggleItem.vue";
    import SalaryCalcBasePage from "./SalaryCalcBasePage";

    @Component({
        name: "SalaryCalcBuildPage",
        components: {ToggleItem, Toggle, SalaryCalc, SalaryCalcConfig },
    })
    export default class SalaryCalcBuildPage extends SalaryCalcBasePage {
        constructor() {
            super();
        }
        tab = 'edit';
    }
</script>

<style scoped>
    #builder-tab {
        margin: auto;
    }
    #builder-header {
        display: flex;
        align-items: center;
    }
</style>