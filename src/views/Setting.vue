<template>
    <div class="setting-wrapper">
        <div class="title">
            <span>Setting</span>
        </div>
        <div class="settings">
            <div class="input-wrapper">
                <label>
                    DarkThema
                </label>
                <div class="block aleam-istrue-button">
                    <span for="darkthema">{{toggleText}}</span>
                    <input data-index="0" id="darkthema" v-on:change="toggle" type="checkbox" />
                    <label for="darkthema"></label>
                </div> 
            </div>
            <div class="input-wrapper">
                <label>
                    Add sound
                </label>
                <div class="sound-input">
                    <div class="uploadButton">
                        ファイルを選択
                        <input type="file" id="file" onchange="uv.style.display='inline-block'; uv.value = this.value;" v-on:change="file_out" />
                        <input type="text" id="uv" class="uploadValue" disabled />
                    </div>    
                     <button v-on:click="sound_register">追加</button>
                </div>
            </div>
            <div class="sounds-wrapper" id="sounds-wrapper">
                <div v-for="(sound, key) in sound_docs" :key="key" class="sound"><span class="sound-name">{{ sound.name }}</span><span v-on:click="sound_start(sound._id)" class="start">再生</span><span v-on:click="sound_stop" class="stop">stop</span><span class="delete">delete</span></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue/dist/vue.esm.js';
    import sound from '../components/sound.vue';
    const app = window.app;
    var Datastore = require('nedb');
    var path = require('path');
    const fs = window.fs;
    //const fs = require('fs');
    console.log(fs);
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/sound.db'),
       //  filename: '../data.db',
        autoload: true
    });
    //import dbData from './namelist.json';
    var textdata = "ふざけるなやよ";
    fs.writeFileSync('./src/test.txt', textdata, "utf-8", (err) => {
      if(err) {
        console.log(err);
      }
        console.log("");
    });
    const textfile = fs.readFileSync(app.getPath('music')+"/REOL/Reol/004-十中八九.flac", (err, data) => {
      if (err) throw err;
      console.log(data);
    });
    var toArrayBuffer = function(buf){    
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    console.log(textfile);
      var source;
      var audioContext = new AudioContext;
     // var fileReader   = new FileReader;
      var analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.connect(audioContext.destination);
     // fileReader.onload = function(){
     //     console.log(fileReader.result);
        audioContext.decodeAudioData(toArrayBuffer(textfile), function(buffer){
          if(source) {
            source.stop();
          }
          source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(analyser);
         // source.start(0);
        });
     // };
    export default {
        name: 'Setting',
        data () {
            return {
                toggleText: "OFF",
                file_name: null,
                file_path: null,
                sound_docs:[],
                source:null
            }
        },
        methods:{
            toggle: function(){
                if(this.toggleText=="OFF"){
                    this.toggleText = "ON";
                }else{
                    this.toggleText = "OFF";
                }
            },
            file_out: function(e){
                const files = e.target.files || e.dataTransfer.files;
                alert( files[0].name);
                alert( files[0].path);
                this.file_name = files[0].name;
                this.file_path = files[0].path;
               // fileReader.readAsArrayBuffer(e.target.files[0]);
            },
            sound_register: function(){
                if(this.file_path != null){
                    var dbData =  {"name":this.file_name,"path":this.file_path};

                    db.insert(dbData, (error, newDoc) => {

                      if(error !== null){
                        console.error(error);
                      }
                      // newDocにはアルファベット16文字の値を持つ_idフィールドが追加される
                      console.log(newDoc);
                    });
                }
            },
            appendBox(name,path){
              var ComponentClass = Vue.extend(sound);
              var instance = new ComponentClass({
                    propsData: {
                        name: name,
                        path:path
                    }           
              });
                
               // console.log(sound);
                instance.$mount();
                //console.log(instance.$el);
                document.getElementById('sounds-wrapper').appendChild(instance.$el)
            },
            getData: function() {
                var sounds = this;
                var sound_docs = null;
                db.find({}, function(err, docs) {
                    
                    for(var i = 0;i<docs.length;i++){
                        sounds.appendBox(docs[i].name,docs[i].path);
                    }
                    sound_docs = docs;
                    this.sound_docs = sound_docs;
                    console.log(this.sound_docs);
                    
                }.bind(this)); 
                this.sound_docs = sound_docs;
                console.log("あいうえお"+this.sound_docs);
              //  console.log(sounds);
            },
            narudake: function() {
                console.log("なるだけですけど？");
            },
            sound_start(id){
                var calum = this.sound_docs.filter((v) => v._id==id);
                var path = calum[0].path.replace(app.getPath('music'), '');
                const textfile = fs.readFileSync(app.getPath('music')+path, (err, data) => {
                if (err) throw err;
                    console.log(data);
                });
                var toArrayBuffer = function(buf){    
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                }
               // console.log(textfile);
                var audioContext = new AudioContext;
                // var fileReader   = new FileReader;
                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 128;
                analyser.connect(audioContext.destination);
                audioContext.decodeAudioData(toArrayBuffer(textfile), function(buffer){
                    
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = buffer;
                    this.source.connect(analyser);
                    this.source.start(0);
                }.bind(this));
                this.source = source;
            },
            sound_stop:function(){
               // var source = this.source;
                console.log(this.source);
                this.source.stop();
            }
        },
        mounted(){
            this.getData();
            this.$emit('nextAlarm');
        }
    }
</script>

<style lang="scss">
    .setting-wrapper{
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
        .settings{
            display:flex;
            flex-direction: column;
            flex-grow: 5;
            padding:0px 20px;
            .input-wrapper{
                display: flex;
       
                min-height:50px;
                margin-bottom:10px;
                label{
                  
                    min-width:30%;
                    width:30%;
                    line-height: 50px;
                    
                }
                .sound-input{
                    width:60%;
                    display: flex;
                    .uploadButton {
                        display:inline-block;
                        position:relative;
                        overflow:hidden;
                        border-top-left-radius:3px;
                        border-bottom-left-radius:3px;
                        background:#099;
                        color:#fff;
                        text-align:center;
                        padding:10px;
                        line-height:30px;
                        width:180px;
                        cursor:pointer;
                        input[type=file] {
                            position:absolute;
                            top:0;
                            left:0;
                            width:100%;
                            height:100%;    
                            cursor:pointer;
                            opacity:0;
                        }
                        .uploadValue {
                            display:none;
                            background:rgba(255,255,255,0.2);
                            border-radius:3px;
                            padding:3px;
                            color:#ffffff;
                        }   
                    }
                    .uploadButton:hover {
                        background:#0aa;
                    }
                    button{
                        background:none;
                        background:#099;
                        color:#fff;
                        font-weight: bold;
                        font-size:15px;
                        border:none;
                        border-top-right-radius:3px; 
                        border-bottom-right-radius: 3px;
                        height:100%;
                        padding:10px 15px;
                    }
                    button:focus{
                        outline:none;
                    }
                    button:hover{
                        background:#0aa;
                    }
                }
                .block{
                    padding-left:90px;
                    width:40%;
                    position:relative;
                    clear:both;
                    float: left;
                    line-height:50px;
                    input{
                        display:none;  
                    }
                    span{
                        text-transform:uppercase;
                        font-weight:bold;
                        letter-spacing:1px;
                        font-size:15px;
                        margin-left:10px;
                    }
                    label{
                        width:50px;
                        min-width: 50px;
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
                    label:before{
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
                }
            }
            .sounds-wrapper{
                flex-direction: column;
                padding:15px 40px;
                background-color:#adadad;
                border-radius: 15px;
                height:180px;
                overflow-y: auto;
                color:white;
                .sound{
                    display:flex;
                    justify-content: space-between;
                    background-color: #099;
                    padding:3px 10px;
                    border-radius: 7px;
                    margin-bottom: 3px;
                    .sound-name{
                        text-align: left;
                    }
                    .delete{
                    }
                }
                .sound:hover{
                    background-color:#0aa;
                }
            }
            .sounds-wrapper::-webkit-scrollbar {
                width: 10px;
            }
            /*スクロールバーの背景色・角丸指定*/
            .sounds-wrapper::-webkit-scrollbar-track {
              border-radius: 10px;
                background: #f2f2f2;
            }
            /*スクロールバーの色・角丸指定*/
            .sounds-wrapper::-webkit-scrollbar-thumb {
              border-radius: 10px;
                background:#09C9D9;
            }
        }
    }
</style>