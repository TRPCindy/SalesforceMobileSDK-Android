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
var Icon = require('react-native-vector-icons/MaterialIcons');

var NoteInfo = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        title: '',
        body: '',
        loaded: false,
        editable: false
    };
  },

  componentWillMount: function() {
    var that = this;
    var soql = 'SELECT Id,Title,Body FROM Note WHERE Id = \''
      +that.props.noteId+'\'';
    forceClient.query(soql,
      function(response) {
          if (response.records.length > 0) {
            var fields = response.records[0];
            for (var i in fields) {
                if (i === 'Title') {
                  that.setState({
                      title: fields[i]
                  });
                } else if (i === 'Body') {
                  that.setState({
                      body: fields[i]
                  });
                }
            }
          }
          that.setState({
              loaded: true
          });
      });
    },

    updateNote: function() {
      var that = this;
      that.makeEditable(false);
      forceClient.update('Note', that.props.noteId,
        { Title: that.state.title, Body: that.state.body }, 
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

    deleteNote: function() {
      var that = this;
      forceClient.del('Note', that.props.noteId, 
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

    makeEditable(value) {
      this.refs['textInput1'].setNativeProps({editable: value});
      this.refs['textInput2'].setNativeProps({editable: value});
      this.setState({editable: value});
    },

    render: function() {
        var that = this;
        if (!that.state.loaded) {
          return(
            <View style={{flex:1,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center'}}>
              <GiftedSpinner/>
            </View>
          );
        }
        return (
          <View style={Styles.scene}>
            <ScrollView>
                <TouchableOpacity
                  onPress={() => {
                    that.makeEditable(true),
                    that.refs.textInput1.focus()
                  }}>
                  <Icon name='mode-edit' size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={that.deleteNote}>
                  <Icon name='delete' size={25} />
                </TouchableOpacity>
                <Text >Title</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'black'}}
                  ref={'textInput1'}
                  editable={false}
                  defaultValue={that.state.title}
                  onChangeText={(text) => that.setState({title: text})}
                  value={that.state.title}
                />
                <View style={Styles.cellBorder} />
                <Text >Body</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1, color:'black'}}
                  ref={'textInput2'}
                  editable={false}
                  defaultValue={that.state.title}
                  onChangeText={(text) => that.setState({body: text})}
                  value={that.state.body}
                />
                <View style={Styles.cellBorder} />
                <TouchableHighlight style={{flex: 1, justifyContent: 'center'}} 
                  onPress={that.updateNote}>
                  <Text>Update</Text>
                </TouchableHighlight>
            </ScrollView>
          </View>
      );
    }
});

class Note extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <NoteInfo navigator={this.props.navigator} noteId={this.props.noteId} relatedId={this.props.relatedId}/>
    );
  }
}

module.exports = Note;
