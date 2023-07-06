import axios from 'axios'

//响应时间
// axios.defaults.timeout = 300000; // 5 min
axios.defaults.timeout = 1200000 // 20 min
axios.defaults.headers.post['Content-Type'] = 'application/json'

// request interceptor
axios.interceptors.request.use(
  (config) => {
    config.headers['token'] = localStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// response interceptor
axios.interceptors.response.use(
  (response: any) => {
    if (response.status >= 400) {
      // 未登录或token过期
      if (response.status === 401) {
        // window.location.href = '/login'
        return
      }
      return Promise.reject(response)
    }
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = '/login'
    }
    const err = error.response.data
    return Promise.reject(err)
  }
)

export const get = (url: string, params?: object | undefined, config = {}) => {
  return axios
    .get(url, {
      params: params,
      headers: {
        token: localStorage.getItem('token')
      },
      ...config
    })
    .then((res) => res.data)
}
export const post = (url: string, params?: object | undefined, config = {}, otherheaders = {}) => {
  return axios
    .post(url, params, {
      headers: {
        token: localStorage.getItem('token'),
        ...otherheaders
      },
      ...config
    })
    .then((res) => res.data)
}

export const del = (url: string, params?: object | undefined, config = {}) => {
  return axios
    .delete(url, {
      params: params,
      headers: {
        token: localStorage.getItem('token')
      },
      ...config
    })
    .then((res) => res.data)
}

export const all = (iterable = []) => {
  return axios.all(iterable).then(
    axios.spread((acct, perms) => {
      // Both requests are now complete
      // console.log(acct, perms);
    })
  )
}

export default axios
