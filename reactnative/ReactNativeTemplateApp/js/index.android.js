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
    Component,
    TouchableHighlight,
    DrawerLayoutAndroid,
    Image,
    BackAndroid
} = React;

var forceClient = require('./react.force.net.js');
var oauth = require('./react.force.oauth');

var Icon = require('react-native-vector-icons/MaterialIcons');

var Styles = require('./Styles.js');
var MainPage = require('./MainPage');
var TaskPage = require('./TaskPage');
var Task = require('./Task');
var ContactPage = require('./ContactPage');
var Contact = require('./Contact');
var LeadPage = require('./LeadPage');
var Lead = require('./Lead');
var OppPage = require('./OppPage');
var Opportunity = require('./Opportunity');
var MetricsPage = require('./MetricsPage');

var profileUrl = '';

var App = React.createClass({

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            authenticated: false
        };
    },

    componentDidMount: function() {
        var that = this;
        oauth.authenticate(
            function() {
                that.setState({authenticated:true});
                oauth.getAuthCredentials(
                  function (resp){
                    //var accessToken = resp.accessToken;
                    that.setState({userId: resp['userId']});
                    var soql = 'SELECT Name,SmallPhotoUrl FROM User WHERE Id = \''
                      +that.state.userId+'\' limit 1';
                    forceClient.query(soql,
                      function(response) {
                          var user = response.records[0];
                          profileUrl = user['SmallPhotoUrl'];
                          that.setState({
                            userName: user['Name'],
                            profileUrl: user['SmallPhotoUrl']
                          });
                      }
                    );
                  },
                  function (resp) {}
                );
            },
            function(error) {
                console.log('Failed to authenticate:' + error);
            }
        );

        BackAndroid.addEventListener('hardwareBackPress', function() {
          if(navigator.getCurrentRoutes().length > 1) {
            global.navigator.pop();
          } else {
            BackAndroid.exitApp();
          }
          return true;
        });
    },

    renderScene: function(route, navigator) {
      var that = this;
      var routeId = route.id;
      if (routeId === 'MainPage') {
        return (
          <MainPage navigator={navigator} userName={that.state.userName} />
        );
      }
      if (routeId === 'TaskPage') {
        return (
          <TaskPage navigator={navigator} userId={that.state.userId} type={route.passProps.type} status={route.passProps.status} />
        );
      }
      if (routeId === 'Task') {
        return (
          <Task navigator={navigator} taskId={route.passProps.taskId} />
        );
      }
      if (routeId === 'ContactPage') {
        return (
          <ContactPage navigator={navigator} userId={that.state.userId} />
        );
      }
      if (routeId === 'Contact') {
        return (
          <Contact navigator={navigator} contactId={route.passProps.contactId} />
        );
      }
      if (routeId === 'LeadPage') {
        return (
          <LeadPage navigator={navigator} userId={that.state.userId} />
        );
      }
      if (routeId === 'Lead') {
        return (
          <Lead navigator={navigator} leadId={route.passProps.leadId} />
        );
      }
      if (routeId === 'OppPage') {
        return (
          <OppPage navigator={navigator} userId={that.state.userId} />
        );
      }
      if (routeId === 'Opportunity') {
        return (
          <Opportunity navigator={navigator} oppId={route.passProps.oppId} />
        );
      }
      if (routeId === 'MetricsPage') {
        var curDat = [{date:'2016-04-13','pts':1, 'ast':2, 'reb':3, 'stl':4, 'blk':5, 'tov':6, 'min':7},
          {date:'2016-04-12','pts':9, 'ast':2, 'reb':6, 'stl':4, 'blk':5, 'tov':6, 'min':5}];
        return (
          <MetricsPage navigator={navigator} userId={that.state.userId} data={curDat} />
        );
      }
    },

    render: function() {
        var that = this;
        var navigationView = (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View>
              <View style={Styles.menuTitle}>
                <Icon name='phone-android' size={18}
                  style={{color: 'white', marginLeft: 10, marginTop: 53}}/>
                <Text style={Styles.menuTitleText}>Agent App</Text>
              </View>
              <Icon.Button name="account-box" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoContactPage}>
                  <Text style={Styles.menuText}>Contacts</Text>
              </Icon.Button>
              <Icon.Button name="adjust" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoLeadPage}>
                  <Text style={Styles.menuText}>Leads</Text>
              </Icon.Button>
              <Icon.Button name="assignment" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoOppPage}>
                  <Text style={Styles.menuText}>Opportunities</Text>
              </Icon.Button>
              <View style={Styles.cellBorder} />
              <Icon.Button name="exit-to-app" style={Styles.menuButton} color='#545454'
                  onPress={this.logout}>
                  <Text style={Styles.menuText}>Logout</Text>
              </Icon.Button>
            </View>
          </View>
        );
        return (
          <DrawerLayoutAndroid
            ref={(drawer) => { global.drawer = drawer}}
            drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}>
            <Navigator
                ref={(navigator) => global.navigator = navigator}
                style={Styles.container}
                initialRoute={{
                  id: 'MainPage',
                  name: 'Home'
                }}
                renderScene={(route, navigator) => this.renderScene(route, navigator)}
                configureScene={(route) => {
                  if (route.sceneConfig) {
                    return route.sceneConfig;
                  }
                  return Navigator.SceneConfigs.FadeAndroid;
                }}
                navigationBar={
                    <Navigator.NavigationBar
                      routeMapper={NavigationBarRouteMapper}
                      style={Styles.navBar} />
                }
              />
          </DrawerLayoutAndroid>
        );
    },

    gotoContactPage: function() {
      global.navigator.push({
        id: 'ContactPage',
        name: 'Contacts',
      });
      closeDrawer();
    },

    gotoLeadPage:function() {
      global.navigator.push({
        id: 'LeadPage',
        name: 'Leads',
      });
      closeDrawer();
    },

    gotoOppPage:function() {
      global.navigator.push({
        id: 'OppPage',
        name: 'Opportunities',
      });
      closeDrawer();
    },

    logout:function() {
      oauth.logout();
      closeDrawer();
    }
});

