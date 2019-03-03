<template>
    <form @submit.prevent="save">
        <h1>{{name}}</h1>
        <details>
            <summary>Formulas</summary>
            <code v-html="codeWeightsPretty">
            </code>
            <code v-html="stockCode">
            </code>
        </details>
        <div class="row">
            <label class="col col-sm-12 col-md-4">
                Name
                <input type="text" v-model="name" required class="form-control"/>
            </label>
            <label class="col col-sm-12 col-md-4 align-bottom" hidden>
                <input type="checkbox" v-model="showStock" />
                Show Stock
            </label>
        </div>
        <fieldset>
            <legend>Weights</legend>
            <div class="row">
                <label class="col col-sm-12 col-md-4">
                    Experience
                    <input type="number" v-model="experienceWeight" required class="form-control" step=".1"/>
                </label>
                <label class="col col-sm-12 col-md-4">
                    Position
                    <input type="number" v-model="positionWeight" required class="form-control" step=".1"/>
                </label>
            </div>
        </fieldset>
        <fieldset>
            <legend>Stock</legend>
            <div class="row">
                <label class="col col-sm-12 col-md-4">
                    Valuation
                    <input type="number" v-model="valuation" required class="form-control"/>
                </label>
                <label class="col col-sm-12 col-md-4">
                    Stock Discount (1=100%)
                    <input type="number" v-model="stockDiscount" required class="form-control" step=".01"/>
                </label>
                <label class="col col-sm-12 col-md-4">
                    Vesting Years
                    <input type="number" v-model="vestingYears" required class="form-control"/>
                </label>
            </div>
        </fieldset>
        <fieldset>
            <legend>Levels</legend>
            <div>
                <label class="d-inline-block">
                    Default Level Salary Interval
                    <input type="number" v-model="interval"  class="form-control"/>
                </label>
                <button type="button" class="btn btn-secondary" @click="addLevel">Add Level</button>
            </div>
            <table class="table table-striped">
                <thead class="small">
                    <tr>
                        <th>Pos</th>
                        <th>Exp</th>
                        <th>Name</th>
                        <th>Start</th>
                        <th>Stck Min</th>
                        <th>Stck Max</th>
                        <th>Max</th>
                        <th>Fixed</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="level in levels">
                        <td><input type="checkbox" v-model="level.position"/></td>
                        <td><input type="checkbox" v-model="level.experience"/></td>
                        <td width="25%"><input type="text" v-model="level.name" required/></td>
                        <td><input type="number" v-model="level.start" min="35000" required @blur="resort"/></td>
                        <td><input type="number" v-model="level.minStock" :max="level.maxStock" :required="level.position" v-if="level.position"/></td>
                        <td><input type="number" v-model="level.maxStock" :min="level.minStock" :required="level.position" v-if="level.position"/></td>
                        <td><input type="number" v-model="level.max" :min="level.start" :required="isHighestLevel(level)" v-if="isHighestLevel(level)"/></td>
                        <td><input type="checkbox" v-model="level.fixedSalary" v-if="level.position"/></td>
                        <td><button type="button" class="btn btn-link text-danger">Remove</button></td>
                    </tr>
                </tbody>
            </table>
        </fieldset>
        <fieldset>
            <legend>Defaults</legend>
            <div class="row">
                <label class="col col-sm-12 col-md-4">
                    Experience Market Value Default
                    <input type="number" v-model="defaultMarket" required class="form-control"/>
                </label>
                <label class="col col-sm-12 col-md-4">
                    Stock Default
                    <input type="number" v-model="defaultStock" required class="form-control"/>
                </label>
                <label class="col col-sm-12 col-md-4">
                    Position Default
                    <select  v-model="defaultPosition" required class="form-control">
                        <option v-for="level in levels.filter(x => x.start&&x.position)" :key="level.name" :value="level.start">
                            {{level.name}}
                        </option>
                    </select>
                </label>
            </div>
        </fieldset>
        <button type="submit" class="btn btn-primary">Save</button>
    </form>
