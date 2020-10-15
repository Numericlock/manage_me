<template>
    <div class="wrapper">
            <Header ref="nextAlarm2" />
        <div class="content">
            <transition
            name="costom-transition"
            :enter-active-class="transition.enter"
            :leave-active-class="transition.leave"
            > 
                <router-view @nextAlarm='nextAlarm'/>
            </transition>
        </div>
        <div class="tabbar ">
            <router-link class="tabbar-icon-wrapper" to="/">
                <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                <g>
                    <path class="st0" d="M392.859,6.031L123.288,66.938l0.91,1.692l-0.782-0.51L0,256.273l26.488,17.374l4.457-6.804v139.261
                        l254.107,99.866l209.756-104.105V228.575L512,221.753L392.859,6.031z M270.335,466.165l-91.76-36.065V325.503l-62.872-18.629v98.51
                        l-53.085-20.866V218.561l78.208-119.232l120.232,221.945l3.856-1.519l5.421-2.147V466.165z M463.136,382.226l-164.858,81.829
                        V306.52l164.858-65.383V382.226z" ></path>
                </g>
                </svg>
            </router-link>
            <router-link class="tabbar-icon-wrapper" to="/setting">
                <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                <g>
                    <rect x="424" y="24" class="st0" width="48" height="52" ></rect>
                    <rect x="424" y="188" class="st0" width="48" height="300" ></rect>
                    <rect x="384" y="100" class="st0" width="128" height="64" ></rect>
                    <rect x="231.985" y="24" class="st0" width="48" height="276.641" ></rect>
                    <rect x="231.985" y="412.641" class="st0" width="48" height="75.359" ></rect>
                    <rect x="191.985" y="324.641" class="st0" width="128" height="64" ></rect>
                    <rect x="40" y="308" class="st0" width="48" height="180" ></rect>
                    <rect x="40" y="24" class="st0" width="48" height="172"></rect>
                    <rect y="220" class="st0" width="128" height="64"></rect>
                </g>
                </svg>
            </router-link>
        </div>
    </div>
</template>
<script>
    import Header from './components/Header.vue'
   // const sqlite3 = window.sqlDatastore;
   // var sqldb = new sqlite3.Database('manageMe.db');
    // serializeは一度に１つのクエリのみ実行するモード
    //sqldb.serialize(function () {
      // テーブル作成のクエリを実行する
     // sqldb.run("create table alarms ( text, email text, age int)");
    //});
    const app = window.app;
    //const Datastore = window.Datastore;
    var Datastore = require('nedb');
    var path = require('path');
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        autoload: true
    });    
    const schedule_db = new Datastore({
        filename: path.join(app.getPath('userData'), '/schedule.db'),
        autoload: true
    });
    //const sound_db = new Datastore({ 
    //    filename: path.join(app.getPath('userData'), '/sound.db'),
    //    autoload: true
    //});
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getHours();
    console.log(hour+minutes);
    db.find({}, function(err, docs) { 

        console.log(docs); 

    }); 
    export default {
      name: 'app',
      components: {
        Header
      },
        methods: {
            nextAlarm:function(){
                db.loadDatabase((error) => {
                    if (error !== null)console.error(error);
                    console.log("load database completed.");
                });
                schedule_db.loadDatabase((error) => {
                    if (error !== null)console.error(error);
                    console.log("load database completed.");
                });
                this.$refs.nextAlarm2.getDb(db,schedule_db);
                console.log("emitきたぞおおおおお");
            }
        },
      watch: {
        $route(to, from) {
          // アニメーションの切り替え
            if(to.meta.index == 7) {
              this.transition.enter = 'animate__animated animate__fadeIn';
          }else if (to.meta.index > from.meta.index) {
            this.transition.enter = 'animate__animated animate__fadeInRight';
           // this.transition.leave = 'animate__animated animate__fadeInRight';
          }else{
            this.transition.enter = 'animate__animated animate__fadeInLeft';
           // this.transition.leave = 'animate__animated animate__fadeInRight';
          }
        },
      },
        mounted: function(){
          this.nextAlarm();  
        },
      data() {
        return {
          transition: {
            enter: '',
            leave: '',
          },
        };
      },
    };
</script>
<style>

    body *{
      font-family: "Helvetica Neue",
        Arial,
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        Meiryo,
        sans-serif;
    }
        html{
            height:100vh;
            width:100vw;
            
        }
    #app{
        margin:none;
    }
    .wrapper{
        display:flex;
        flex-direction: column;
        font-weight:bolder;
    }
    .content{
            height:400px;
            max-height:400px;
            float:left;
    }
    .tabbar{
        height:50px;
        display:flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .tabbar-icon-wrapper{
        line-height: 50px;
    }
    .tabbar-icon-wrapper svg{
        width:40px;
        height:40px;
        vertical-align: middle;
        fill: rgb(75, 75, 75);
        
    }
    .tabbar-icon-wrapper svg:hover{
        fill: red;
    }
.animate__animated {
  --animate-duration: 300ms;
}
    .animate__fadeIn{
        --animate-duration: 1000ms;
    }
</style>
