import Vue from 'vue'
import Axios from 'axios'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export default function downloadFile(url, data, postForm) {
    return new Promise((resolve, reject) => {
        if (data) {
            if (postForm) {
                const formData = new FormData()
                Object.keys(data).forEach(key => {
                    const value = data[key]
                    if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value))
                    } else {
                        formData.append(key, data[key])
                    }
                })
                data = formData
            } else {
                data = JSON.stringify(data)
            }
        }
        Axios.request({
            baseURL: process.env.VUE_APP_API,
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Headers': 'Content-Disposition',
                'Authorization': Vue.ls.get(ACCESS_TOKEN),
                'X-Access-Token':Vue.ls.get(ACCESS_TOKEN)
            },
            data,
            responseType: 'blob'
        }).then(({ headers, data: blob }) => {
            resolve()
            // IE / Edge下载兼容
            if ('msSaveOrOpenBlob' in navigator) {
                let filename = /filename=(.+)$/.exec(headers['content-disposition'])[1]
                navigator.msSaveOrOpenBlob(blob, filename)
            } else {
                let el = document.createElement('a')
                let url = URL.createObjectURL(blob)
                let filename = /filename=(.+)$/.exec(headers['content-disposition'])[1]
                el.href = url
                el.download = decodeURIComponent(filename)
                el.style.display = 'none'
                document.body.append(el)
                el.click()
                setTimeout(() => {
                    URL.revokeObjectURL(url)
                    el.remove()
                }, 1000)
            }
        }).catch(err => {
            reject(err)
        })
    })
}