</template>

<script lang="ts">
    import {userData} from '../services/firebase'
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import Vue from 'vue';
    import {CombinedLevel, ConfigModel, defaultConfigModel} from "../types/config";
    import {State} from "vuex-class";
    import {User} from "../types/User";
    import {formatCode} from "../services/codeFormatting";

    const defaults = defaultConfigModel();

    const stockCodeRaw = `salary = compensation - stock * (1 - stock_discount)`

    const codeWeightsRaw =
`compensation =
\tposition.starting_comp if position.fixed_rate else
\texperience_market_comp if experience_market_comp > position.starting_comp else
\t(experience_market_comp * experience_weight + position.starting_comp * position_weight) \n\t/ (experience_weight + position_weight)`

    @Component({
        name: "SalaryCalcConfig",
        watch: {
            levels() { this.$emit('input', this.model); },
            showStock() { this.$emit('input', this.model); },
            stockDiscount() { this.$emit('input', this.model); },
            experienceWeight() { this.$emit('input', this.model); },
            positionWeight() { this.$emit('input', this.model); },
            valuation() { this.$emit('input', this.model); },
            vestingYears() { this.$emit('input', this.model); },
            defaultMarket() { this.$emit('input', this.model); },
            defaultStock() { this.$emit('input', this.model); },
            value() { Object.assign(this, this.value) },
        }
    })
    export default class SalaryCalcConfig extends Vue implements ConfigModel {
        @Prop(Object) value: ConfigModel;
        defaultMarket: number = defaults.defaultMarket;
        defaultStock: number = defaults.defaultStock;
        experienceWeight: number = defaults.experienceWeight;
        levels: CombinedLevel[] = [];
        name: string = '';
        positionWeight: number = defaults.positionWeight;
        showStock: boolean = defaults.showStock;
        stockDiscount: number = defaults.stockDiscount;
        valuation: number = defaults.valuation;
        vestingYears: number = defaults.vestingYears;
        defaultPosition: number|null = defaults.defaultPosition;
        uid: string = '';
        @State user: User;

        data() {
            return {
                ...(this.value),
                interval: 15000,
            }
        }
        addLevel() {
            this.levels.push({
                position: true,
                experience: true,
                name: '',
                start: null,
                maxStock: null,
                minStock: null,
                max: null,
                fixedSalary: false
            })
        }

        isHighestLevel(level) {
            return level.start == Math.max(...this.levels.map(x => x.start||0))
        }

        save() {
            if (this.uid)
                userData().collection(`/calcs`).doc(this.uid).set(this.model)
            else
                userData().collection(`/calcs`).add(this.model).then(docRef => `/build/calc/${docRef.id}`).then(this.$router.push)
        }
        resort() {
            this.levels = this.levels.sort((a, b) => ((a.start || 0) - (b.start || 0)))
        }

        get codeWeightsPretty() { return formatCode(codeWeightsRaw)}
        get stockCode() {return  formatCode(stockCodeRaw)}

        get model() {
            let {
                uid,
                defaultMarket,
                defaultStock,
                experienceWeight,
                levels,
                name,
                positionWeight,
                showStock,
                stockDiscount,
                valuation,
                vestingYears,
                defaultPosition,
            } = this.$data;
            return {
                uid,
                defaultMarket,
                defaultStock,
                experienceWeight,
                levels,
                name,
                positionWeight,
                showStock,
                stockDiscount,
                valuation,
                vestingYears,
                defaultPosition,
            }
        }
    }
</script>

<style lang="scss">
    #builder .d-inline-block {
        display: inline-block;
    }
    input[type=checkbox] {
        display: inline;
        width: unset;
    }
    #builder {
        .table {
            td, th{
                padding: .4em;
            }
        }
        button[type=submit] {
            display: block;
            width: 100%;
        }
    }
</style>