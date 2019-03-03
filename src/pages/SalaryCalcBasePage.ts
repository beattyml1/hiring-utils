
import {ConfigModel, defaultConfigModel} from "../types/config";
import Vue from 'vue';
import Component from "vue-class-component";
import {db, userData} from "../services/firebase";
import BaseComponent from "@/BaseComponent";

@Component({
})
export default class SalaryCalcBasePage extends BaseComponent {
    constructor() {
        super();
    }
    config: ConfigModel|null = null;
    get market() { return this.config && this.config.defaultMarket; }
    get position() { return this.config && this.config.defaultPosition; }
    get stock() { return this.config && this.config.defaultStock; }
    get valuation() { return this.config && this.config.valuation; }
    get expLevels() { return this.config && this.config.levels.filter(l => l.experience); }
    get levels() { return this.config && this.config.levels.filter(l => l.position); }
    get vestingYears() { return this.config && this.config.vestingYears; }
    get experienceWeight() { return this.config && this.config.experienceWeight; }
    get positionWeight() { return this.config && this.config.positionWeight; }
    get stockDiscount() { return this.config && this.config.stockDiscount; }
    get hasConfig() { return !!this.config; }
    async mounted() {
        if (this.$route.params.id !== 'new') {
            const doc = await userData().collection('calcs').doc(this.$route.params.id).get();
            this.config = { ...doc.data(), uid: doc.id.toString()  } as any;
        } else {
            this.config = defaultConfigModel();
        }
    }
}