var openDrawer =function() {
    global.drawer.openDrawer();
  }
var closeDrawer = function() {
    global.drawer.closeDrawer();
  }

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (route !== undefined && (route.id === 'Contact' || route.id === 'Lead'
      || route.id === 'Opportunity' || route.id === 'Task' || route.id === 'TaskPage')) {

      var routes = navigator.getCurrentRoutes();
      return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => {
            navigator.pop()
          }}>
          <Icon name='keyboard-arrow-left' size={30}
              style={Styles.iconLeft}/>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
        onPress={() => {
          openDrawer()
        }}>
        <Icon name='list' size={30}
          style={Styles.iconLeft}/>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
      var that = this;
      if (profileUrl === '' || route !== undefined && (route.id === 'Contact'
        || route.id === 'Lead' || route.id === 'Opportunity'
        || route.id === 'Task' || route.id === 'TaskPage')) {

        return null;
      }
      return(
        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => {
            navigator.push({ id: 'MetricsPage', name: 'Agent Metrics' });
          }}>
          <Image
            style={{ height:30, width: 30, marginRight: 8, marginBottom: 5 }}
            source={{ uri: profileUrl }}
          />
        </TouchableOpacity>
      );
  },

  Title: function(route, navigator, index, navState) {
      if (route !== undefined && (route.id === 'Contact' || route.id === 'Lead'
        || route.id === 'Opportunity' || route.id === 'Task' || route.id === 'TaskPage')) {
        if (route.name.length > 38) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
              <Text style={Styles.navBarTitleLarge}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
            <Text style={Styles.navBarTitle}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      }
      return(
        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => {
            navigator.push({ id: 'MainPage', name: 'Home' });
          }}>
          <Image
            style={Styles.logo}
            source={require('../res/trp-logo.png')}
          />
        </TouchableOpacity>
      );
  },
};


AppRegistry.registerComponent('ReactNativeTemplateApp', () => App);
