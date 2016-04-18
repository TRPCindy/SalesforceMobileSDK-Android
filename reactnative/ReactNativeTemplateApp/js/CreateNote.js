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

    render: function() {
      var that = this;
      return (
        <View style={Styles.row}>
          <Text tyle={Styles.textStyle}>Title</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => that.setState({text})}
            value={that.state.title}
          />
          <Text style={Styles.textStyle}>Body</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => that.setState({text})}
            value={that.state.body}
          />
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
      <Note navigator={this.props.navigator} leadId={this.props.relatedId} />
    );
  }
}

module.exports = CreateNote;