import React from 'react';
import GoogleMap from './GoogleMap.jsx'
import _ from 'lodash';
import Clarifai from 'clarifai';
import ReactDOM from 'react-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

class FindMyBusiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      zip: '', 
      address: 'none',
      phone: 'none',
      website: 'none',
      cateogory: '', 
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
        category: mapResult.types[0],
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

    return (
      <div className='homepage'>
        <form onSubmit={this.handleSubmit}>
          <label className="text-input">
            Name
            <input type="text" name="name" className="name" ref="name" />
          </label>
          <label className="text-input">
            Zipcode
            <input type="text" name="zip" className="zip" ref="zip" />
          </label>
          <input className="submit-btn" type="submit" value="Submit" />
        </form>
        { errors &&
          <div className='errors'>There was an error in the form you submitted</div>
        }
        { renderMap && (!errors) &&
          <div className = "results">
            <div className="map-carousel">
              <div className='google-map'>
                <GoogleMap name={this.state.name} zip={this.state.zip} resultsHandler={this.handleChange} />
                <div className="info">
                <h5>{this.state.name}</h5>
                <table>
                  <tbody>
                    <tr>
                      <td><p>Address: {this.state.address}</p></td>
                      <td><p>Phone: {this.state.phone}</p></td>
                    </tr>
                    <tr>
                      <td><p>Website: {this.state.website}</p></td>
                      <td><p>Category: {this.state.category}</p></td>
                    </tr> 
                  </tbody>
                </table>
            </div>
              </div>
              <div className="carousel-container">
                <Carousel showArrows={true}>
                  {
                    Object.keys(this.state.photos).map((key, i) => {
                    return (
                      <div className="carousel-img-display" key={i}>
                        <img className="carousel-img" src={key} style={{maxHeight:'21em'}}/>
                        <p className="legend">{this.state.photos[key]}</p>
                      </div>
                      )
                    })
                  }
                </Carousel>
              </div>
            </div>
        </div>
      }
      </div>
    )
  }
}

module.exports = FindMyBusiness