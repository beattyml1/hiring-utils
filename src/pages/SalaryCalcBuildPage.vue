<template>
    <form id="builder-form" @submit.prevent="save" class="align-content-center">
        <header id="builder-header">
            <toggle v-model="tab" id="builder-tab">
                <toggle-item value="edit">
                    Edit
                </toggle-item>
                <toggle-item value="preview">
                    Preview
                </toggle-item>
            </toggle>
            <button type="submit" class="btn btn-primary">Save<spinner v-if="saving"></spinner></button>
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
        <button type="submit" class="btn btn-primary full-width">Save<spinner v-if="saving"></spinner></button>
    </form>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import SalaryCalcConfig from "@/components/SalaryCalcConfig.vue";
    import SalaryCalc from "@/components/SalaryCalc.vue";
    import Toggle from "../components/Toggle/Toggle.vue";
    import ToggleItem from "../components/Toggle/ToggleItem.vue";
    import SalaryCalcBasePage from "./SalaryCalcBasePage";
    import {userData} from "../services/firebase";
    import Spinner from "../components/Spinner";

    @Component({
        name: "SalaryCalcBuildPage",
        components: {Spinner, ToggleItem, Toggle, SalaryCalc, SalaryCalcConfig },
    })
    export default class SalaryCalcBuildPage extends SalaryCalcBasePage {
        constructor() {
            super();
        }
        tab = 'edit';
        saving = false;
        async save() {
            this.saving = true;
            if (this.config.uid)
                await userData().collection(`/calcs`).doc(this.config.uid).set(this.config as any)
            else
                await userData().collection(`/calcs`).add(this.config as any).then(docRef => `/build/calc/${docRef.id}`).then(this.$router.push);
            this.saving = false;
        }
    }
</script>

<style scoped lang="scss">
    #builder-form {
        position: relative;
    }
    #builder-tab {
        margin: auto;
    }
    #builder {
        margin: auto;
    }
    #builder-header {
        &>* {
            display: block;
            position: relative;
            left: 0;
            right: 0;
            text-align: center;
            margin: auto auto 10px;
        }
        &>.btn {
            width: 200px;
        }
    }
</style>