
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);
export default new vuex.Store({
	state: {
    token: '',
    openid:'',
    test:'111',
    id:'',
    indexspan:localStorage.getItem('indexspan') || 0,
	},
	mutations: {
		Company: (state, data) => {
			state.test = data;
    },
    setindex(state,value){
      localStorage.setItem('indexspan',value)
      state.indexspan=value
    },
    set_token(state, token) {
      state.token = token
      localStorage.setItem("set_token",token)
      sessionStorage.token = token
      },
      set_openid(state, openid) {
        state.openid = openid
      },
      set_service(state,id){
        state.id = id
      },
      del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
      }
	}
})

