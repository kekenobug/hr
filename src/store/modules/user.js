import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth"
import { getUserDetailById, getUserInfo, login } from '@/api/user'
const state = {
    token: getToken(), // 设置token为共享状态
    userInfo: {}, // 定义一个空对象，而不是null
}
const mutations = {
    setToken(state, token) {
        state.token = token // 将数据设置给vuex
        setToken(token) // 将数据同步给缓存
    },
    removeToken(state) {
        state.token = null // 将vuex的token数据置空
        removeToken() // 缓存同步置空
    },
    setUserInfo(state, payload) {
        state.userInfo = payload
    },
    removeUserInfo(state) {
        state.userInfo = {}
    }
}
const actions = {
    async login(context, data) {
        const result = await login(data)
        context.commit('setToken', result) // 把成功取到的token存入vuex和缓存
        setTimeStamp() // 把当前时间戳存入缓存
    },
    async getUserInfo(context) {
        const result = await getUserInfo()
        const baseInfo = await getUserDetailById(result.userId)
        const baseResult = { ...result, ...baseInfo } // 合并两个接口返回的用户信息结果
        context.commit('setUserInfo', baseResult)
        return baseResult // 这里的return为后期做权限的时候埋下伏笔
    },
    logout(context) {
        context.commit('removeToken')
        context.commit('removeUserInfo')
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}

