let app = new Vue({
    el: "#app",
    data: {
        files: null,
        index: 0,
        timer: null,
        flag: true,
        leftValue: {
            left: "5px"
        },
        video: ""
    },
    methods: {
        //获取文件
        getFiles(event){
            this.files = event.target.files
        },
        //开始播放
        play(){
            if(this.files === null){
                alert("缺少文件！")
                return
            }
            this.timer = setInterval(()=>{
                if(this.index < this.files.length && this.$refs.music.currentTime < this.$refs.music.duration){
                    this.redraw()
                    this.$refs.music.play()
                    this.leftValue.left = (this.$refs.music.currentTime/this.$refs.music.duration) * 400 + 5 + "px"
                }else{
                    //结束播放
                    this.$refs.music.pause()
                    clearInterval(this.timer)
                    this.$refs.music.currentTime = 0
                    this.leftValue.left = "5px"
                    this.index = 0
                    this.redraw()
                    this.flag = !this.flag
                }
            }, this.$refs.music.duration * 1000 / this.files.length)
            this.flag = !this.flag
        },
        //暂停播放
        pause(){
            this.$refs.music.pause()
            clearInterval(this.timer)
            this.flag = !this.flag
        },
        //读取与输出
        redraw(){
            let reader = new FileReader()
            try {
                reader.readAsText(this.files[this.index++], "utf8")
            } catch (error) {
                console.log("读取"+ this.index +"文件失败")
            }
            reader.onloadend = ()=>{
                this.video = reader.result
            }
        },
        //重置进度
        reset(event){
            if(this.files === null){
                alert("缺少文件！")
                return
            }
            //测量目标元素距离页面左方的距离
            function offsetLeft(element){
                if(element){
                    return element.offsetLeft + arguments.callee(element.offsetParent)
                }else{
                    return 0
                }
            }
            let value = event.pageX - offsetLeft(this.$refs.progress)
            //改变进度按钮的位置
            if(value > 5 && value < 405){
                this.leftValue.left = value + 5 + "px"
            }else if(value <= 5){
                this.leftValue.left = "5px"
            }else{
                this.leftValue.left = "405px"
            }
            this.$refs.music.currentTime = value / 400 * this.$refs.music.duration
            this.index = parseInt(value / 400 * this.files.length)
            this.redraw()
        }
    }
})