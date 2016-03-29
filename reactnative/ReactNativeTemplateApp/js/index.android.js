'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    PixelRatio,
    Navigator,
    TouchableOpacity,
    Component
} = React;

var forceClient = require('./react.force.net.js');

var Styles = require('./Styles.js');
var MainPage = require('./MainPage');
var ContactPage = require('./ContactPage');

var App = React.createClass({

    renderScene: function(route, navigator) {
      var that = this;
      var routeId = route.id;
      if (routeId === 'Home') {
        return (
          <MainPage
              navigator={navigator} />
        );
      }
      if (routeId === 'ContactPage') {
        return (
          <ContactPage
            navigator={navigator}/>
        );
      }
    },

    render: function() {
        return (
          <Navigator
            style={Styles.container}
            initialRoute={{ id: 'Home', name: 'Index' }}
            renderScene={(route, navigator) => this.renderScene(route, navigator)}
            configureScene={(route) => {
              if (route.sceneConfig) {
                return route.sceneConfig;
              }
              return Navigator.SceneConfigs.FloatFromRight;
            }}
            navigationBar={
                <Navigator.NavigationBar
                  routeMapper={NavigationBarRouteMapper}
                  style={Styles.navBar} />
            }
          />);
    }
});

// Nav bar components
var NavButton = React.createClass({
    render: function() {
        return (<View style={Styles.navBarElt}>
                  <TouchableOpacity onPress={() => this.props.onPress()}>
                    <Text style={Styles.navBarText}>{this.props.title}</Text>
                  </TouchableOpacity>
                </View>);
    }
});


var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
      return null;
  },

  RightButton: function(route, navigator, index, navState) {
      return null;
  },

  Title: function(route, navigator, index, navState) {
      return (
              <View style={Styles.navBar}>
                <Text style={Styles.navBarText}>
                  {route.name}
                </Text>
              </View>
      );
  },
};

var UserList = React.createClass({
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
          dataSource: ds.cloneWithRows([]),
      };
    },
    
    componentDidMount: function() {
        var that = this;
        var soql = 'SELECT Id, Name FROM User LIMIT 10';
        forceClient.query(soql,
                          function(response) {
                              var users = response.records;
                              var data = [];
                              for (var i in users) {
                                  data.push(users[i]["Name"]);
                              }

                              that.setState({
                                  dataSource: that.getDataSource(data),
                              });

                          });
    },

    getDataSource: function(users: Array<any>): ListViewDataSource {
        return this.state.dataSource.cloneWithRows(users);
    },

    render: function() {
        return (
            <ListView style={Styles.scene}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow} />
      );
    },

    renderRow: function(rowData: Object) {
        return (
                <View>
                    <View style={Styles.row}>
                      <Text numberOfLines={1}>
                       {rowData}
                      </Text>
                    </View>
                    <View style={Styles.cellBorder} />
                </View>
        );
    }
});


AppRegistry.registerComponent('ReactNativeTemplateApp', () => App);
