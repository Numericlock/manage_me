<template>
    <div class="aleam-add-wrapper">
        <div class="title">
            <span>New Aleam</span>
        </div>
        <form>
            <div class="input-wrapper">
                <label>
                    Name
                </label>
                <input type="text" class="alarm-input" id="aleamName" placeholder="アラーム名" v-model="name"> 
            </div>
            <div class="input-wrapper">
                <label>
                    Repeat
                </label>
                <div>
                   <multiselect
                        v-model="value"
                        :value="value"
                        :options="options" 
                        :multiple="true" 
                        :close-on-select="false" 
                        :clear-on-select="false" 
                        :preserve-search="true" 
                        placeholder="複数選択"
                        @select="onSelect"
                        @remove="onRemove">
                    </multiselect>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Sound
                </label>
                <div>
                    <multiselect 
                         v-model="sound_value" 
                         deselect-label="Can't remove this value" 
                         placeholder="１つ選択" 
                         :options="sound_options" 
                         :searchable="false" 
                         :allow-empty="false">
                    </multiselect>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Time
                </label>
                <div>
                    <vue-timepicker 
                    v-model="time" 
                    id="timepicker" 
                    placeholder="時間を入力"
                    hide-disabled-hours
                    hide-disabled-minutes
                    hide-clear-button></vue-timepicker>
                </div>
            </div>
            <div class="submit-wrapper">
                <span v-on:click="test">作成</span>
            </div>
        </form>
    </div>
</template>
<script>
    import Multiselect from 'vue-multiselect'
    import VueTimepicker from 'vue2-timepicker'
    import 'vue2-timepicker/dist/VueTimepicker.css'
    const app = window.app;
    //const Datastore = window.Datastore;
    var Datastore = require('nedb');
    var path = require('path');
    console.log(app.getPath('music'));
    const db = new Datastore({ 
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        autoload: true
    });
    const sound_db = new Datastore({ 
        filename: path.join(app.getPath('userData'), '/sound.db'),
        autoload: true
    });
    const schedule_db = new Datastore({ 
        filename: path.join(app.getPath('userData'), '/schedule.db'),
        autoload: true
    });

    //import dbData from './namelist.json';
    //console.log(db);
    export default {
        components: { 
            'vue-timepicker': VueTimepicker,
            Multiselect 
        },
        data () {
          return {
            selected: null,
            name:null,
            time: {
                HH: '00',
                mm: '00'
            },
            value: [],
            sound_value:null,
            options: ['毎日','月', '火', '水', '木', '金', '土', '日'],
            sound_options: ['sasakure','reol','女王蜂'],
            newDoc:null,
            sound_data:[],
            is_enable:true //alarmの初期値
          }
        },
        methods: {
            onSelect (option) {
              if (option === '毎日'){
                 this.value.length=0;
                 for(var i=1;i<this.options.length;i++){
                    this.value.push(this.options[i]);
                 }
              }
            },
            onRemove (option) {
                var value = this.value;
                if(option === '毎日'){
                    value.length=0;
                }else if(value.indexOf('毎日')!= -1){
                    this.value.splice(value.indexOf('毎日'),1);
                }
            },
            test(){
               // console.log(this.name);
                console.log(this.time.HH);
                console.log(this.time.mm);
             //   console.log(this.sound_value);
                var Vm = this;
              //  console.log(this.value);
                //db.remove({}, { multi: true });
                //schedule_db.remove({}, { multi: true });
                console.log(this.value);
                if (this.name !=null && this.time!=null && this.value != [] && this.sound_value != null){
                    var repeat = this.value;
                    var repeat_value;
                    if(repeat.indexOf('毎日') != -1){
                        repeat_value = "毎日";
                        this.value.splice(repeat.indexOf('毎日'),1);
                        console.log(this.value);
                    }else{
                        for(var i=0;i<repeat.length;i++){
                            if(i==0){
                                repeat_value = repeat[i];
                            }else{
                                repeat_value = repeat_value + "/" + repeat[i];
                            }
                        }
                    }
                    var dbData =  {"name":this.name,"hours":this.time.HH,"minutes":this.time.mm,"sound_value":this.sound_value,"repeat":repeat_value,"isEnable":this.is_enable};
                    db.insert(dbData, function (err, newDoc) {
                        this.newDoc = newDoc;
                        console.log(this.newDoc);
                       // var schedule_data = {"id":newDoc._id,"repeat":null};
                        var days = [ "日", "月", "火", "水", "木", "金", "土" ];
                        for(var i=0;i<this.value.length;i++){
                            console.log(days.indexOf(this.value[i])+this.time.HH+this.time.mm);
                            schedule_db.insert({
                                "id":newDoc._id,
                                "repeat":Number(days.indexOf(this.value[i])+this.time.HH+this.time.mm)
                            }, function (err, newDoc) {
                                console.log(newDoc);
                            });
                        }
                        schedule_db.find({}, function(err, docs) { 
                            console.log(docs);
                           Vm.next();
                        }); 
                       // this.nextAlarm();
                    }.bind(this));
                    db.find({}, function(err, docs) {
                        console.log(docs);
                    }.bind(this)); 
                   // this.$emit('nextAlarm');
                    this.$router.go(-1)
                }else{
                    console.log("value is empty");
                }
            },
            getSoundData(){
                sound_db.find({}, function(err, docs) {
                    this.sound_data = docs;
                }.bind(this)); 
            },
            next: function(){
                console.log("wwwwwwwwwwwおっぱいぱいぱいぱい！！！");
                this.$emit('nextAlarm');
            }
        },
        created(){
            
        }
    }
