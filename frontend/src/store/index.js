import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    allUsersInfos: [],
    userInfos: [],
    topicInfos: [],
    commentInfos: [],
    postInfos: [],
  },
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
  actions: {



    getUserInfos() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      if (userInLocalStorage != null) {

        let userId = userInLocalStorage.map(user => user.userId);

        let userToken = userInLocalStorage.map(user => user.token);

        axios.get(`http://localhost:3000/api/auth/${userId}`, {
          headers: {
            Authorization: "Bearer " + userToken
          }
        })
          .then(response => {
            this.commit('USER_INFOS', response.data)
          })
          .catch((error) => {
            alert(error)
          });
      }
    },


    getAllComments() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

      axios.get('http://localhost:3000/api/comment', {
        headers: {
          Authorization: "Bearer " + userToken
        }
      })
        .then(response => {
          this.commit('COMMENT_INFOS', response.data)
        })
        .catch((error) => {
          alert(error)
        });
    },
    getAllUsers() {
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

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
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

      let userToken = userInLocalStorage.map(user => user.token);

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