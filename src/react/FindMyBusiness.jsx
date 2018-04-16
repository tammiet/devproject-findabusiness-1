import React from 'react';
import GoogleMap from './GoogleMap.jsx'

class FindMyBusiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      zip: '', 
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = {};
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }

    this.setState(formData);
  }

  render() {
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
        { this.state.name && this.state.zip &&
          <GoogleMap name={this.state.name} zip={this.state.zip} />
        }
      </div>
    )
  }
}

module.exports = FindMyBusiness