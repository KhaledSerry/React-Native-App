import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet ,AsyncStorage} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

export default class SignUp extends Component {
  state = {
    token:null,
    tags: null,
    custom_fields: null,
    clientId: null,
    title:null,
    thumbnail_images:null,
    errors: [],
    loading: false,
    product:null,
  }



  componentDidMount() {
    this._retrieveData();
    const { navigation } = this.props;
    const  product  =  navigation.getParam('product');
    this.setState({ 'product':product,'title':product.title,'tags':product.tags,'custom_fields':product.custom_fields,'clientId':product.clientId,'thumbnail_images':product.thumbnail_images})
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


  handleClientUpdate() {
    const { tags, custom_fields, clientId,title,thumbnail_images } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    console.log(this.state)
    if (!tags) errors.push('tags');
    if (!custom_fields) errors.push('custom_fields');
    if (!clientId) errors.push('clientId');
    if (!title) errors.push('title');
    if (!thumbnail_images) errors.push('thumbnail_images');
    const { navigation } = this.props;

    fetch('https://testingreactnative.herokuapp.com/api/client/update/'+this.state.product._id, {
      method: 'PUT',
      body: JSON.stringify({
        tags:this.state.tags,
        custom_fields:this.state.custom_fields,
        clientId:this.state.clientId,
        title:this.state.title,
        thumbnail_images:this.state.thumbnail_images
      }),
      headers: {
        'x-access-token':this.state.token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
      
        
         Alert.alert(
          'Success!',
          this.state.product.title+' has been Updated',
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
      )
    })

    this.setState({ errors, loading: false });
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    return(
      

    
    
            
            
              <KeyboardAwareScrollView  behavior="padding">
              <Block padding={[0, theme.sizes.base * 2]}>
            <Block middle>
      
      <Input
                  label="Title"
                  error={hasErrors('title')}
                  style={[styles.input, hasErrors('title')]}
                  defaultValue={this.state.title}
                  onChangeText={text => this.setState({ title: text })}
                />
                <Input
                  label="Tags"
                  error={hasErrors('tags')}
                  style={[styles.input, hasErrors('tags')]}
                  defaultValue={this.state.tags}
                  onChangeText={text => this.setState({ tags: text })}
                />
                <Input
                  label="Custom Fields"
                  error={hasErrors('custom_fields')}
                  style={[styles.input, hasErrors('custom_fields')]}
                  defaultValue={this.state.custom_fields}
                  onChangeText={text => this.setState({ custom_fields: text })}
                />
                <Input
                  label="Client ID"
                  error={hasErrors('clientId')}
                  style={[styles.input, hasErrors('clientId')]}
                  defaultValue={this.state.clientId}
                  onChangeText={text => this.setState({ clientId: text })}
                />
              
                <Input
                  label="Image"
                  error={hasErrors('thumbnail_images')}
                  style={[styles.input, hasErrors('thumbnail_images')]}
                  defaultValue={this.state.thumbnail_images}
                  onChangeText={text => this.setState({ thumbnail_images: text })}
                />
    
                <Button gradient onPress={() => this.handleClientUpdate()}>
                  {loading ?
                    <ActivityIndicator size="small" color="white" /> :
                    <Text bold white center>Update Client</Text>
                  }
                </Button>
                
                
              </Block>
              
            </Block>
            </KeyboardAwareScrollView>
    
         
            
    )
    
  }
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})
