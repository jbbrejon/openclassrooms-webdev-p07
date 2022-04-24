<template>
  <main class="main">
    <div class="main__header">
      <i class="fa-solid fa-globe"></i>
      <h1>Fil d'actualité</h1>
    </div>
    <div class="new-post">
      <form class="form-post" @submit.prevent="createPost">
        <div class="form-post__container">
          <div class="form-post__label">
            <input
              class="form-post__input-text"
              type="text"
              name="post"
              placeholder="Quoi de neuf?"
            />
          </div>
          <div class="">
            <label
              class="form-post__label"
              for="file"
              title="Joindre une image"
            >
              <input
                ref="file"
                id="file"
                name="file"
                @change="selectFile"
                type="file"
              />
              <i class="fa-solid fa-image form-post__input-file"></i>
            </label>
          </div>
        </div>
        <input type="submit" class="btn btn-post" value="Publier" />
      </form>
    </div>
    <div class="container-posts" v-for="item in post" :key="item">
      <article class="article-post">
        <div v-for="allUsers in allUsers" :key="allUsers">
          <div class="article-post__user" v-if="item.userId == allUsers.id">
            <div v-if="allUsers.avatar != null">
              <img class="article-post__user__avatar" :src="allUsers.avatar" />
            </div>

            <p
              class="article-post__user__name"
              :userId="item.userId"
              @click="getOneUser"
              v-if="allUsers.firstname != null"
            >
              {{ allUsers.firstname }} {{ allUsers.lastname }}
            </p>
            <div class="article-post__user__role" v-if="allUsers.role != null">
              ({{ allUsers.role }})
            </div>
          </div>
        </div>

        <div class="article-post__text">
          {{ item.text }}
        </div>
        <div class="article-post__picture">
          <img v-if="item.imageUrl != null" :src="item.imageUrl" />
        </div>

        <p class="article-post__date">
          {{ formatDate(item.createdAt) }}
        </p>
        <div
          v-if="item.userId == user.id || user.isAdmin == true"
          class="edit-post__deletecontainer"
        >
          <button
            class="edit-post__delete"
            title="Supprimer le post"
            @click="deletePost"
            :postId="item.id"
          >
            Supprimer le post
          </button>
        </div>
        <div
          v-if="item.userId == user.id || user.isAdmin == true"
          class="container-buttons post-buttons"
        >
          <form
            class="edit-post"
            @submit.prevent="modifyPostDescription"
            :postId="item.id"
          >
            <input
              class="edit-post__text"
              type="text"
              name="post"
              title="Modifier le texte du post"
              placeholder="Modification du texte"
            />
            <input
              type="submit"
              class="edit-post__submit"
              title="Editer le post"
              value="Modifier"
            />
          </form>
        </div>

        <form
          v-if="item.userId == user.id || user.isAdmin == true"
          class="edit-post__picture"
        >
          <label for="">
            <input
              class="edit-post__file"
              ref="file"
              id="file"
              name="file"
              title="Selectionnez un fichier"
              @change="selectFile"
              type="file"
            />
          </label>
          <button
            class="edit-post__submit"
            @click="modifyPostPicture"
            title="Modifier l'image du post"
            :postId="item.id"
          >
            Modifier l'image
          </button>
        </form>

        <div class="container-createcomment">
          <form
            class="form-createcomment"
            @submit.prevent="createComment"
            :postId="item.id"
          >
            <input
              class="form-createcomment__text"
              type="text"
              title="Rédigez ici votre commentaire"
              name="commentaire"
              placeholder="Ecrire un commentaire"
            />
            <input
              class="form-createcomment__submit"
              type="submit"
              @keyup.enter="submit"
            />
          </form>
        </div>
      </article>

      <div class="scroller">
        <div class="container-comment" v-for="i in comment" :key="i">
          <div v-if="item.id == i.postId">
            <article
              class="article-comment"
              v-for="allUsers in allUsers"
              :key="allUsers"
            >
              <div
                class="article-comment__container"
                v-if="i.userId == allUsers.id"
              >
                <div class="article-comment__user">
                  <div
                    class="article-comment__user__image"
                    v-if="allUsers.avatar != null"
                  >
                    <img :src="allUsers.avatar" />
                  </div>
                  <p
                    class="article-comment__user__name"
                    :userId="i.userId"
                    @click="getOneUser"
                    v-if="allUsers.firstname != null"
                  >
                    {{ allUsers.firstname }} {{ allUsers.lastname }}
                  </p>
                  <div class="article-comment__date">
                    <p>{{ formatDate(i.createdAt) }}</p>
                    <p v-if="i.updatedAt != i.createdAt">
                      Edité le {{ formatDate(i.updatedAt) }}
                    </p>
                  </div>
                </div>

                <div class="article-comment__text">
                  <p>{{ i.content }}</p>
                </div>
                <div
                  class="article-comment__edit"
                  v-if="i.userId == user.id || user.isAdmin == true"
                >
                  <form
                    class="form-editcomment"
                    @submit.prevent="modifyComment"
                    :commentId="i.id"
                  >
                    <input
                      class="form-editcomment__text"
                      type="text"
                      title="Renseignez la modification du commentaire"
                      name="commentaire"
                      placeholder="Entrer modification"
                    />
                    <input
                      type="submit"
                      class="form-editcomment__edit"
                      title="Cliquez ici pour modifier le commentaire"
                      value="Modifier"
                    />
                  </form>
                  <button
                    class="form-editcomment__delete"
                    @click="deleteComment"
                    title="Supprimer le commentaire"
                    :commentId="i.id"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

