import Vue from 'vue'
export default Vue.extend({
    methods: {
        isSpace(value): boolean{
            if(!value || !value.match(/\S/g))return true;
            else return false;
        },
        zeroPadding(num, length): string{
            return ('0000000000' + num).slice(-length);
        },
        toMinutes(time): number{
            const result = (Number(time.substr(0, 1)) * 24 * 60) +
                (Number(time.substr(1, 2)) * 60) +
                Number(time.substr(3, 2));
            return result;
        }
    }
})
