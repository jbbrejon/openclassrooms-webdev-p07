<template>
  <main class="main">
    <div class="main__header">
      <i class="fa-solid fa-user-gear"></i>
      <h1>Gestion du profil</h1>
    </div>

    <div class="form-container">
      <h2 class="form-container__title">Modifier mes informations</h2>
      <form class="form">
        <label for="email" class="form__label">Email</label>
        <input
          class="form__input-text"
          type="email"
          name="email"
          title="Modifier l'adresse email"
          placeholder="Nouvelle adresse email"
          v-model="dataEdit.email"
        />
        <label for="firstname" class="form__label">Prénom</label>
        <input
          class="form__input-text"
          type="text"
          name="firstname"
          title="Modifier le prénom"
          placeholder="Nouveau prénom"
          v-model="dataEdit.firstname"
        />
        <label for="lastname" class="form__label">Nom</label>
        <input
          class="form__input-text"
          type="text"
          name="lastname"
          title="Modifier le nom"
          placeholder="Nouveau nom"
          v-model="dataEdit.lastname"
        />
        <label for="role" class="form__label">Role</label>
        <input
          class="form__input-text"
          type="text"
          name="role"
          title="Modifier le role"
          placeholder="Nouveau role"
          v-model="dataEdit.role"
        />
        <p class="btn btn-edit" @click="editUser">Envoyer</p>
      </form>
    </div>
    <div class="form-container">
      <h2 class="form-container__title">Modifier mon avatar</h2>
      <div class="form">
        <label class="form__file" for="file" title="Joindre une image">
          <input
            ref="file"
            id="file"
            name="file"
            @change="selectFile"
            type="file"
          />
          <i class="fa-solid fa-image"></i>
        </label>
        <p class="btn btn-edit" @click="editUserPicture">Envoyer</p>
      </div>
    </div>
    <div class="form-container">
      <h2 class="form-container__title">Modifier mon mot de passe</h2>
      <form class="form">
        <label for="password" class="form__label">Mot de passe</label>
        <input
          class="form__input-text"
          type="password"
          name="password"
          title="Modifier le mot de passe"
          placeholder="Nouveau mot de passe"
          v-model="passwordCheck.password"
        />
        <label for="firstname" class="form__label"
          >Confirmer nouveau mot de passe</label
        >
        <input
          class="form__input-text"
          type="passwordCheck"
          name="password"
          title="Saisir une nouvelle fois le nouveau mot de passe"
          placeholder="Nouveau mot de passe"
          v-model="dataEdit.password"
        />
        <p class="btn btn-edit" @click="editUserPassword">Envoyer</p>
      </form>
    </div>
    <p class="btn btn-delete" @click="deleteUser">Supprimer le compte</p>
  </main>
</template>

<script>
//Module dependencies
import axios from "axios";
import { mapState } from "vuex";

//Get localstorage user key
let userInLocalStorage = JSON.parse(localStorage.getItem("user"));