let userInLocalStorage = JSON.parse(localStorage.getItem("user"));

export default {
  name: "multitopic",
  data() {
    return {
      commentData: {
        content: null,
      },
      dataPost: {
        text: null,
        image: null,
      },
    };
  },
  mounted() {
    if (userInLocalStorage == null) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getAllComments");
      this.$store.dispatch("getAllUsers");
      this.$store.dispatch("getUserInfos");
      this.$store.dispatch("getAllPosts");
    }
  },
  computed: {
    ...mapState({ user: "userInfos" }),
    ...mapState({ allUsers: "allUsersInfos" }),
    ...mapState({ post: "postInfos" }),
    ...mapState({ comment: "commentInfos" }),
  },
  methods: {
    formatDate(bddDate) {
      const date = new Date(bddDate);

      const day = date.toLocaleDateString();

      const time = date.toLocaleTimeString();

      return `${day} ${time}`;
    },

    createComment(event) {
      const postId = event.target.getAttribute("postId");

      const content = event.target.elements.commentaire.value;

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      if (content != "") {
        axios
          .post(
            "http://localhost:3000/api/comment",
            {
              content: content,
              postId: postId,
              userId: userId[0],
            },
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          )
          .then(() => {
            this.$store.dispatch("getAllComments");
          })
          .catch(() => {
            alert("Impossible de mettre un commentaire");
          });
      } else {
        alert("Veuillez mettre un texte dans le champ de commentaire");
      }
    },
    modifyComment(event) {
      let commentId = event.target.getAttribute("commentId");

      const content = event.target.elements.commentaire.value;

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      if (content != "") {
        axios
          .put(
            `http://localhost:3000/api/comment/${commentId}`,
            {
              content: content,
              userIdOrder: userId[0],
            },
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          )
          .then(() => {
            this.$store.dispatch("getAllComments");
          })
          .catch(() => {
            alert("Impossible de modifier le commentaire");
          });
      } else {
        alert("Veuillez remplir le champ de modification du commentaire");
      }
    },
    deleteComment(event) {
      let commentId = event.target.getAttribute("commentId");

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      axios
        .delete(`http://localhost:3000/api/comment/${commentId}`, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
          data: {
            userIdOrder: userId[0],
          },
        })
        .then(() => {
          this.$store.dispatch("getAllComments");
        })
        .catch(() => {
          alert("Impossible de supprimer le commentaire");
        });
    },

    getOneUser(event) {
      let userId = event.target.getAttribute("userId");

      let userToken = userInLocalStorage.map((user) => user.token);

      axios
        .get(`http://localhost:3000/api/auth/${userId}`, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then(() => {
          this.$router.push(`/user/${userId}`);
        })
        .catch(() => {
          alert("Impossbile de sélectionner l'utilisateur");
        });
    },

    selectFile(event) {
      this.dataPost.image = event.target.files[0] || event.dataTransfer.files;
    },

    createPost(event) {
      const text = event.target.elements.post.value;

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      const formData = new FormData();

      formData.append("image", this.dataPost.image);
      formData.append("text", text);
      formData.append("userId", userId[0]);

      if (text != "") {
        axios
          .post("http://localhost:3000/api/post", formData, {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          })
          .then(() => {
            this.$store.dispatch("getAllPosts");
          })
          .catch(() => {
            alert("Impossible de créer le post");
          });
      } else {
        alert("Veuillez mettre une description à votre post");
      }
    },
    deletePost(event) {
      let postId = event.target.getAttribute("postId");

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      axios
        .delete(`http://localhost:3000/api/post/${postId}`, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
          data: {
            userIdOrder: userId[0],
          },
        })
        .then(() => {
          this.$store.dispatch("getAllPosts");
        })
        .catch(() => {
          alert("Impossible de supprimer le post");
        });
    },
    modifyPostDescription(event) {
      let postId = event.target.getAttribute("postId");

      let text = event.target.elements.post.value;

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      if (text != "") {
        axios
          .put(
            `http://localhost:3000/api/post/${postId}`,
            {
              text: text,
              userIdOrder: userId[0],
            },
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          )
          .then(() => {
            this.$store.dispatch("getAllPosts");
          })
          .catch(() => {
            alert("Impossbile de modifier le post");
          });
      } else {
        alert("Veuillez remplir le champ de modification du post");
      }
    },
    PostPicture(event) {
      let postId = event.target.getAttribute("postId");

      let userToken = userInLocalStorage.map((user) => user.token);

      let userId = userInLocalStorage.map((user) => user.userId);

      const formData = new FormData();

      formData.append("image", this.dataPost.image);
      formData.append("userIdOrder", userId[0]);

      axios
        .put(`http://localhost:3000/api/post/image/${postId}`, formData, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then(() => {
          this.$store.dispatch("getAllPosts");
        })
        .catch(() => {
          alert("Veuillez charger une image");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }
}

.input-border {
  border-radius: 10px;
  border: none;
}

.label-post {
  display: flex;
  align-items: center;
  width: 95%;
  justify-content: space-between;
}

.label-file {
  display: flex;
  margin-top: 10px;
  flex-direction: row;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  border-radius: 10px;
  margin-top: 20px;
}

.card-post {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: solid 1px #dfe0e3;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 15px;
  &__user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 50%;
  padding-top: 2%;
  padding-left: 2%;
  &__image {
    width: 35px;
    height: 35px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 20px;
  }
  &__description {
    display: flex;
    align-items: center;
    p {
      margin: 0;
      margin-bottom: 5px;
    }
    &__name {
      font-weight: bolder;
      &:hover {
        color: #fd3004;
        transition-duration: 200ms;
        cursor: pointer;
      }
    }
    &__create {
      font-size: 10px;
      text-align: left;
      padding: 0 5px;
      margin: 0;
      color: darkgray;
    }
  }
}

.font {
  position: relative;
  text-align: right;
  height: 0;
  &:hover {
    cursor: pointer;
  }
}

.post {
  display: flex;
  flex-direction: column;
  &__description {
    display: flex;
    padding: 5px 15px;
    text-align: left;
  }
  &__picture {
    display: flex;
    width: 100%;
    border-top: solid 2px #f2f2f2;
    border-bottom: solid 2px #f2f2f2;
    align-content: center;
    justify-content: center;
    margin-bottom: 10px;
    img {
      display: flex;
      object-fit: cover;
      width: 100%;
    }
  }
}

.card-create {
  display: flex;

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    &__hidden {
      display: none;
    }
    &__description {
      width: 90%;
      border-radius: 10px;
      padding: 5px 10px;
      background-color: #f0f2f5;
    }
  }
}

.scroller {
  display: flex;
  background-color: #ffd8d8;
  overflow-y: scroll;
  flex-direction: column;
  width: 100%;
  transition: 1000ms;
  max-height: 180px;
  margin-bottom: 20px;
  padding: 10px 0;
  border-radius: 0 0 5px 5px;
  &:hover {
    transition: 1000ms;
    max-height: 500px;
  }
}

.card-comment {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 1px;
  &__user {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
.user-comment {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 10px;
  p {
    margin: 0;
  }
}

.comment-content {
  display: flex;
  margin-top: 5px;
  flex-direction: row;
  p {
    text-align: left;
  }
}

.container-buttons {
  margin-bottom: 10px;
  display: flex;
}

.post-buttons {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  margin-bottom: 0;
  i {
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .form-modify {
    display: flex;
    margin: 0;
    width: 100%;
    &__description {
      display: flex;
      border: none;
      width: 80%;
      padding: 10px;
      margin: 20px;
      background-color: #f0f2f5;
    }
  }
}

.modify-picture {
  display: flex;
  justify-content: left;
  padding-left: 20px;
}

.button-modifypicture {
  background-color: darkorange;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
}

.button-delete {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
}

.container-edit {
  display: flex;
  align-items: center;
}

.button-edit {
  background-color: darkorange;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
}

.new-post {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 100%;
  border: solid 1px #dfe0e3;
  border-radius: 5px;
}

.form-post {
  display: flex;
  flex-direction: column;
  padding: 20px;

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  &__label {
    display: flex;
    width: 80%;
    flex-direction: column;
  }
  &__input-text {
    display: flex;
    height: 50px;
    padding: 10px;
    background-color: #dfe0e3;
    border: none;
    border-radius: 25px;
    opacity: 90%;
    &:hover {
      opacity: 100%;
    }
  }
  &__input-file {
    display: flex;
    justify-content: center;
    margin: 15px 0;
    font-size: 75px;
    color: #dfe0e3;
    opacity: 90%;
    &:hover {
      opacity: 100%;
      cursor: pointer;
    }
  }
}

.container-posts {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.article-post {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  border: solid 1px #dfe0e3;
  &__user {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    margin: 0;
    background-color: #e2e3e5;
    border-radius: 5px 5px 0 0;
    &__avatar {
      display: flex;
      height: 30px;
      object-fit: cover;
      border-radius: 50px;
    }
    &__name {
      display: flex;
      margin: 0 10px;
      font-size: 14px;
      &:hover {
        cursor: pointer;
      }
    }
    &__role {
      display: flex;
      margin: 0;
      font-size: 12px;
    }
  }
  &__text {
    display: flex;
    text-align: left;
    padding: 20px 10px;
    font-size: 14px;
  }
  &__picture {
    display: flex;
    object-fit: cover;
    width: 100%;
    img {
      object-fit: cover;
      width: 100%;
    }
  }
  &__date {
    display: flex;
    text-align: left;
    padding: 5px 10px;
    margin: 0;
    font-size: 12px;
    background-color: #dfe0e3;
  }
}

.edit-post {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: solid 1px #ffd8d8;
  border-bottom: solid 1px #ffd8d8;
  margin-bottom: 5px;
  &__text {
    display: flex;
    width: 85%;
    height: 25px;
    margin: 10px;
    background-color: #e2e3e5;
    border: none;
    padding: 5px;
    border-radius: 5px;
  }
  &__file {
    display: flex;
  }

  &__picture {
    display: flex;
    justify-content: left;
  }
  &__submit {
    display: flex;
    border: none;
    background: white;
    color: #fd3004;
    opacity: 80%;
    margin-right: 10px;
    font-size: 12px;
    &:hover {
      cursor: pointer;
      opacity: 100%;
    }
  }
  &__deletecontainer {
    display: flex;
    margin: 0;
  }
  &__delete {
    border: none;
    background-color: white;
    margin: 0;
    color: #dc3545;
    opacity: 80%;
    &:hover {
      cursor: pointer;
      opacity: 100%;
    }
  }
}

container-comment {
  display: flex;
  width: 100%;
}

.article-comment {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: auto;
  background-color: white;
  padding: 0 20px;
  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  &__user {
    display: flex;
    align-items: center;
    border-bottom: solid 1px #dfe0e3;
    &__image {
      display: flex;
      height: 25px;
      padding: 5px;
      img {
        height: 25px;
        border-radius: 50px;
        object-fit: cover;
      }
    }
    &__name {
      display: flex;
      font-size: 14px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  &__date {
    display: flex;
    font-size: 12px;
    margin: 0 10px;
  }
  &__text {
    text-align: left;
    font-size: 14px;
  }
  &__edit {
    display: flex;
  }
}

.form-editcomment {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  &__text {
    display: flex;
    background-color: #dfe0e3;
    border: none;
    border-radius: 5px;
    padding: 5px;
    width: 70%;
  }
  &__edit {
    border: none;
    color: #fd3004;
    opacity: 80%;
    background-color: white;

    &:hover {
      cursor: pointer;
      opacity: 100%;
    }
  }
  &__delete {
    border: none;
    color: #dc3545;
    opacity: 80%;
    background-color: white;
    &:hover {
      cursor: pointer;
      opacity: 100%;
    }
  }
}

.container-createcomment {
  display: flex;
}

.form-createcomment {
  display: flex;
  width: 100%;
  padding: 10px;
  &__text {
    display: flex;
    width: 100%;
    border: solid 1px #ffd8d8;
    padding: 5px;
  }
  &__submit {
    display: none;
  }
}
</style>