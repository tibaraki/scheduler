import { config } from './config.js'

const firebase = require("firebase")
// Required for side-effects
require("firebase/firestore")

firebase.initializeApp(config)

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore()

export default ({ app }, inject) => {
  inject('db', db)
}