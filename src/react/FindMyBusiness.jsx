import React from 'react';
import GoogleMap from './GoogleMap.jsx'

class FindMyBusiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      zip: '', 
      address: '',
      phone: '',
      website: '',
      cateogory: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = {};
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }

    this.setState(formData);
  }

  handleChange(mapResult) {
    this.setState({
      address: mapResult.formatted_address,
      name: mapResult.name,
      category: mapResult.types,
      phone: mapResult.formatted_phone_number,
      website: mapResult.website
    });
  }

  render() {
    let renderMap = this.state.name && this.state.zip;
    
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
        { renderMap &&
          <div>
            <GoogleMap name={this.state.name} zip={this.state.zip} resultsHandler={this.handleChange} />
            <h3>{this.state.name}</h3>
            <p>Address: {this.state.address}</p>
            <p>Phone: {this.state.phone}</p>
            <p>Website: {this.state.website}</p>
          </div>
        }
      </div>
    )
  }
}

module.exports = FindMyBusiness