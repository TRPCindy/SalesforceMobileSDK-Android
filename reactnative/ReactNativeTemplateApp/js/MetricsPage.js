'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Component,
  View,
  Text,
  ListView,
  ScrollView,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  PropTypes,
  Dimensions
} = React;


var Styles = require('./Styles.js');
var oauth = require('./react.force.oauth');
var forceClient = require('./react.force.net.js');

var Icon = require('react-native-vector-icons/MaterialIcons');

var MetricsList = React.createClass({
    
    componentDidMount: function() {
      var that = this;
      var soqlTotal = 'SELECT count() from Opportunity where Owner.Id =\''+
        that.props.userId + '\'';
      forceClient.query(soqlTotal,
        function(response) {
            that.setState({
                numTotal: response.totalSize
            });

            var soqlApproved = 'SELECT count() from Opportunity where trp_opp_Agent_Approved_Date_Time_O__c != null and Owner.Id =\''+
              that.props.userId + '\'';
            forceClient.query(soqlApproved,
              function(response) {
                  var convApproved = 0;
                  if (that.state.numTotal !== null && that.state.numTotal !== 0) {
                    convApproved = 100 * response.totalSize / that.state.numTotal;
                    convApproved = Math.round(convApproved * 100) / 100
                  }

                  that.setState({
                      numApproved: response.totalSize,
                      convApproved: convApproved
                  });

                  var soqlTouring = 'SELECT count() from Opportunity where trp_opp_Touring_Date_Time_O__c != null and Owner.Id =\''+
                    that.props.userId + '\'';
                  forceClient.query(soqlTouring,
                    function(response) {
                        var convTouring = 0;
                        if (that.state.numApproved !== null && that.state.numApproved !== 0) {
                          convTouring = 100 * response.totalSize / that.state.numApproved;
                          convTouring = Math.round(convTouring * 100) / 100
                        }

                        that.setState({
                            numTouring: response.totalSize,
                            convTouring: convTouring
                        });

                        var soqlClose = 'SELECT count() from Opportunity where trp_opp_Transaction_Signed_Date__c != null AND Owner.Id =\''+
                          that.props.userId + '\'';
                        forceClient.query(soqlClose,
                          function(response) {
                              var convClosed = 0;
                              if (that.state.numTouring !== null && that.state.numTouring !== 0) {
                                convClosed = 100 * response.totalSize / that.state.numTouring;
                                convClosed = Math.round(convClosed * 100) / 100
                              }

                              that.setState({
                                  numClosed: response.totalSize,
                                  convClosed: convClosed
                              });

                    });

              });

              });

        });
      var soqlCurTouring = 'SELECT count() from Opportunity where StageName = \'Touring\' '+
        'AND trp_opp_Transaction_Property_Type__c NOT IN (\'Seller - Resale\', \'Seller - Assignment\','+
        '\'Seller - TRP One\', \'Rental Provider\', \'Rental Seeker\', \'Mortgage\') AND Owner.Id =\''+
        that.props.userId + '\'';
      forceClient.query(soqlCurTouring,
        function(response) {

            that.setState({
                numCurTouring: response.totalSize
            });

        });
      var soqlCommission = 'SELECT sum(Commission_Paid_To_Agent__c) from Opportunity where Owner.Id =\''+
        that.props.userId + '\' and Commission_Paid_To_Agent__c != null';
      forceClient.query(soqlCommission,
        function(response) {
            console.log(response.records[0].expr0);
            var commission = 0;
            if (response.records[0].expr0 !== null) {
              commission = response.records[0].expr0;
            }
            that.setState({
                commission: commission
            });
        });
    },

    render: function() {
        var that = this;
        if (that.state === null) return null;
        return (
          <View style={Styles.scene}>
            <ScrollView>
              <Text style={Styles.textStyle}>Currently Touring: {that.state.numCurTouring}</Text>
              <Text style={Styles.textStyle}>Total Approved: {that.state.numApproved}</Text>
              <Text style={Styles.textStyle}>Approved Conversion Rate: {that.state.convApproved} %</Text>
              <Text style={Styles.textStyle}>Total Touring: {that.state.numTouring}</Text>
              <Text style={Styles.textStyle}>Touring Conversion Rate: {that.state.convTouring} %</Text>
              <Text style={Styles.textStyle}>Total Closed: {that.state.numClosed}</Text>
              <Text style={Styles.textStyle}>Closed Conversion Rate: {that.state.convClosed} %</Text>
              <Text style={Styles.textStyle}>Commission Paid To Agent: $ {that.state.commission}</Text>
            </ScrollView>
          </View>
      );
    }
});

