import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ListView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

const utils = require('code/utils');
const firebase = require('code/sFirebase');

class AwesomeProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draft: '',
      items: [],
      dataSource: this.setDS([]),
      checkedItems: [],
      checkedDataSource: this.setDS([]),
      animating: true
    };

    firebase.loadState(state => {
      state = state || {};
      items = state.items || [];
      checkedItems = state.checkedItems || []
      this.setState({
        items: items,
        draft: '',
        dataSource: this.setDS(items),
        checkedItems: checkedItems,
        checkedDataSource: this.setDS(checkedItems),
        animating: false
      });
    });

    this.addItem = this.addItem.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderCheckedRow = this.renderCheckedRow.bind(this);
  }

  setDS(items) {
    const ds = this.getDS();
    return ds.cloneWithRows(items || this.state.items);
  }

  getDS() {
    return new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  addItem() {
    if (this.state.draft === '') {
      return;
    }
    const newItem = {
      id: utils.guid(),
      text: this.state.draft
    };
    const newItems = [...this.state.items, newItem];
    this.setState({
      items: newItems,
      draft: '',
      dataSource: this.setDS(newItems)
    }, newState => {
      this.refs['_newItem'].setNativeProps({text: ''});
      firebase.saveItems(newItems);
    });
  }

  changeText = (text) => {
    this.state.draft = text;
  }

  _onDeletePress(rowId) {
    const newItems = this.state.items.filter(item => item.id !== rowId);
     this.setState({
      items: newItems,
      dataSource: this.setDS(newItems)
     });
    firebase.saveItems(newItems);
  }

  _onCheckedPress(rowId) {
    const newItems = this.state.items.filter(item => item.id !== rowId);
    const newCheckedItems = [...this.state.checkedItems, ...this.state.items.filter(item => item.id === rowId)];
    console.log(newCheckedItems);
     this.setState({
      items: newItems,
      checkedItems: newCheckedItems,
      dataSource: this.setDS(newItems),
      checkedDataSource: this.setDS(newCheckedItems)
     });
    firebase.saveItems(newItems);
    firebase.saveCheckedItems(newCheckedItems);
  }

  _onUnCheckedPress(rowId) {

  }

  renderCheckedRow(rowData) {
    return this.renderRow(rowData, 'checkedList');
  }

  renderRow(rowData, listName) {
    let funcName, styleName, buttonText, buttonTextStyleName;

    switch (listName) {
      case 'checkedList':
        funcName = '_onUnCheckedPress';
        styleName = 'uncheckButton';
        buttonTextStyleName = 'uncheckButtonText';
        buttonText = 'UnCheck';
      break;
      default:
        funcName = '_onCheckedPress';
        styleName = 'checkButton';
        buttonText = 'Check';
        buttonTextStyleName = 'checkButtonText';
      break;
    }

    return (
      <View style={styles.row}>
        <Text style={styles.todoText}>{rowData.text}</Text>
        <TouchableHighlight
          onPress={this[funcName].bind(this, rowData.id)}
          style={styles[styleName]}>
            <Text style={styles[buttonTextStyleName]}>{buttonText}</Text>
        </TouchableHighlight>
      </View>
    );
  }

 render() {
   return (
      <View style={styles.container}>
        <TextInput
          ref={'_newItem'}
          placeholder="Add new item"
          onChangeText={text => this.setState({draft: text})} />
        <Button title="Add" onPress={this.addItem} />
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        ></ListView>
        <ActivityIndicator
          animating={this.state.animating}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <Text>Checked Items</Text>
        <ListView
          style={styles.listView}
          dataSource={this.state.checkedDataSource}
          renderRow={this.renderCheckedRow}
        ></ListView>
      </View>
   );
 }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

const styles = StyleSheet.create({
   row: {
     flex: 1,
     flexDirection: 'row',
     borderWidth:1,
     marginLeft:10,
     borderColor:'black',
     borderRadius:2,
     marginTop:5,
     padding: 5
   },
   todoText:{
     flex:9
   },
   deleteButton:{
     flex:3,
     borderWidth:1,
     borderColor:'black',
     borderRadius:5,
     backgroundColor:'red'
   },
   checkButton:{
     flex:3,
     borderWidth:1,
     borderColor:'black',
     borderRadius:5,
     backgroundColor:'green'
   },
   listView: {
     paddingLeft: 30,
     paddingRight: 30
   },
   centering: {
     alignItems: 'center',
     justifyContent: 'center',
     padding: 8,
   },
   checkButtonText: {
     textAlign:'center',
     color: '#fff'
   }
 });
