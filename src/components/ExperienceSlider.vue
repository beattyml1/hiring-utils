<template>
    <div>
        <input id="experience-slider" type="range" v-model="val" :min="minStart" :max="max" step="2500">
        <div class="ticks">
            <div v-for="level in levels" :key="level.name" class="tick" :style="tickStyle(level)">╵
                <span class="tick-label">{{level.name}}</span>
            </div>
        </div>
        <!--<div class="tick">╵-->
            <!--<span class="tick-label" :style="tickStyle(55000, 120000, 55000)">No Exp. Bootcamp</span>-->
        <!--</div>-->
        <!--<div class="tick" :style="tickStyle(60000, 120000, 55000)">-->
            <!--╵-->
            <!--<span class="tick-label">No Exp. 4 Year</span>-->
        <!--</div>-->
        <!--<div class="tick" :style="tickStyle(75000, 120000, 55000)">╵-->
            <!--<span class="tick-label">Experienced</span>-->
        <!--</div>-->
        <!--<div class="tick" :style="tickStyle(90000, 120000, 55000)">╵-->
            <!--<span class="tick-label">Senior</span>-->
        <!--</div>-->
        <!--<div class="tick" :style="tickStyle(105000, 120000, 55000)">╵-->
            <!--<span class="tick-label">Lead/Staff</span>-->
        <!--</div>-->
        <!--<div class="tick" :style="tickStyle(120000, 120000, 55000)">╵-->
            <!--<span class="tick-label">Director</span>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: "ExpereinceSlider",
        props: ['value', 'levels'],
        data() {
            return {
                val: this.value
            }
        },
        watch: {
            val() {
                this.$emit('input', this.val)
            }
        },
        computed:{
            minStart() {
                return this.levels.map(_=>_.start).reduce((a, b) => Math.min(a, b), Number.MAX_SAFE_INTEGER);
            },
            maxStart() {
                return this.levels.map(_=>_.start).reduce((a, b) => Math.max(a, b), 0)
            },
            max() {
                return this.levels.map(_=>_.max||_.start).reduce((a, b) => Math.max(a, b), 0)
            }
        },
        methods: {
            tickStyle(level) {
                let amount = level.start;
                let percent = (amount - this.minStart) / (this.max - this.minStart);
                return `left: ${percent * 100}%`;
            },
        }
    }
</script>

<style scoped>

    .tick-label {
        display: block;
        position: absolute;
        transform-origin: top left;
        transform: rotate(30deg);
        font-size: .9em;
        top: 0;
        padding-left: 15px;
    }
    .tick {
        position: absolute;
        width: 150px;
    }
    .ticks {
        position: absolute;
        left:20px;
        top: 43px;
        z-index: -1;
        right: 20px;
        margin-left: -10px;
    }

</style>