</script>
<style lang="scss">
    .aleam-add-wrapper{
        display:flex;
        flex-direction: column;
        justify-content: space-around;
        height:100%;
        .title{
            display:flex;
            justify-content: center;
            font-size:30px;
            flex-grow: 1;
            line-height: 60px;
        }
        form{
            display:flex;
            flex-direction: column;
            flex-grow: 5;
            .input-wrapper{
                display:flex;
                justify-content: space-around;
                min-height:50px;
                margin-bottom:10px;
                padding-right: 80px;
                label{
                    padding-left:40px;
                    min-width:100px;
                    width:100px;
                    line-height: 50px;
                    
                }
                .alarm-input{
                    flex-grow: 2;
                    min-height: 40px;
                    display: block;
                    padding: 8px 40px 0 8px;
                    border-radius: 5px;
                    border: 1px solid #e8e8e8;
                    background: #fff;
                    font-size: 14px;
                    font-weight: bolder;
                }
                .alarm-input:focus{
                    outline: none;
                }
                .alarm-input::placeholder{
                   color: #adadad !important; 
                }
                div{
                    flex-grow: 2;
                    span{
                        width:100% !important;
                        input{
                            width:100% !important;
                            min-height: 40px;
                            display: block;
                            padding: 8px 40px 0 8px;
                            border-radius: 5px;
                            border: 1px solid #e8e8e8;
                            background: #fff;
                            font-size: 14px;
                            font-weight: bolder;
                            color:#35495e;
                            
                        }
                        input:focus{
                            outline: none;
                        }
                        input::placeholder{
                            color: #adadad !important;
                        }
                        div{
                            width:100% !important;
                            span{
                                text-align: end;
                            }
                            div{
                                width:100% !important;
                            }
                        }
                    }
                    .multiselect__tag{
                        width:auto !important;
                    }
                    .vue__time-picker time-picker{
                        width:auto !important;
                        width:100% !important;
                        color:red;
                        .vue__time-picker input.display-time{
                            width:auto !important;
                            width:100% !important;
                            .dropdown drop-down{
                                width:100% !important;
                            }
                        }
                    }
                }
                
            }
            .submit-wrapper{
                display:flex;
                justify-content: flex-end;
                margin-bottom:10px;
                padding-right: 100px;
                button{
                    background:none;
                    border:none;
                    border-radius: 8px;
                    border: 1px solid #e8e8e8;
                    height:40px;
                    padding:10px 15px;
                }
                button:focus{
                    outline:none;
                }
            }
        }
    }
    
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css">