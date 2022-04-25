//Module dependencies
import { createStore } from 'vuex';
import axios from 'axios';

//Create new store instance
export default createStore({
  //root state
  state: {
    allUsersInfos: [],
    userInfos: [],
    topicInfos: [],
    commentInfos: [],
    postInfos: [],
  },
  //save mutations to store
  mutations: {
    USER_INFOS(state, userInfos) {
      state.userInfos = userInfos
    },
    ALL_USERS_INFOS(state, allUsersInfos) {
      state.allUsersInfos = allUsersInfos
    },
    COMMENT_INFOS(state, commentInfos) {
      state.commentInfos = commentInfos
    },
    POST_INFOS(state, postInfos) {
      state.postInfos = postInfos
    },
  },
  //save actions to store
  actions: {
    getUserInfos() {
      //Get localstorage user key
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      if (userInLocalStorage != null) {
        //Get localstorage user key information
        let userId = userInLocalStorage.map(user => user.userId);
        let userToken = userInLocalStorage.map(user => user.token);
        //Get user properties from API
        axios.get(`http://localhost:3000/api/auth/${userId}`, {
          headers: {
            Authorization: "Bearer " + userToken
          }
        })
          .then(response => {
            // Call commit() method of store instance -> mutation
            this.commit('USER_INFOS', response.data)
          })
          .catch((error) => {
            alert(error)
          });
      }
    },

    getAllComments() {
      //Get localstorage user key
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
      let userToken = userInLocalStorage.map(user => user.token);
      //Get all comments properties from API
      axios.get('http://localhost:3000/api/comment', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => {
          // Call commit() method of store instance -> mutation
          this.commit('COMMENT_INFOS', response.data)
        })
        .catch((error) => {
          alert(error)
        });
    },

    getAllUsers() {
      //Get localstorage user key
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
      let userToken = userInLocalStorage.map(user => user.token);
      //Get all users properties from API
      axios.get('http://localhost:3000/api/auth', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => {
          this.commit('ALL_USERS_INFOS', response.data)
        })
        .catch((error) => {
          alert(error)
        });
    },
    getAllPosts() {
      //Get localstorage user key
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
      let userToken = userInLocalStorage.map(user => user.token);
      //Get all posts properties from API
      axios.get('http://localhost:3000/api/post', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => {
          this.commit('POST_INFOS', response.data)
        })
        .catch((error) => {
          alert(error)
        });
    },
  },
})