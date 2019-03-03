<template>
    <div class="salary-calc">
        <h1>{{title}}</h1>
        <div class="slider">
            <label for="experience-slider">
                Current Experience Level
            </label>
            <experience-slider v-model="market" :levels="expLevels"></experience-slider>
        </div>
        <label>
            Market Compensation for Experience
            <input type="text" readonly :value="formatDollars(market)" class="form-control">
        </label>

        <label>
            Position Applied for
            <select class="form-control" v-model="position">
                <option v-for="l in levels" :key="l.name" :value="l.start">{{l.name}}</option>
            </select>
        </label>
        <label>
            Compensation (USD)
            <input type="text" readonly :value="formatDollars(compensation)" class="form-control">
        </label>
        <div class="row mb-2">
            <label class="col col-sm-12 col-md-12">
                Stock
                <input type="range" :readonly="!hasStock" v-model="stock" class="form-control mt-2" :min="minStock" :max="maxStock" step="125">
            </label>

            <label class="col col-sm-12 col-md-6">
                Per Year
                <input type="text" readonly :value="formatDollars(stock)" class="form-control">
            </label>
            <label class="col col-sm-12 col-md-6">
                Total % over 4 year vesting
                <input type="text" readonly :value="`${(share*100).toFixed(2)}%`" class="form-control">
            </label>
        </div>
        <label>
            Salary (USD)
            <input type="text" readonly :value="formatDollars(salary)" class="form-control">
        </label>
    </div>
</template>

<script lang="ts">
    import ExperienceSlider from './ExperienceSlider.vue'
    import {formatDollars} from "../services/money";
    import {Prop, Watch} from "vue-property-decorator";
    import {ExperienceLevel, PositionLevel} from "../types/config";
    import Component from "vue-class-component";
    import Vue from 'vue'

    @Component({
        name: 'SalaryCalc',
        components: {ExperienceSlider},
    })
    export default class SalaryCalc extends Vue {

        @Prop(String) title: string
        @Prop([Number,String]) valuation: number
        @Prop(Array)  levels: PositionLevel[]
        @Prop(Array)  expLevels: ExperienceLevel[]
        @Prop([Number,String]) experienceCompInitial: number
        @Prop([Number,String]) positionCompInitial: number
        @Prop([Number,String]) stockInitial: number
        @Prop([Number,String]) vestingYears: number
        @Prop([Number,String]) experienceWeight: number
        @Prop([Number,String]) positionWeight: number
        @Prop([Number,String]) stockDiscount: number

        // @Watch('experienceCompInitial')
        // onExpCompChange() { this.market = this.experienceCompInitial; }
        // @Watch('positionCompInitial')
        // onPositionCompInitialChange() { this.market = this.positionCompInitial; }
        // @Watch('stockInitial')
        // onStockInitialChange() { this.market = this.stockInitial; }

        market: number;
        position;
        stock: number;
        data() {return {
            market: this.experienceCompInitial,
            position: this.positionCompInitial,
            stock: this.stockInitial,
        }}
        mounted() {
            this.position = 105000;
        }
        get compensation() {
            return (
                (this.level().fixedSalary) ? this.position :
                (this.market < this.position) ? (this.market * this.experienceWeight + parseInt(this.position) * this.positionWeight) / (this.experienceWeight + this.positionWeight) :
                this.market
            );
        }
        get salary() {
            return this.compensation - this.stock * (1 - this.stockDiscount);
        }
        get share() {
            return this.stock * this.vestingYears / (this.valuation);
        }
        get hasStock() {
            return this.level().maxStock > 0;
        }
        get minStock() {
            return this.level().minStock;
        }
        get maxStock() {
            return this.level().maxStock;
        }

        formatDollars(x) { return formatDollars(x) }

        level() {
            return this.levels.find(l => l.start == this.position) || this.level[0];
        }

        @Watch('position')
        onPositionChange() {
            if (this.stock < this.minStock) this.stock = this.minStock;
            if (this.stock > this.maxStock) this.stock = this.maxStock;
        }
    }

</script>

<style>
    .slider {
        width: 100%;
        position: relative;
        height: 130px;
    }

    input[type="range"] {
        -webkit-appearance: none;
        height: 15px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.9;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }

    input[type="range"][readonly="readonly"]::-webkit-slider-thumb,
    input[type="range"][readonly="readonly"]::-moz-range-thumb,
    input[type="range"][readonly="readonly"] #thumb{
        background: #9cad9d !important;
    }
</style>
