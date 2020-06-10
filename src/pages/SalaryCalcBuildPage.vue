<template>
    <form id="builder-form" @submit.prevent="save" class="align-content-center">
        <header id="builder-header">
            <toggle v-model="tab" id="builder-tab">
                <toggle-item value="edit">
                    Edit
                </toggle-item>
                <toggle-item value="sharing">
                    Sharing
                </toggle-item>
                <toggle-item value="preview">
                    Preview
                </toggle-item>
            </toggle>
            <button type="submit" class="btn btn-primary">Save<spinner v-if="saving"></spinner></button>
        </header>
        <div id="builder-tab-container">
            <div v-if="tab==='edit'" id="builder">
                <salary-calc-config v-model="config"></salary-calc-config>
            </div>
            <div v-else-if="tab==='sharing'" id="sharing">
                <sharing v-model="sharing" :publicId="publicId">

                </sharing>
            </div>
            <div v-else-if="tab==='preview'" id="calc">
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
                        :costOfLivingPerYear = "costOfLivingPerYear"
                        :costOfLivingCap = "costOfLivingCap"
                ></salary-calc>
            </div>
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
    import {db, userData} from "../services/firebase";
    import Spinner from "../components/Spinner";
    import {defaultConfigModel, Share} from "../types/config";
    import {isTruthy} from "../services/truthiness";
    import {Getter} from "vuex-class";
    import Sharing from "../components/Sharing";

    @Component({
        name: "SalaryCalcBuildPage",
        components: {Sharing, Spinner, ToggleItem, Toggle, SalaryCalc, SalaryCalcConfig },
    })
    export default class SalaryCalcBuildPage extends SalaryCalcBasePage {
        constructor() {
            super();
        }
        @Getter userId;
        sharing: { isPublic: boolean, emails: Share[] } = { isPublic: false, emails: [] };
        tab = 'edit';
        saving = false;
        get publicId() { return this.config && this.config.publicId; }

        // events
        async mounted() {
            if (this.$route.params['id'] !== 'new') {
                await this.loadDataFromBackend();
            } else {
                this.id = ''
                this.config = defaultConfigModel();
                this.sharing = { isPublic: false, emails: [] };
            }
        }

        async save() {
            this.saving = true;
            try {
                if (this.id){
                    await this.saveExisting();
                } else{
                    let masterCalc = await this.saveNew();
                    let redirect = `/build/calc/${masterCalc.id}`;
                    this.$router.push(redirect);
                }
                await this.loadDataFromBackend();
            } catch (e) {
                console.error(e);
                alert('Failed to save')
            } finally {
                this.saving = false;
            }
        }

        // Save
        async saveNew() {
            let shareInfo = await this.saveSharing();
            return await userData().collection(`/calcs`).add({...this.config, ...shareInfo, uid: this.userId});
        }

        async saveExisting() {
            console.log('saving:', this.id, {...this.config, ...shareInfo, uid: this.userId})
            let shareInfo = await this.saveSharing();
            return await userData().collection(`/calcs`).doc(this.id).set({...this.config, ...shareInfo, uid: this.userId});
        }

        async saveSharing() {
            let publicId = await this.savePublicSharing();

            let emails = (await Promise.all(this.sharing.emails.map(this.saveEmail))).filter(isTruthy)

            return { publicId, emails }
        }

        private async savePublicSharing() {
            let publicDoc = {...this.getShareableConfig(), public: this.sharing.isPublic, sharedWithEmail: null, ownerUser: this.userId, uid: this.userId };
            if (this.config.publicId) {
                return await db.collection(`/shared-calcs`).doc(this.id).set(publicDoc).then(() => this.config.publicId);
            }
            else {
                return await db.collection('/shared-calcs').add(publicDoc).then(d => d.id);
            }
        }

        private getShareableConfig() {
            return Object
                .keys(this.config)
                .filter(key => !['emails', 'publicId', 'id'].includes(key))
                .reduce((result, key) => ({...result, [key]: this.config[key]}), {});
        }

        async saveEmail(share: Share) {
            let sharedCollection = db.collection('shared-calcs');
            let doc = {...this.getShareableConfig(), sharedWithEmail: share.email, public: false, ownerUser: this.userId, uid: this.userId }
            if (!share.id && !share.deleted) { // add
                console.log('add share: ', doc)
                return await sharedCollection.add(doc).then(d => d.id);
            } else if (share.id && !share.deleted) { // update
                console.log('update share: ', share.id, doc)
                return await sharedCollection.doc(share.id).set(doc).then(() => share.id);
            } else if (share.id && share.deleted) { // delete
                console.log('update delete: ', share.id)
                return await sharedCollection.doc(share.id).delete().then(() => null);
            }
        }

        // Load
        async loadDataFromBackend() {
            const doc = await userData().collection('calcs').doc(this.$route.params['id']).get();
            this.config = {...doc.data()} as any;
            this.id = doc.id;
            this.sharing = await this.fetchSharingInfo();
        }

        async fetchEmail(shareId) {
            return await db.collection('shared-calcs').doc(shareId).get()
        }

        async fetchAllEmails() {
            return await Promise.all(this.config.emails.map(this.fetchEmail));
        }

        async fetchSharingInfo() {
            const emailShareMap = share => ({ id: share.id, email: share.data().sharedWithEmail })
            const fetchPublic = () => db.collection('shared-calcs').doc(this.config.publicId).get();
            return {
                isPublic: this.config.publicId ? (await fetchPublic()).data().public : false,
                emails: this.config.emails ? (await this.fetchAllEmails()).map(emailShareMap) : []
            }
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
    #builder-tab-container {
        margin: 30px auto;
    }
</style>
