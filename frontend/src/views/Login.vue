<template>
  <main>
    <div class="card-auth">
      <h1 class="card-auth__title" v-if="mode == 'login'">Se connecter</h1>
      <h1 class="card-auth__title" v-else>Créer un compte</h1>

      <img
        class="card-auth__logo"
        src="../assets/logo-auth.png"
        alt="logo groupomania"
      />

      <div class="form-auth">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Votre adresse mail Groupomania"
          v-model="dataLogin.email"
          required
        />
        <label for="password">Mot de passe</label>
        <input
          type="password"
          name="password"
          placeholder="Votre mot de passe Groupomania"
          v-model="dataLogin.password"
          required
        />
      </div>
      <div class="form-auth" v-if="mode == 'signUp'">
        <label for="firstname">Prénom</label>
        <input
          type="text"
          name="firstname"
          placeholder="Votre prénom"
          v-model="dataLogin.firstname"
          required
        />
        <label for="lastname">Nom</label>
        <input
          type="text"
          name="lastname"
          placeholder="Votre nom"
          v-model="dataLogin.lastname"
          required
        />
      </div>
      <button @click.prevent="login" v-if="mode == 'login'">
        S'identifier
      </button>
      <button @click.prevent="signUp" v-else>S'inscrire</button>

      <p v-if="mode == 'signUp'">
        Déjà inscrit ?
        <span class="card-auth__action" @click="switchToLogin"
          >Se connecter</span
        >
      </p>
      <p v-else>
        Pas encore inscrit ?
        <span class="card-auth__action" @click="switchToSignUp"
          >Créer un compte</span
        >
      </p>
    </div>
  </main>
</template>

<script>
//Module dependencies
import axios from "axios";

//Get localstorage user key
let userInLocalStorage = JSON.parse(localStorage.getItem("user"));

export default {
  name: "Login",
  // Set data
  data() {
    return {
      dataLogin: {
        email: null,
        lastname: null,
        firstname: null,
        password: null,
      },
      mode: "login",
    };
  },
  // Register mounted() hook
  mounted() {
    if (userInLocalStorage != null) {
      this.$router.push("/home");
    }
  },
  // Alternate Signup and login screen
  methods: {
    switchToSignUp() {
      this.mode = "signUp";
    },
    switchToLogin() {
      this.mode = "login";
    },

    // Create user key in localstorage
    saveUserInLocalStorage(response) {
      if (userInLocalStorage === null) {
        userInLocalStorage = [];
        userInLocalStorage.push(response);
        localStorage.setItem("user", JSON.stringify(userInLocalStorage));
      } else {
        localStorage.clear();
        userInLocalStorage = [];
        userInLocalStorage.push(response);
        localStorage.setItem("user", JSON.stringify(userInLocalStorage));
      }
    },
    // Login operations
    login() {
      // API request check email and password
      axios
        .post("http://localhost:3000/api/auth/login", {
          email: this.dataLogin.email,
          password: this.dataLogin.password,
        })
        // Call method to create user key in localstorage
        .then((response) => {
          this.saveUserInLocalStorage(response.data), this.$router.go();
        })
        .catch(() => {
          alert("Identifiant ou mot de passe incorrect !");
        });
    },
    // Signup operations
    signUp() {
      //Set password regex
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,30})$/;
      //Set email regex
      const emailRegex = /^[^@&"/()!_$*€£`+=;?#]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      // Check email and password regex compliance
      if (passwordRegex.test(this.dataLogin.password) == true) {
        if (emailRegex.test(this.dataLogin.email) == true) {
          // API request to create new user
          axios
            .post("http://localhost:3000/api/auth/signup", {
              email: this.dataLogin.email,
              firstname: this.dataLogin.firstname,
              lastname: this.dataLogin.lastname,
              password: this.dataLogin.password,
            })
            // Call method to create user key in localstorage, then redirect to home page
            .then((response) => {
              this.saveUserInLocalStorage(response.data),
                this.$store.dispatch("getUserInfos"),
                this.$router.push("Home");
            })
            .catch(() => {
              alert("Cette adresse email existe déjà !");
            });
        } else {
          alert("Mauvaise adresse email");
        }
      } else {
        alert(
          "Votre mot de mot de passe doit contenir au moins : une lettre minuscule, une lettre majuscule, un chiffre, un de ces caractères spéciaux: $ @ % * + - _ ! et 8 à 30 caractères"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-auth {
  background-color: white;
  border: solid 1px #dfe0e3;
  max-width: 300px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  margin: auto;
  margin-top: 10%;
  h1 {
    color: #050505;
    font-size: 20px;
  }
  button {
    height: 40px;
    background-color: #1b74e4;
    border: none;
    color: white;
    font-weight: bolder;
    font-size: 18px;
    margin-top: 25px;
    cursor: pointer;
    border-radius: 20px;
    opacity: 90%;
    &:hover {
      opacity: 100%;
      transition-duration: 200ms;
    }
  }
  &__logo {
    display: flex;
    justify-content: center;
    height: 80px;
    object-fit: contain;
    padding: 25px 0;
  }

  .form-auth {
    display: flex;
    flex-direction: column;
    input {
      height: 30px;
      margin-bottom: 15px;
      padding: 5px 15px;
      border-radius: 20px;
      border: none;
      background-color: #f0f2f5;
      &::placeholder {
        color: #65676b;
      }
    }
    label {
      color: #65676b;
    }
  }
  &__action {
    cursor: pointer;
    color: #1b74e4;
    font-weight: bold;
    opacity: 90%;
    &:hover {
      opacity: 100%;
      transition-duration: 200ms;
    }
  }
}

@media only screen and (max-width: 768px) {
  .card {
    width: 75%;
  }
}
</style>