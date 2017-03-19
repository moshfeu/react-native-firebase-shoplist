const firebase = require('firebase');

class SFirebase {
  itemsRef;
  checkedItems;
  globalRef;

  globalPath = 'shoplist';
  itemsPath = 'items';
  checkedItemsPath = 'checkedItems';

  constructor() {
    this.init();

    this.globalRef = firebase.database().ref(this.globalPath);
    this.itemsRef = this.globalRef.child(this.itemsPath);
    this.checkedItemsRef = this.globalRef.child(this.checkedItemsPath);
  }

  init() {
    firebase.initializeApp({
      apiKey: "AIzaSyAhojPA0xS8tpFrmEqL8tLZx3CTiN1BRuI",
      authDomain: "shoplist-17d8b.firebaseapp.com",
      databaseURL: "https://shoplist-17d8b.firebaseio.com",
      storageBucket: "shoplist-17d8b.appspot.com",
      messagingSenderId: "663830656566"
    });
  }

  clone(obj) {
    const tempObj = Object.assign({}, obj);
    return tempObj;
  }

  saveItems(items) {
    return this.itemsRef.set(this.clone(items));
  }

  saveCheckedItems(checkedItems) {
    return this.checkedItemsRef.set(this.clone(checkedItems));
  }

  loadState(callback) {
    this.globalRef.on('value', global => {
      callback(global.val());
    });
  }
}

module.exports = new SFirebase();