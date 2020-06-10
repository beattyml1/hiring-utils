<template>
    <div>
        <div id="public-sharing">
            <label>
                <input type="checkbox" v-model="isPublic" />
                Is Public
            </label>
            <div v-if="publicId">
                <div>Public Link</div>
                <a :href="shareLink(publicId)">
                    {{shareLink(publicId)}}
                </a>
            </div>
        </div>
        <div class="emails" id="email-sharing">
            <h1>GitHub Users</h1>
            <form class="input-group" @submit.prevent="addEmail">
                <input placeholder="GitHub User Email Address" v-model="emailToAdd" class="form-control" />
                <button type="submit" class="btn btn-primary">Add GitHub User</button>
            </form>
            <ul class="list-group" id="email-share-list">
                <li v-for="share in emails.filter(s => !s.deleted)" class="list-group-item clearfix">
                    <div class="float-left">
                        <h5>
                            <a :href="`mailto:{{share.email}}`">
                                {{share.email}}
                            </a>
                        </h5>
                        <div v-if="share.id" class="small text-muted">
                            <a :href="shareLink(share.id)">{{shareLink(share.id)}}</a>
                        </div>
                    </div>
                    <button type="button" class="btn btn-danger float-right" @click="() => removeEmail(share)">Remove</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
    #email-sharing {
        width: 500px;
        .input-group {
            margin-bottom: 10px;
        }
    }
    .input-group .btn:not(:first-child) {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }

</style>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Prop, Watch} from "vue-property-decorator";
    import {ConfigModel, Share} from "../types/config";

    @Component({

    })
    export default class Sharing extends Vue {
        @Prop(Object) value: { isPublic, emails: Share[] };
        @Prop(String) publicId: string;
        isPublic: boolean;
        emails: Share[];
        emailToAdd: '';

        data() {
            return {
                ...this.value,
                emailToAdd: ''
            }
        }
        @Watch('valueChanged')
        publicChanged() {
            this.isPublic = this.value.isPublic;
            this.emails = this.value.emails;
        }
        @Watch('isPublic')
        publicChanged() {
            this.$emit('input', {...this.value, isPublic: this.isPublic })
        }

        @Watch('emails')
        emailsChanged() {
            this.$emit('input', {...this.value, emails: this.emails })
        }
        shareLink(shareId) {
            return `https://hiringutils.com/shared-calc/${shareId}`;
        }
        removeEmail(share) {
            share.deleted = true;

        }
        addEmail() {
            if (!this.emails.some(share => share.email === this.emailToAdd))
                this.emails.push({email: this.emailToAdd})

            if (this.emails.some(share => share.email === this.emailToAdd && share.deleted))
                this.emails.find(share => share.email === this.emailToAdd && share.deleted).deleted = false;

            this.emailToAdd = '';
        }
    }
</script>
