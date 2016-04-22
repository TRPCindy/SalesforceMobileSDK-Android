'use strict';

var React = require('react-native');
var {
  Stylesheet,
  Component,
  View,
  Text,
  ListView,
  ScrollView,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  TextInput
} = React;

var Styles = require('./Styles.js');
var forceClient = require('./react.force.net.js');
var GiftedSpinner = require('react-native-gifted-spinner');
var dismissKeyboard = require('dismissKeyboard');

var Note = React.createClass({

    getInitialState: function() {
      return {
          title: '',
          body: ''
      };
    },

    postNote: function() {
      var that = this;
      dismissKeyboard();
      forceClient.create('Note',
        { ParentId: that.props.relatedId, Title: that.state.title, Body: that.state.body },
        function(resp) {
          console.log(resp);
          that.props.navigator.push({
            id: 'NotePage',
            name: 'Notes',
            passProps: { relatedId: that.props.relatedId }});
        },
        function(resp) {}
      );
    },

    render: function() {
      var that = this;
      return (
        <View style={Styles.scene}>
          <View style={Styles.paddingFour}>
              <Text style={Styles.noteTitle}>Title</Text>
          </View>
          <View style={{paddingHorizontal: 4}}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'black'}}
              ref="title"
              autoFocus={true}
              onChangeText={(text) => this.setState({title: text})}
              value={this.state.title}
              onEndEditing={(text) => {that.refs.body.focus()}}
            />
          </View>
          <View style={Styles.paddingFour}>
              <Text style={Styles.noteTitle}>Body</Text>
          </View>
          <View style={{paddingHorizontal: 4}}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'black'}}
              ref="body"
              onChangeText={(text) => this.setState({body: text})}
              value={this.state.body}
            />
          </View>
          <View style={Styles.paddingFour}>
              <TouchableHighlight style={Styles.noteButton}
                onPress={that.postNote}>
                <Text style={{fontSize: 18, color: 'white', alignSelf: 'center'}}>Create</Text>
              </TouchableHighlight>
          </View>
        </View>
      );
    }
});

class CreateNote extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    var relatedId = this.props.relatedId;
    return (
      <Note navigator={this.props.navigator} relatedId={this.props.relatedId} />
    );
  }
}

module.exports = CreateNote;
