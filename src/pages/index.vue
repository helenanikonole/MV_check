<template>
<div class="webcam__container">
<video class="webcam__video" @loadedmetadata="onPlay()" ref="video" id="inputVideo" width="500px" height="500px" autoplay/>
<canvas ref="overlay" class="webcam__canvas"/>
</div>
</template>
<style lang='scss'>
@import '@/assets/scss/components/index.scss';
</style>
<script>
import * as faceapi from 'face-api.js'
export default {
  mounted() {
      Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
            faceapi.nets.faceExpressionNet.loadFromUri('./models')
        ]).then(() => {
            this.startVideo(this.$refs.video, this.openModal).then(stream => {
                console.log(stream)
            })
        }).catch(err => {
            console.log(`Error: ${err}`)
        })
    .catch(err => {
       
    })
  },
  methods: { 
    openModal(id, text) {
        console.log(`Open modal with id:${id}`)  
    },
    onPlay() {
        const videoEl = document.getElementById('inputVideo')

        let inputSize = 512
        let scoreThreshold = 0.5

        const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })

        faceapi.detectSingleFace(videoEl, options).then(res => {
            setTimeout(() => { this.onPlay() })

            this.$overlay
        })
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