export default {
  name: "EditUser",
  // Set data
  data() {
    return {
      dataEdit: {
        lastname: null,
        email: null,
        role: null,
        firstname: null,
        password: null,
        image: null,
      },
      passwordCheck: {
        password: null,
      },
    };
  },
  // Register mounted() hook
  mounted() {
    let userInLocalStorage = JSON.parse(localStorage.getItem("user"));

    if (userInLocalStorage == null) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getUserInfos");
    }
  },
  //computed properties
  computed: {
    ...mapState({ user: "userInfos" }),
  },

  methods: {
    // Listen to file upload events
    selectFile(event) {
      this.dataEdit.image = event.target.files[0] || event.dataTransfer.files;
    },
    editUser() {
      // Get user's id from params
      const id = this.$route.params.id;
      // Set email regex
      const emailRegex = /^[^@&"/()!_$*€£`+=;?#]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      // Get token from user key in localstorage
      let userToken = userInLocalStorage.map((user) => user.token);
      // Get user's id from user key in localstorage
      let userId = userInLocalStorage.map((user) => user.userId);

      const copy = Object.assign({}, this.dataEdit);

      for (const key in copy) {
        if (copy[key] == null) {
          delete copy[key];
        }
      }

      if (
        // Check email regex compliance
        emailRegex.test(this.dataEdit.email) == true ||
        this.dataEdit.email == null
      ) {
        // API request to update user's details
        axios
          .put(
            `http://localhost:3000/api/auth/${id}`,
            {
              ...copy,
              userIdOrder: userId[0],
            },
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          )
          .then(() => {
            this.$store.dispatch("getUserInfos");
            alert("Le profil a été modifié");
            this.$router.push(`/user/${userId}`);
          })
          .catch(() => {
            alert("Impossible de modifier le profil");
          });
      } else {
        alert("Cet email n'est pas disponible");
      }
    },
    editUserPassword() {
      // Get user's id from params
      const id = this.$route.params.id;
      // Set password regex
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,30})$/;
      // Get token from user key in localstorage
      let userToken = userInLocalStorage.map((user) => user.token);
      // Get user's id from user key in localstorage
      let userId = userInLocalStorage.map((user) => user.userId);

      if (this.passwordCheck.password == this.dataEdit.password) {
        // Check email regex compliance
        if (passwordRegex.test(this.dataEdit.password) == true) {
          // API request to update user's password
          axios
            .put(
              `http://localhost:3000/api/auth/${id}`,
              {
                password: this.dataEdit.password,
                userIdOrder: userId[0],
              },
              {
                headers: {
                  Authorization: "Bearer " + userToken,
                },
              }
            )
            .then(() => {
              alert("Mot de passe modifié");
              this.$store.dispatch("getUserInfos");
              this.$router.push(`/user/${userId}`);
            })
            .catch(() => {
              alert("Impossible de modifier le mot de passe");
            });
        } else {
          alert(
            "Votre mot de mot de passe doit contenir au moins : une lettre minuscule, une lettre majuscule, un chiffre, un de ces caractères spéciaux: $ @ % * + - _ ! et 8 à 30 caractères"
          );
        }
      } else {
        alert("Veuillez entrer deux fois le même mot de passe !");
      }
    },
    editUserPicture() {
      // Get user's id from params
      const id = this.$route.params.id;
      // Get token from user key in localstorage
      let userToken = userInLocalStorage.map((user) => user.token);
      // Get user's id from user key in localstorage
      let userId = userInLocalStorage.map((user) => user.userId);
      // Set formData for file upload
      const formData = new FormData();

      formData.append("image", this.dataEdit.image);
      formData.append("userIdOrder", userId[0]);
      // API request to update user's avatar
      axios
        .put(`http://localhost:3000/api/auth/image/${id}`, formData, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then(() => {
          this.$store.dispatch("getUserInfos");
          alert("Votre photo a été modifiée");
          this.$router.push(`/user/${userId}`);
        })
        .catch(() => {
          alert("Veuillez sélectionner une photo de profil");
        });
    },
    deleteUser() {
      // Get user's id from params
      const id = this.$route.params.id;
      // Get user's id from user key in localstorage
      let userId = userInLocalStorage.map((user) => user.userId);
      // Get token from user key in localstorage
      let userToken = userInLocalStorage.map((user) => user.token);
      // API request to delete user
      axios
        .delete(`http://localhost:3000/api/auth/${id}`, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
          data: {
            userIdOrder: userId[0],
          },
        })
        .then(() => {
          // Delete user's key from localstorage
          localStorage.clear();
          // Redirection to login screen
          this.$router.push("/");
        })
        .catch(() => {
          alert("Impossible de supprimer le profil");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container-edit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 300px;
}

@media only screen and (max-width: 768px) {
  .picture {
    width: 100%;
    margin-bottom: 20px;
  }

  .user {
    width: 100%;
    &__button {
      width: 50%;
      font-size: 12px;
    }
  }

  .form {
    &__input {
      width: 100%;
    }
    &__button {
      font-size: 12px;
    }
  }
}
</style>