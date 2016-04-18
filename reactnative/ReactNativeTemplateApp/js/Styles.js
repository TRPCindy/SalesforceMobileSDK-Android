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

import Dimensions from 'Dimensions';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

var Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    logo: {
        //flex: 1,
        //height: WIDTH/5,
        width: WIDTH/3,
        marginLeft: 42/360 * WIDTH,
        resizeMode: 'contain'
        //justifyContent: 'center',
        //alignSelf: 'center',
    },
    textStyle: {
        color: '#545454',
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'sans-serif-thin'
    },
    navBar: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 1
    },
    navBarText: {
        fontSize: 18,
    },
    navButtonsGroup: {
        flex: 1,
        alignItems:'center',
        flexDirection: 'row',
    },
    navBarElt: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        margin: 2,
    },
    navBarTitle: {
        marginLeft: 42/360 * WIDTH,
        color: '#545454',
        fontSize: 16,
        textAlign: 'center'
    },
    navBarTitleLarge: {
        marginLeft: 42/360 * WIDTH,
        color: '#545454',
        fontSize: 14,
        textAlign: 'center'
    },
    scene: {
        flex: 1,
        paddingTop: 50,
    },
    row: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 12,
    },
    rowNoPad: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    rowColor: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#cc0000',
        flexDirection: 'row',
        padding: 14,
        elevation: 1
    },
    cellBorder: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        // Trick to get the thinest line the device can display
        height: 1 / PixelRatio.get(),
        marginLeft: 4,
    },
    menuTitle: {
        height: 90,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#cd201f',
        alignSelf: 'stretch'
    },
    menuTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 50,
        marginLeft: 50,
        color: 'white',
        fontFamily: 'sans-serif-thin'
    },
    menuButton: {
        height: 50,
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignSelf: 'stretch'
    },
    menuText: {
        fontSize: 16,
        marginLeft: 40,
        color: '#545454',
        fontFamily: 'sans-serif-thin'
    },
    chartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    chart: {
        position: 'absolute',
        top: 16,
        left: 4,
        bottom: 4,
        right: 16,
    },
    iconLeft: {
        color: '#545454',
        marginLeft: 8,
        marginBottom: 5
    },
    flowRight: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        flex: 1
    },
    listViewIcon: {
        marginRight: 15
    }
});

module.exports = Styles;
