<template>
<div>
<video class="webcam__video" ref="video" height="560" autoplay/>
</div>
</template>
<style lang='scss'>
@import '@/assets/scss/components/index.scss';
</style>
<script>
import * as faceapi from 'face-api.js'
export default {
  mounted() {
    this.startVideo(this.$refs.video, this.openModal).then(stream => {
        console.log(stream)
    })
  },
  methods: { 
    openModal(id, text) {
        console.log(`Open modal with id:${id}`)  
    },   
    startVideo(video, openModal) {
        return new Promise ((resolve, reject) => {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia
        
            if (navigator.getUserMedia) {
                navigator.getUserMedia({ video: {} }, 
                (stream) => {
                    video.srcObject = stream
                    resolve(stream)
                }, (error) => {
                    openModal('error', 'Enable camera')
                    return reject()
                })

            } else {
                throw({ statusCode: 403, message: 'To fix this problem - enable Camera in browser' })
                return reject()
            }
        })
    }
  }
}
</script>
