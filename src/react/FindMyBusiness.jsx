import React from 'react';
import GoogleMap from './GoogleMap.jsx'
import _ from 'lodash';
import Clarifai from 'clarifai';

class FindMyBusiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      zip: '', 
      address: 'none',
      phone: 'none',
      website: 'none',
      cateogory: {}, 
      formErrors: {},
      photos: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault();
    let errors = {}
    const formData = {};
    for (const field in this.refs) {
      if (this.refs[field].value) {
        formData[field] = this.refs[field].value;
      }
      else {
        errors[field] = 'error';
      }
    }
    if (!_.isEmpty(errors)) {
      this.setState({formErrors: errors});
    }
    else {
      formData['formErrors'] = {}
      this.setState(formData);
    }
  }

  handleChange(mapResult) {
    let photoPromise = [];
    let photoObj = {};
    let urls = [];

    for (let i=0; i<5; i++) {
      if (mapResult.photos[i]) {
        let url = mapResult.photos[i].getUrl({maxHeight: 300});
        urls.push(url)
        photoPromise.push(this.predictImage(url))
      }
    }

    Promise.all(photoPromise).then((photos) => {
      urls.map((key, i) => {
        photoObj[key] = photos[i];
      });
    }).then(() => {
        this.setState({
        address: mapResult.formatted_address,
        name: mapResult.name,
        category: mapResult.types,
        phone: mapResult.formatted_phone_number,
        website: mapResult.website, 
        photos: photoObj
      });
    });
  }

  predictImage(url) {
    var app = new Clarifai.App(
    'NO18sIhXk9nZDkAdVXNPSThzPXPI8wHn78vAncxe',
    'c2vHENnTnNj6XdFkXCEWbG1g1oSdBmTqOTO44eP9'
    );

    // Predict the contents of an image by passing in a url
    return app.models.predict(Clarifai.GENERAL_MODEL, url).then(
      (response) => {
        return response.outputs[0].data.concepts[0].name;
      },
      (err) => {console.error(err);
      }
    )
  }

  render() {
    let renderMap = this.state.name && this.state.zip;
    let errors = !_.isEmpty(this.state.formErrors)
    // let photos = !_.isEmpty(this.state.photos)

    return (
      <div className='entry'>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" className="name" ref="name" />
          </label>
          <label>
            Zipcode
            <input type="text" name="zip" className="zip" ref="zip" />
          </label>
            <input type="submit" value="Submit" />
        </form>
        { errors &&
          <div className='errors'>There was an error in the form you submitted</div>
        }
        { renderMap && (!errors) &&
          <div>
            <GoogleMap name={this.state.name} zip={this.state.zip} resultsHandler={this.handleChange} />
            <h4>{this.state.name}</h4>
            <p>Address: {this.state.address}</p>
            <p>Phone: {this.state.phone}</p>
            <p>Website: {this.state.website}</p>
          </div>
        }
        { Object.keys(this.state.photos).map((key, i) => {
          return (
            <div key={i}>
              <img src={key} />
              <p>{this.state.photos[key]}</p>
            </div>
            )
          })
        }
      </div>
    )
  }
}

module.exports = FindMyBusiness