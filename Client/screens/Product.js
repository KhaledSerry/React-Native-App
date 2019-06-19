import React, { Component } from 'react';
import {AsyncStorage, ActivityIndicator,Dimensions, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity,Alert } from 'react-native';
import Icon from 'react-native-vector-icons';

import { Button, Divider, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';


const { width, height } = Dimensions.get('window');

class Product extends Component {

  state={
    loading: false,
    token:null
  }

  _retrieveData = async () => {
    try {
      const value =    await AsyncStorage.getItem('token');
      if (value !== null) {
        // We have data!!
        this.setState({ token:value})
        this.handleTab("View Clients")
      }
    } catch (error) {
      console.log(error)
      // Error retrieving data
    }
  };


  handleClientDelete(){
    const { navigation } = this.props;
    const  product  =  navigation.getParam('product');
    console.log(product)
    var token= this.state.token;
    console.log(token)
   // fetch('https://ergasti.com/blog/?json=get_posts&post_type=client&count=6&offset='+this.state.count*6, {
    fetch('https://testingreactnative.herokuapp.com/api/client/delete/'+product._id, {
      method: 'PUT',
      headers: {
        'x-access-token':token,
        'Content-Type': 'application/json'
      }
    }).then(response => {console.log(response)
      response.json().then(data => {

        if (data.error) {
          console.log("error")
        } else {
          // const filtered = data.posts;
          // console.log(filtered[0].title)
          console.log(data)
          Alert.alert(
            'Success!',
            product.title+' has been Deleted',
            [
              {
                text: 'Continue', onPress: () => {
                  navigation.navigate('Browse')
                }
              }
            ],
            { cancelable: false }
          )
            
          
        }
      })
    })
  }

  handleHesitation(){
    const { navigation } = this.props;
    const  product  =  navigation.getParam('product');
    Alert.alert(
      'You Sure you Wanna Delete '+product.title+ '?',
      '',
      [
        {
          text: 'Yup', onPress: () => {
           this.handleClientDelete();
          }
        },
        {
          text: 'Nop', onPress: () => {
            
          }
        }
      ],
      { cancelable: false }
    )

  }

  handleClientUpdate(){
    const { navigation } = this.props;
    const  product  =  navigation.getParam('product');
    navigation.navigate('Update',{ 'product':product })
  }

   componentDidMount() {
    this._retrieveData();
  }

  renderGallery() {
    const { product } = this.props;
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        data={product.images}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item}) => (
          <Image
            source={item}
            resizeMode="contain"
            style={{ width, height: height / 2.8 }}
          />
        )}
      />
    );
  }

  render() {
    console.log(this.props)
    const { navigation } = this.props;
    const  product  =  navigation.getParam('product');
    console.log(product)

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
    

        <Block style={styles.product}>
          <Text h2 bold>{product.title}</Text>

          <Text gray light height={22}>{product.description}</Text>
          
          <Divider margin={[theme.sizes.padding * 0.9, 0]} />
          
          <Block>

              <Block
                flex={false}
                card
                center
                middle
                color="rgba(197,204,214,0.20)"
                style={styles.product}
              >
    
                <Image  style={{width: 150, height: 150}} source={{uri:product.thumbnail_images}} /> 
            </Block>
          </Block>

          <Button gradient  onPress={() => this.handleClientUpdate()}>
              {this.state.loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Update Client</Text>
              }
            </Button>

            <Button gradient startColor="#FF6347" endColor="#FF0000"  onPress={() => this.handleHesitation()}>
              {this.state.loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Delete Client</Text>
              }
            </Button>
        </Block>
      </ScrollView>
    )
  }
}



export default Product;

const styles = StyleSheet.create({
  product: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingVertical: theme.sizes.padding,
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
  },
  image: {
    width: width / 3.26,
    height: width / 3.26,
    marginRight: theme.sizes.base,
  },
  more: {
    width: 55,
    height: 55,
  }
})
