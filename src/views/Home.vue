<template>
    <div class="home-wrapper">
        <div class="aleam-lists">
            <div v-for="(alarm, key) in alarm_data" :key="key" class="aleam">
                <div class="aleam-time">
                    <span>{{alarm.repeat}}</span>
                    <span>{{alarm.hours}}:{{alarm.minutes}}</span>
                </div>
                <div class="aleam-sound">
                    <span>{{alarm.name}}</span>
                </div>
                <div class="block aleam-istrue-button">
                    <input data-index=alarm._id :id=alarm._id @click=toggleChange(alarm._id,alarm.isEnable) v-model=alarm.isEnable type="checkbox" />
                    <label :for=alarm._id></label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const app = window.app;
    var Datastore = require('nedb');
    var path = require('path');
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
       //  filename: '../data.db',
        autoload: true
    });
    export default {
        name: 'Home',
        props: {
         msg: String
        },
        data (){
            return{
                alarm_data: []
            }
        },
        methods:{
            getData: function() {
                db.loadDatabase((error) => {
                    if (error !== null)console.error(error);
                    console.log("load database completed.");
                });
                db.find({}, function(err, docs) {
                    this.alarm_data = docs;
                    console.log(this.alarm_data);
                }.bind(this)); 
            },
            toggleChange(id,isEnable){
                if(isEnable){
                    db.update({ _id: id }, { $set:{isEnable: false} }, {}, function (err, numReplaced) {
                        console.log('err', err);
                        console.log('numReplaced', numReplaced);
                        console.log('isEnable', true);
                    });
                }else{
                    db.update({ _id: id }, { $set:{isEnable: true} }, {}, function (err, numReplaced) {
                        console.log('err', err);
                        console.log('numReplaced', numReplaced);
                        console.log('isEnable', false);
                    });  
                }
            }
        },
        created(){
            this.getData();
            //this.$emit('nextAlarm');
        }
    }

</script>

<style scoped>
    /*スクロールバーの横幅指定*/
    .aleam-lists::-webkit-scrollbar {
        width: 15px;
    }
    /*スクロールバーの背景色・角丸指定*/
    .aleam-lists::-webkit-scrollbar-track {
      border-radius: 10px;
        background: #f2f2f2;
    }
    /*スクロールバーの色・角丸指定*/
    .aleam-lists::-webkit-scrollbar-thumb {
      border-radius: 10px;
        background:#09C9D9;
    }
    .home-wrapper{
        display:flex;
        flex-direction: column;
    }
    .aleam-lists{
        display:flex;
        flex-direction: column;
        height:400px;
        overflow-y: scroll;
    }
    .aleam{
        display:flex;
        flex-direction: row;
        height:50px;
        border-bottom: 1px ridge black;
    }
    .aleam-time{
        flex-grow: 3;
        padding-left:30px;
        line-height: 50px;
    }
    .aleam-sound{
        flex-grow: 3;
        line-height: 50px;
        font-size:20px;
        font-weight: 900;
    }
    .aleam-istrue-button{
        line-height: 50px;
    }
    .block input{
      display:none;  
    }
    .block{
      width:100px;
      position:relative;
      clear:both;
      margin:0 0 25px;
      float: left;
    }
    .block span{
      text-transform:uppercase;
      font-weight:bold;
      letter-spacing:1px;
      font-size:15px;
    margin-left:10px;
    }
    .block label{
      width:50px;
      height:30px;
        margin-top:10px;
      box-sizing:border-box;
      border:3px solid;
      float:left;
      border-radius:100px;
      position:relative;
      cursor:pointer;
      transition:.3s ease;
    }
    input[type=checkbox]:checked + label{
      background:#55e868;
    }
    input[type=checkbox]:checked + label:before{
      left:23px;
    }
    .block label:before{
      transition:.3s ease;
      content:'';
      width:20px;
      height:20px;
      position:absolute;
      background:white;
      left:2px;
      top:2px;
      box-sizing:border-box;
      border:3px solid;
      color:black;
      border-radius:100px;
    }
</style>