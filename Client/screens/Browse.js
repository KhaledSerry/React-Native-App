import React, { Component } from 'react'
import {ActivityIndicator, AsyncStorage,Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity ,KeyboardAvoidingView,Keyboard,Alert} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Card, Badge, Button, Block, Text ,Input} from '../components';
import { theme, mocks } from '../constants';

const { width } = Dimensions.get('window');

class Browse extends Component {
  state = {
    active: 'View Clients',
    categories: [],
    token:null,
    tags: null,
    custom_fields: null,
    clientId: null,
    title:null,
    thumbnail_images:null,
    errors: [],
    loading: false,
    count:0,
    name:null,
    email:null,
    password:null,
    phone:null,
  }


  handleClientAdd() {
    const { tags, custom_fields, clientId,title,thumbnail_images } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (!tags) errors.push('tags');
    if (!custom_fields) errors.push('custom_fields');
    if (!clientId) errors.push('clientId');
    if (!title) errors.push('title');
    if (!thumbnail_images) errors.push('thumbnail_images');


    fetch('https://testingreactnative.herokuapp.com/api/client/createclient', {
      method: 'POST',
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
        if (!data.data) {
          if(data.message=="No user found.")
          errors.push('email');
          else
          errors.push('tags');
          console.log(data)
          this.setState({ errors, loading: false });
        } else {
         Alert.alert(
          'Success!',
          'The Client has been created',
          [
            {
              text: 'Continue', onPress: () => {
                this.setState({ errors, loading: false,active:"View Clients" })
              }
            }
          ],
          { cancelable: false }
        )
          
          
         
        }
      })
    })

    this.setState({ errors, loading: false });
  }




  handleAdminAdd() {
    const { name, phone, email,password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (!name) errors.push('name');
    if (!email) errors.push('email');
    if (!password) errors.push('password');
    if (!phone) errors.push('phone');


    fetch('https://testingreactnative.herokuapp.com/api/admin/register', {
      method: 'POST',
      body: JSON.stringify({
        name:this.state.name,
        email:this.state.email,
        password:this.state.password,
        phone:this.state.phone,
      }),
      headers: {
        'x-access-token':this.state.token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (!data.data) {
          errors.push('email');
          console.log(data)
          this.setState({ errors, loading: false });
        } else {
         Alert.alert(
          'Success!',
          'The Admin has been created',
          [
            {
              text: 'Continue', onPress: () => {
                this.setState({ errors, loading: false,active:"View Clients" })
              }
            }
          ],
          { cancelable: false }
        )
          
          
         
        }
      })
    })

    this.setState({ errors, loading: false });
  }



  addCount = () => {
    this.setState({count:(this.state.count)+1}) 
    this.handleTab("View Clients")
}

decCount = () => {
  if(this.state.count>0){
  this.setState({count:(this.state.count)-1}) 
  this.handleTab("View Clients")
  }
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

  componentDidMount() {
    this._retrieveData();
  }

  handleTab = tab => {
    if(tab=="View Clients"){
      
     var token= this.state.token;
      console.log(token)
     // fetch('https://ergasti.com/blog/?json=get_posts&post_type=client&count=6&offset='+this.state.count*6, {
      fetch('https://testingreactnative.herokuapp.com/api/client', {
        method: 'GET',
        headers: {
          'x-access-token':token,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(data => {
          if (data.error) {
            console.log("error")
          } else {
            // const filtered = data.posts;
            // console.log(filtered[0].title)
            console.log(data)
            this.setState({ categories: data.data });
          }
        })
      })

    }


    this.setState({ active: tab});
  }

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { profile, navigation } = this.props;
    const { categories,errors,loading} = this.state;
    const tabs = ['View Clients', 'Add Clients', 'Add Admin'];
if(this.state.active=="View Clients"){
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Browse</Text>
          <Button onPress={() => navigation.navigate('Settings')}>
            <Image
              source={profile.avatar}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2}}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {categories.map(product => (
              <TouchableOpacity
                key={product.title}
                onPress={() => this.props.navigation.navigate('Product', { 'product':product })}
              >
                <Card center middle shadow style={styles.category}>
                     {/* <Image  style={{width: 45, height: 45}} source={{uri:product.attachments[0].url}} />  */}
                     <Image  style={{width: 45, height: 45}} source={{uri:product.thumbnail_images}} /> 
                  <Text medium height={20}>{product.title}</Text>
                  {/* <Text gray caption>{product.tags} products</Text> */}
                </Card>
              </TouchableOpacity>
            ))}

          

          </Block>
          <Block flex={false} row space="between" style={styles.categories}>
          <Button onPress={this.decCount}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Previous
              </Text>
            </Button>
              <Button onPress={this.addCount}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Next
              </Text>
            </Button>
            </Block>
        </ScrollView>
      </Block>
    )
}
if(this.state.active=="Add Clients"){
  const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
return(
  
  <Block>
  <Block flex={false} row center space="between" style={styles.header}>
    <Text h1 bold>Browse</Text>
    <Button onPress={() => navigation.navigate('Settings')}>
      <Image
        source={profile.avatar}
        style={styles.avatar}
      />
    </Button>
  </Block>

  <Block flex={false} row style={styles.tabs}>
    {tabs.map(tab => this.renderTab(tab))}
  </Block>



        
        
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

            <Button gradient onPress={() => this.handleClientAdd()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Add Client</Text>
              }
            </Button>
            
            
          </Block>
          
        </Block>
        </KeyboardAwareScrollView>

        </Block>
        
)

}

if(this.state.active=="Add Admin"){
  const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
return(
  
  <Block>
  <Block flex={false} row center space="between" style={styles.header}>
    <Text h1 bold>Browse</Text>
    <Button onPress={() => navigation.navigate('Settings')}>
      <Image
        source={profile.avatar}
        style={styles.avatar}
      />
    </Button>
  </Block>

  <Block flex={false} row style={styles.tabs}>
    {tabs.map(tab => this.renderTab(tab))}
  </Block>



        
        
          <KeyboardAwareScrollView  behavior="padding">
          <Block padding={[0, theme.sizes.base * 2]}>
        <Block middle>
        <Input
              label="Name"
              error={hasErrors('name')}
              style={[styles.input, hasErrors('name')]}
              defaultValue={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
            <Input
              email
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
            secure
              label="Password"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Input
              label="Phone"
              error={hasErrors('phone')}
              style={[styles.input, hasErrors('phone')]}
              defaultValue={this.state.phone}
              onChangeText={text => this.setState({ phone: text })}
            />
          
            <Button gradient onPress={() => this.handleAdminAdd()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Add Admin</Text>
              }
            </Button>
            
            
          </Block>
          
        </Block>
        </KeyboardAwareScrollView>

        </Block>
        
)

}

  }
}

Browse.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
}

export default Browse;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
  signup: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
