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

var Note = React.createClass({

    getInitialState: function() {
      return {
          title: '',
          body: ''
      };
    },

    postNote: function() {
      var that = this;
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
          <Text >Title</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'black'}}
            ref="title"
            autoFocus={true}
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
            onEndEditing={(text) => {that.refs.body.focus()}}
          />
          <Text >Body</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'black'}}
            ref="body"
            onChangeText={(text) => this.setState({body: text})}
            value={this.state.body}
          />
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} 
            onPress={that.postNote}>
            <Text>Submit</Text>
          </TouchableOpacity>
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