class MetricsPage extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <MetricsList navigator={this.props.navigator} userId={this.props.userId}/>
    );
  }

  // constructor (props) {
  //   super(props)
  //   const data = this.props.data[0]
  //   const width = this.getWidth(data)
  //   this.state = {
  //     pts: new Animated.Value(width.pts),
  //     ast: new Animated.Value(width.ast),
  //     reb: new Animated.Value(width.reb),
  //     stl: new Animated.Value(width.stl),
  //     blk: new Animated.Value(width.blk),
  //     tov: new Animated.Value(width.tov),
  //     min: new Animated.Value(width.min),
  //     currentIndex: 0
  //   }
  // }

  // /**
  //  * Calculate width of each bar
  //  * @params {pts: {Number}, ast, reb, stl, blk, tov, min}
  //  * @return {pts: {Number}, ast, reb, stl, blk, tov, min}
  //  */
  // getWidth (data) {
  //   const deviceWidth = Dimensions.get('window').width
  //   const maxWidth = 350
  //   const indicators = ['pts', 'ast', 'reb', 'stl', 'blk', 'tov', 'min']
  //   const unit = {
  //     ptsUnit: Math.floor(maxWidth / 45),
  //     astUnit: Math.floor(maxWidth / 15),
  //     rebUnit: Math.floor(maxWidth / 18),
  //     stlUnit: Math.floor(maxWidth / 6),
  //     blkUnit: Math.floor(maxWidth / 7),
  //     tovUnit: Math.floor(maxWidth / 10),
  //     minUnit: Math.floor(maxWidth / 60)
  //   }
  //   let width = {}
  //   let widthCap // Give with a max cap
  //   indicators.forEach(item => {
  //     /* React-Native bug: if width=0 at first time, the borderRadius can't be implemented in the View */
  //     widthCap = data[item] * unit[`${item}Unit`] || 5
  //     width[item] = widthCap <= (deviceWidth - 50) ? widthCap : (deviceWidth - 50)
  //   })

  //   return width
  // }

  // onPressLeft () {
  //   const {currentIndex} = this.state
  //   const {data} = this.props
  //   if (currentIndex < data.length - 1) this.handleAnimation(currentIndex + 1)
  // }

  // onPressRight () {
  //   const {currentIndex} = this.state
  //   if (currentIndex > 0) this.handleAnimation(currentIndex - 1)
  // }

  // handleAnimation (index) {
  //   const {data} = this.props
  //   const width = this.getWidth(data[index])
  //   const timing = Animated.timing

  //   const indicators = ['pts', 'ast', 'reb', 'stl', 'blk', 'tov', 'min']
  //   Animated.parallel(indicators.map(item => {
  //     return timing(this.state[item], {toValue: width[item]})
  //   })).start()
  //   /**
  //    * Animated won't trigger react life cycle
  //    * I'm not sure if using animated and setState in a same time would affect performance, not bad for now
  //    */
  //   this.setState({
  //     currentIndex: index
  //   })
  // }

  // //CINDY can use something like the listview renderRow so I can do as many bars as I want

  // render () {
  //   const {pts, ast, reb, stl, blk, tov, min} = this.state
  //   const {currentIndex} = this.state
  //   const data = this.props.data[currentIndex]
  //   const d = new Date(data.date)
  //   const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()

  //   /* set opacity=0 if no prev or no next, or the size will be changed unexpected */
  //   const canPrev = currentIndex < this.props.data.length - 1 ? 1 : 0
  //   const canNext = currentIndex > 0 ? 1 : 0
  //   return (
  //     <View style={Styles.scene}>

  //       <View style={styles.item}>
  //         <Text style={styles.label}>Points</Text>
  //         <View style={styles.data}>
  //           {pts &&
  //             <Animated.View style={[styles.bar, styles.points, {width: pts}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.pts}</Text>
  //         </View>
  //       </View>
  //       <View style={styles.item}>
  //         <Text style={styles.label}>Assists</Text>
  //         <View style={styles.data}>
  //           {ast &&
  //             <Animated.View style={[styles.bar, styles.assists, {width: ast}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.ast}</Text>
  //         </View>
  //       </View>
  //       <View style={styles.item}>
  //         <Text style={styles.label}>Rebounds</Text>
  //         <View style={styles.data}>
  //           {reb &&
  //             <Animated.View style={[styles.bar, styles.rebounds, {width: reb}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.reb}</Text>
  //         </View>
  //       </View>
  //       <View style={styles.item}>
  //         <Text style={styles.label}>Steals</Text>
  //         <View style={styles.data}>
  //           {stl &&
  //             <Animated.View style={[styles.bar, styles.steals, {width: stl}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.stl}</Text>
  //         </View>
  //       </View>
  //       <View style={styles.item}>
  //         <Text style={styles.label}>Blocks</Text>
  //         <View style={styles.data}>
  //           {blk &&
  //             <Animated.View style={[styles.bar, styles.blocks, {width: blk}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.blk}</Text>
  //         </View>
  //       </View>
  //       <View style={styles.item}>
  //         <Text style={styles.label}>Turnovers</Text>
  //         <View style={styles.data}>
  //           {tov &&
  //             <Animated.View style={[styles.bar, styles.turnovers, {width: tov}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.tov}</Text>
  //         </View>
  //       </View>
  //       <View style={styles.item}>
  //         <Text style={styles.label}>Minutes</Text>
  //         <View style={styles.data}>
  //           {min &&
  //             <Animated.View style={[styles.bar, styles.minutes, {width: min}]} />
  //           }
  //           <Text style={styles.dataNumber}>{data.min}</Text>
  //         </View>
  //       </View>

  //       <View style={styles.controller}>
  //         <TouchableHighlight onPress={this.onPressLeft.bind(this)} underlayColor='transparent' style={[styles.button, {opacity: canPrev}]}>
  //           <Icon name='arrow-back' size={28} color='#6B7C96' style={styles.chevronLeft} />
  //         </TouchableHighlight>
  //         <Text style={styles.date}>{date}</Text>
  //         <TouchableHighlight onPress={this.onPressRight.bind(this)} underlayColor='transparent' style={[styles.button, {opacity: canNext}]}>
  //           <Icon name='arrow-forward' size={28} color='#6B7C96' style={styles.chevronRight} />
  //         </TouchableHighlight>
  //       </View>
  //     </View>
  //   )
  // }
}

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'column',
//     marginTop: 6
//   },
//   // Item
//   item: {
//     flexDirection: 'column',
//     marginBottom: 5,
//     paddingHorizontal: 10
//   },
//   label: {
//     color: '#CBCBCB',
//     flex: 1,
//     fontSize: 12,
//     position: 'relative',
//     top: 2
//   },
//   data: {
//     flex: 2,
//     flexDirection: 'row'
//   },
//   dataNumber: {
//     color: '#CBCBCB',
//     fontSize: 11
//   },
//   // Bar
//   bar: {
//     alignSelf: 'center',
//     borderRadius: 5,
//     height: 8,
//     marginRight: 5
//   },
//   points: {
//     backgroundColor: '#F55443'
//   },
//   assists: {
//     backgroundColor: '#FCBD24'
//   },
//   rebounds: {
//     backgroundColor: '#59838B'
//   },
//   steals: {
//     backgroundColor: '#4D98E4'
//   },
//   blocks: {
//     backgroundColor: '#418E50'
//   },
//   turnovers: {
//     backgroundColor: '#7B7FEC'
//   },
//   minutes: {
//     backgroundColor: '#3ABAA4'
//   },
//   // controller
//   controller: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 15
//   },
//   button: {
//     flex: 1,
//     position: 'relative',
//     top: -1
//   },
//   chevronLeft: {
//     alignSelf: 'flex-end',
//     height: 28,
//     marginRight: 10,
//     width: 28
//   },
//   chevronRight: {
//     alignSelf: 'flex-start',
//     height: 28,
//     marginLeft: 10,
//     width: 28
//   },
//   date: {
//     color: '#6B7C96',
//     flex: 1,
//     fontSize: 22,
//     fontWeight: '300',
//     height: 28,
//     textAlign: 'center'
//   }

// })

// MetricsPage.propTypes = {
//   data: PropTypes.array
// }

module.exports = MetricsPage;